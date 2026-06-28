import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon, ChefIcon } from '../components/icons';
import PretextMasonry from '../components/PretextMasonry';
import { formatMoney } from '../utils/money';
import '../styles/CustomerMenu.css';

const publicAPI = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api'
});

const CustomerMenu = () => {
  const { tenantId, tableId } = useParams();
  const [menu, setMenu] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await publicAPI.get(`/public/menu/${tenantId}`);
        setMenu(res.data.data);
        setRestaurantName(res.data.restaurantName);
        // Delay splash removal for aesthetics to show off the logo and restaurant name animation
        setTimeout(() => setLoading(false), 1600);
      } catch (err) {
        setError('Failed to load menu. Please ask your waiter.');
        setLoading(false);
      }
    };
    fetchMenu();
  }, [tenantId]);

  const categories = useMemo(() => {
    const cats = [...new Set(menu.map(i => i.category))];
    return ['All', ...cats];
  }, [menu]);

  const [activeCategory, setActiveCategory] = useState('All');

  const filteredMenu = useMemo(() => {
    if (activeCategory === 'All') return menu;
    return menu.filter(i => i.category === activeCategory);
  }, [menu, activeCategory]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === item.id);
      if (existing) {
        return prev.map(p => p.id === item.id ? { ...p, quantity: p.quantity + 1 } : p);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name}`);
  };

  const updateCartQuantity = (id, delta) => {
    setCart(prev => prev.map(p => {
        if (p.id === id) {
          const newQ = p.quantity + delta;
          return newQ > 0 ? { ...p, quantity: newQ } : p;
        }
        return p;
      }).filter(p => p.quantity > 0));
  };

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0), [cart]);

  const submitOrder = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);
    try {
      const payload = {
        tenant_id: tenantId,
        table_number: tableId,
        items: cart.map(i => ({ menu_item_id: i.id, quantity: i.quantity, price: Number(i.price) })),
        notes: "Ordered via QR Portal"
      };
      await publicAPI.post('/public/order', payload);
      toast.success('Order placed successfully! The kitchen is preparing your food.');
      setCart([]);
      setIsCartOpen(false);
    } catch (err) {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div 
          key="splash"
          className="cm-splash"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, filter: 'blur(8px)' }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="cm-splash-logo"
          >
            <ChefIcon width="90" height="90" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {restaurantName || 'Dine-Ease'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            Structuring your digital menu...
          </motion.p>
        </motion.div>
      ) : error ? (
        <motion.div key="error" className="cm-full-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="cm-error">{error}</p>
        </motion.div>
      ) : (
        <motion.div 
          key="menu"
          className="cm-wrapper"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="cm-container">
      <header className="cm-header">
        <h1>{restaurantName || 'Digital Menu'}</h1>
        <p className="cm-table-badge">Table {tableId}</p>
      </header>

      <div className="cm-categories-scroll">
        <div className="cm-categories">
          {categories.map(cat => (
            <button 
              key={cat} 
              className={`cm-cat-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <PretextMasonry items={filteredMenu} onAddToCart={addToCart} columnCount={2} />

      {cart.length > 0 && (
        <button className="cm-fab" onClick={() => setIsCartOpen(true)}>
          <div className="cm-fab-content">
             <span className="cm-fab-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
             <span>View Cart</span>
             <span>{formatMoney(cartTotal)}</span>
          </div>
        </button>
      )}

      {isCartOpen && (
        <div className="cm-modal-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cm-modal" onClick={e => e.stopPropagation()}>
            <div className="cm-modal-header">
              <h2>Your Order</h2>
              <button className="cm-close-btn" onClick={() => setIsCartOpen(false)}>✕</button>
            </div>
            
            <div className="cm-cart-items">
              {cart.map(item => (
                <div key={item.id} className="cm-cart-item">
                  <div className="cm-cart-info">
                    <h4>{item.name}</h4>
                    <p>{formatMoney(Number(item.price) * item.quantity)}</p>
                  </div>
                  <div className="cm-cart-actions">
                    <button className="cm-qty-btn" onClick={() => updateCartQuantity(item.id, -1)}><MinusIcon /></button>
                    <span>{item.quantity}</span>
                    <button className="cm-qty-btn" onClick={() => updateCartQuantity(item.id, 1)}><PlusIcon /></button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cm-cart-footer">
              <div className="cm-cart-total">
                <span>Total Amount</span>
                <span className="cm-total-price">{formatMoney(cartTotal)}</span>
              </div>
              <button 
                className="cm-checkout-btn" 
                onClick={submitOrder} 
                disabled={submitting}
              >
                {submitting ? 'Placing Order...' : 'Send Order to Kitchen'}
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CustomerMenu;
