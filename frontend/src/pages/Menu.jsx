import { useEffect, useMemo, useState, useRef } from 'react';
import anime from 'animejs';
import API from '../api/axios';
import { 
  DollarIcon, 
  ListIcon, 
  PlusIcon, 
  TrashIcon,
  SparklesIcon,
  CheckIcon,
  BoxIcon,
  SearchIcon,
  DotsIcon
} from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { formatMoney } from '../utils/money';
import { initSocket, disconnectSocket } from '../api/socket';
import '../styles/Menu.css';

// Derive the backend origin from the API base URL (strip /api suffix)
const API_ORIGIN = (() => {
  try {
    const base = API.defaults.baseURL || '';
    return base.replace(/\/api\/?$/, '');
  } catch {
    return '';
  }
})();

const emptyForm = {
  name: '',
  description: '',
  price: '',
  category: '',
  is_available: true,
  image_url: '',
  dietary_tags: '',
  is_special: false
};

const DIETARY_OPTIONS = ['Vegan', 'Vegetarian', 'Gluten-Free', 'Spicy', 'Dairy-Free', 'Nut-Free'];

const Menu = () => {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [availability] = useState('all');
  const [dietaryFilter, setDietaryFilter] = useState('all');

  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const gridRef = useRef(null);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const fileInputRef = useRef(null);

  const load = async () => {
    const res = await API.get('/menu');
    setItems(res.data?.data || []);
  };

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      setLoading(true);
      setError('');
      try {
        await load();
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || 'Failed to load menu');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    init();
    return () => {
      mounted = false;
    };
  }, []);

  // WebSocket Integration for Menu Updates
  useEffect(() => {
    if (!user?.tenant_id) return;

    const socket = initSocket(user.tenant_id);

    const handleUpdate = () => {
      console.log('Real-time menu update received');
      load();
    };

    socket.on('menu_updated', handleUpdate);

    return () => {
      disconnectSocket();
    };
  }, [user]);

  // Animation effect when items change
  useEffect(() => {
    if (!loading && items.length > 0) {
      anime({
        targets: '.menu-card',
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(100),
        easing: 'easeOutExpo',
        duration: 800
      });
    }
  }, [loading, items.length]);

  // Modal animation
  useEffect(() => {
    if (showModal) {
      anime({
        targets: overlayRef.current,
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutQuad'
      });
      anime({
        targets: modalRef.current,
        opacity: [0, 1],
        scale: [0.95, 1],
        translateY: [20, 0],
        duration: 400,
        easing: 'easeOutBack'
      });
    }
  }, [showModal]);

  const categories = useMemo(() => {
    const set = new Set();
    (items || []).forEach((i) => {
      if (i?.category) set.add(i.category);
    });
    return ['all', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (items || [])
      .filter((i) => (category === 'all' ? true : i?.category === category))
      .filter((i) => {
        if (availability === 'all') return true;
        if (availability === 'available') return Boolean(i?.is_available);
        return !Boolean(i?.is_available);
      })
      .filter((i) => {
        if (dietaryFilter === 'all') return true;
        return (i.dietary_tags || '').toLowerCase().includes(dietaryFilter.toLowerCase());
      })
      .filter((i) => {
        if (!q) return true;
        return (
          String(i?.name || '').toLowerCase().includes(q) ||
          String(i?.description || '').toLowerCase().includes(q) ||
          String(i?.category || '').toLowerCase().includes(q)
        );
      });
  }, [items, query, category, availability, dietaryFilter]);

  const stats = useMemo(() => {
    const total = items.length;
    const available = items.filter(i => i.is_available).length;
    const specials = items.filter(i => i.is_special).length;
    const avg = total ? items.reduce((s, i) => s + Number(i.price), 0) / total : 0;
    return { total, available, specials, avg };
  }, [items]);

  /** Resolve image URL — handles both absolute URLs and relative /uploads/... paths */
  const resolveImageUrl = (url) => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return `${API_ORIGIN}${url}`;
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item?.name || '',
      description: item?.description || '',
      price: item?.price ?? '',
      category: item?.category || '',
      is_available: Boolean(item?.is_available),
      image_url: item?.image_url || '',
      dietary_tags: item?.dietary_tags || '',
      is_special: Boolean(item?.is_special)
    });
    setImageFile(null);
    setImagePreview(item?.image_url ? resolveImageUrl(item.image_url) : null);
    setFormError('');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview(null);
    setFormError('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setFormError('Please select an image file');
      return;
    }
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be smaller than 5MB');
      return;
    }

    setImageFile(file);
    setFormError('');

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setForm({ ...form, image_url: '' });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const toggleDietaryTag = (tag) => {
    const currentTags = form.dietary_tags ? form.dietary_tags.split(',').map(t => t.trim()) : [];
    let newTags;
    if (currentTags.includes(tag)) {
      newTags = currentTags.filter(t => t !== tag);
    } else {
      newTags = [...currentTags, tag];
    }
    setForm({ ...form, dietary_tags: newTags.join(', ') });
  };

  const submit = async (e) => {
    e.preventDefault();
    setFormError('');

    const name = form.name.trim();
    const description = form.description.trim();
    const categoryVal = form.category.trim();
    const price = Number(form.price);

    if (!name) return setFormError('Name is required');
    if (!categoryVal) return setFormError('Category is required');
    if (!Number.isFinite(price) || price < 0) return setFormError('Price is invalid');

    setSaving(true);
    try {
      if (imageFile) {
        // Use FormData for file upload
        const formData = new FormData();
        formData.append('image', imageFile);
        formData.append('name', name);
        formData.append('description', description);
        formData.append('category', categoryVal);
        formData.append('price', price);
        formData.append('is_available', form.is_available);
        formData.append('dietary_tags', form.dietary_tags);
        formData.append('is_special', form.is_special);

        if (editing?.id) {
          await API.put(`/menu/${editing.id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } else {
          await API.post('/menu', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      } else {
        // Plain JSON — no new file
        const payload = {
          name, description, category: categoryVal, price,
          is_available: form.is_available,
          image_url: form.image_url,
          dietary_tags: form.dietary_tags,
          is_special: form.is_special,
        };

        if (editing?.id) {
          await API.put(`/menu/${editing.id}`, payload);
        } else {
          await API.post('/menu', payload);
        }
      }

      await load();
      closeModal();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Purge this item from the global mesh?')) return;
    try {
      await API.delete(`/menu/${id}`);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const toggleAvailability = async (item) => {
    if (!canEdit) return;
    try {
      await API.put(`/menu/${item.id}`, { is_available: !Boolean(item?.is_available) });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="menu-page">
      <header className="menu-header">
        <div>
          <h1>Menu Management</h1>
          <p>Create and manage your restaurant's food and drink items.</p>
        </div>
        {canEdit && (
          <button className="menu-add-btn" onClick={openAdd}>
            <PlusIcon />
            Add New Item
          </button>
        )}
      </header>

      {error && <div className="menu-error">{error}</div>}

      <section className="menu-stats">
        <div className="menu-stat">
          <div className="menu-stat-ico"><ListIcon /></div>
          <div>
            <div className="menu-stat-val">{stats.total}</div>
            <div className="menu-stat-label">Total Items</div>
          </div>
        </div>
        <div className="menu-stat">
          <div className="menu-stat-ico" style={{ color: '#2ed573' }}><CheckIcon /></div>
          <div>
            <div className="menu-stat-val">{stats.available}</div>
            <div className="menu-stat-label">Available</div>
          </div>
        </div>
        <div className="menu-stat">
          <div className="menu-stat-ico" style={{ color: '#f48c25' }}><SparklesIcon /></div>
          <div>
            <div className="menu-stat-val">{stats.specials}</div>
            <div className="menu-stat-label">Specials</div>
          </div>
        </div>
        <div className="menu-stat">
          <div className="menu-stat-ico"><DollarIcon /></div>
          <div>
            <div className="menu-stat-val">{formatMoney(stats.avg)}</div>
            <div className="menu-stat-label">Avg Index</div>
          </div>
        </div>
      </section>

      <div className="menu-toolbar">
        <div className="menu-search">
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: '14px', top: '15px', color: 'rgba(255,255,255,0.3)' }}>
              <SearchIcon size={18} />
            </span>
            <input
              style={{ paddingLeft: '44px' }}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu items..."
            />
          </div>
        </div>
        <div className="menu-filter">
          <select value={dietaryFilter} onChange={(e) => setDietaryFilter(e.target.value)}>
            <option value="all">All Dietary Types</option>
            {DIETARY_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="menu-filter">
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c === 'all' ? 'All Categories' : c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state" style={{ padding: '60px 0' }}>
          <div className="spinner"></div>
          <p>Loading Menu...</p>
        </div>
      ) : (
        <div className="menu-grid" ref={gridRef}>
          {filtered.length === 0 ? (
            <div className="menu-empty" style={{ gridColumn: '1 / -1' }}>
              No items found.
            </div>
          ) : (
            filtered.map((item) => (
              <div key={item.id} className="menu-card">
                <div className="menu-card-image">
                  {item.image_url ? (
                    <img src={resolveImageUrl(item.image_url)} alt={item.name} />
                  ) : (
                    <div className="menu-image-placeholder">
                      <BoxIcon size={48} />
                    </div>
                  )}
                  {item.is_special && (
                    <div className="menu-card-special-badge">
                      <SparklesIcon size={12} style={{ marginRight: '4px' }} />
                      Chef's Special
                    </div>
                  )}
                </div>
                <div className="menu-card-content">
                  <div className="menu-card-top">
                    <h3 className="menu-card-name">{item.name}</h3>
                    <span className="menu-card-price">{formatMoney(item.price)}</span>
                  </div>
                  <p className="menu-card-desc">{item.description || 'No description available.'}</p>
                  
                  <div className="menu-tags">
                    {(item.dietary_tags || '').split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                      <span key={tag} className="menu-tag">{tag}</span>
                    ))}
                  </div>

                  <div className="menu-card-footer">
                    <span className="menu-card-cat">{item.category}</span>
                    <div className="menu-card-actions">
                      {canEdit && (
                        <button className="menu-card-btn" onClick={() => openEdit(item)} title="Edit Item">
                          <DotsIcon size={16} />
                        </button>
                      )}
                      {canEdit && (
                        <button 
                          className={`menu-card-btn toggle ${item.is_available ? 'on' : 'off'}`} 
                          onClick={() => toggleAvailability(item)}
                          title={item.is_available ? 'Mark Unavailable' : 'Mark Available'}
                        >
                          <CheckIcon size={16} />
                        </button>
                      )}
                      {canDelete && (
                        <button className="menu-card-btn delete" onClick={() => remove(item.id)} title="Delete Item">
                          <TrashIcon size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showModal && (
        <div className="menu-modal-overlay" onClick={closeModal} ref={overlayRef}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()} ref={modalRef}>
            <div className="menu-modal-head">
              <h2>{editing ? 'Edit Item' : 'Add Item'}</h2>
              <button className="menu-modal-close" type="button" onClick={closeModal}>✕</button>
            </div>

            {formError && <div className="menu-form-error">{formError}</div>}

            <form onSubmit={submit}>
              <div className="menu-field">
                <label>Item Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Cheese Pizza"
                  required
                />
              </div>

              {/* Image Upload Section */}
              <div className="menu-field">
                <label>Item Image</label>
                <div className="menu-image-upload">
                  {imagePreview ? (
                    <div className="menu-image-preview-wrap">
                      <img src={imagePreview} alt="Preview" className="menu-image-preview" />
                      <button type="button" className="menu-image-remove" onClick={removeImage}>
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="menu-image-dropzone" onClick={() => fileInputRef.current?.click()}>
                      <BoxIcon size={32} />
                      <span>Click to upload image</span>
                      <span className="menu-image-hint">JPEG, PNG, WebP • Max 5MB</span>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    style={{ display: 'none' }}
                    onChange={handleImageChange}
                  />
                </div>
              </div>

              <div className="menu-field">
                <label>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe this item..."
                  rows={3}
                />
              </div>

              <div className="menu-field-grid">
                <div className="menu-field">
                  <label>Category</label>
                  <input
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="e.g. Main Course"
                    required
                  />
                </div>
                <div className="menu-field">
                  <label>Price</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div className="menu-field">
                <label>Dietary Labels</label>
                <div className="menu-dietary-selector">
                  {DIETARY_OPTIONS.map(tag => (
                    <button
                      key={tag}
                      type="button"
                      className={`dietary-tag-btn ${form.dietary_tags.includes(tag) ? 'active' : ''}`}
                      onClick={() => toggleDietaryTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="menu-field-grid" style={{ marginTop: '20px' }}>
                <div className="menu-field menu-check">
                  <label className="menu-check-row">
                    <input
                      type="checkbox"
                      checked={Boolean(form.is_available)}
                      onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
                    />
                    Available for Ordering
                  </label>
                </div>
                <div className="menu-field menu-check">
                  <label className="menu-check-row">
                    <input
                      type="checkbox"
                      checked={Boolean(form.is_special)}
                      onChange={(e) => setForm({ ...form, is_special: e.target.checked })}
                    />
                    Chef's Special
                  </label>
                </div>
              </div>

              <div className="menu-modal-actions">
                <button type="button" className="menu-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="menu-save" disabled={saving}>
                  {saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Menu;
