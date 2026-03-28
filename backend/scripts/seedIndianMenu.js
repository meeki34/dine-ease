const { sequelize } = require('../config/db');
const { MenuItem } = require('../models');

const TENANT_ID = 2; // Demo Bistro

const menuItems = [
  // ═══════════════════════════════════════════
  // NORTH INDIAN - VEG
  // ═══════════════════════════════════════════
  {
    name: 'Paneer Butter Masala',
    description: 'Soft cottage cheese cubes simmered in a rich, creamy tomato-butter gravy with aromatic spices.',
    price: 249,
    category: 'North Indian Veg',
    dietary_tags: 'Vegetarian',
    is_special: true,
  },
  {
    name: 'Dal Makhani',
    description: 'Slow-cooked black lentils and kidney beans in a velvety butter-cream sauce, finished with fresh cream.',
    price: 199,
    category: 'North Indian Veg',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Shahi Paneer',
    description: 'Paneer cubes in a cashew-almond cream gravy with saffron and cardamom.',
    price: 269,
    category: 'North Indian Veg',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Aloo Gobi',
    description: 'Traditional dry preparation of potatoes and cauliflower tossed with turmeric, cumin, and coriander.',
    price: 169,
    category: 'North Indian Veg',
    dietary_tags: 'Vegetarian, Vegan',
  },
  {
    name: 'Malai Kofta',
    description: 'Deep-fried paneer-potato dumplings served in a creamy cashew and tomato gravy.',
    price: 239,
    category: 'North Indian Veg',
    dietary_tags: 'Vegetarian',
    is_special: true,
  },
  {
    name: 'Chole Bhature',
    description: 'Spiced chickpea curry served with fluffy deep-fried bread, pickled onions, and green chutney.',
    price: 179,
    category: 'North Indian Veg',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Palak Paneer',
    description: 'Fresh spinach purée cooked with paneer cubes, garlic, and mild spices.',
    price: 219,
    category: 'North Indian Veg',
    dietary_tags: 'Vegetarian',
  },

  // ═══════════════════════════════════════════
  // NORTH INDIAN - NON VEG
  // ═══════════════════════════════════════════
  {
    name: 'Butter Chicken',
    description: 'Iconic tandoori chicken pieces in a silky tomato-butter gravy with fenugreek and cream.',
    price: 299,
    category: 'North Indian Non-Veg',
    dietary_tags: '',
    is_special: true,
  },
  {
    name: 'Chicken Tikka Masala',
    description: 'Chargrilled chicken tikka pieces simmered in a spiced onion-tomato masala.',
    price: 289,
    category: 'North Indian Non-Veg',
    dietary_tags: 'Spicy',
  },
  {
    name: 'Mutton Rogan Josh',
    description: 'Kashmiri-style slow-cooked lamb in a rich red chili and fennel gravy.',
    price: 349,
    category: 'North Indian Non-Veg',
    dietary_tags: 'Spicy',
    is_special: true,
  },
  {
    name: 'Keema Matar',
    description: 'Spiced minced lamb cooked with green peas, onions, and fresh herbs.',
    price: 279,
    category: 'North Indian Non-Veg',
    dietary_tags: 'Spicy',
  },
  {
    name: 'Tandoori Chicken (Full)',
    description: 'Whole chicken marinated in yogurt and tandoori spices, roasted in a clay oven.',
    price: 399,
    category: 'North Indian Non-Veg',
    dietary_tags: '',
  },
  {
    name: 'Fish Amritsari',
    description: 'Crispy batter-fried fish fillets with ajwain and chaat masala, served with mint chutney.',
    price: 269,
    category: 'North Indian Non-Veg',
    dietary_tags: '',
  },

  // ═══════════════════════════════════════════
  // SOUTH INDIAN
  // ═══════════════════════════════════════════
  {
    name: 'Masala Dosa',
    description: 'Crispy golden rice-lentil crêpe filled with spiced potato masala, served with sambar and chutneys.',
    price: 129,
    category: 'South Indian',
    dietary_tags: 'Vegetarian, Vegan',
    is_special: true,
  },
  {
    name: 'Idli Sambar (4 pcs)',
    description: 'Steamed rice cakes with aromatic lentil sambar, coconut chutney, and tomato chutney.',
    price: 99,
    category: 'South Indian',
    dietary_tags: 'Vegetarian, Vegan',
  },
  {
    name: 'Medu Vada (3 pcs)',
    description: 'Crispy urad dal fritters shaped in rings, served with sambar and coconut chutney.',
    price: 89,
    category: 'South Indian',
    dietary_tags: 'Vegetarian, Vegan',
  },
  {
    name: 'Uttapam',
    description: 'Thick rice-lentil pancake topped with onions, tomatoes, green chilies, and cilantro.',
    price: 119,
    category: 'South Indian',
    dietary_tags: 'Vegetarian, Vegan',
  },
  {
    name: 'Rava Dosa',
    description: 'Thin and lacy semolina crêpe with a crispy texture, served with chutneys and sambar.',
    price: 139,
    category: 'South Indian',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Chettinad Chicken Curry',
    description: 'Fiery South Indian chicken curry with roasted spices, curry leaves, and coconut.',
    price: 289,
    category: 'South Indian',
    dietary_tags: 'Spicy',
  },
  {
    name: 'Hyderabadi Chicken Biryani',
    description: 'Layered basmati rice and succulent chicken cooked dum-style with saffron, fried onions, and whole spices.',
    price: 299,
    category: 'South Indian',
    dietary_tags: 'Spicy',
    is_special: true,
  },
  {
    name: 'Kerala Fish Curry',
    description: 'Tangy coconut-based fish curry with kokum, tamarind, and fresh curry leaves.',
    price: 279,
    category: 'South Indian',
    dietary_tags: 'Spicy',
  },
  {
    name: 'Appam with Stew',
    description: 'Lacy rice pancakes served with a mild coconut vegetable or chicken stew.',
    price: 169,
    category: 'South Indian',
    dietary_tags: 'Vegetarian',
  },

  // ═══════════════════════════════════════════
  // BIRYANI & RICE
  // ═══════════════════════════════════════════
  {
    name: 'Veg Biryani',
    description: 'Fragrant basmati rice layered with seasonal vegetables, saffron, and dum-cooked spices.',
    price: 199,
    category: 'Biryani & Rice',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Mutton Biryani',
    description: 'Succulent mutton pieces slow-cooked with aromatic basmati rice, caramelized onions, and garam masala.',
    price: 349,
    category: 'Biryani & Rice',
    dietary_tags: 'Spicy',
    is_special: true,
  },
  {
    name: 'Egg Biryani',
    description: 'Boiled eggs marinated in spices, layered with fragrant rice and fried onions.',
    price: 179,
    category: 'Biryani & Rice',
    dietary_tags: '',
  },
  {
    name: 'Jeera Rice',
    description: 'Fluffy basmati rice tempered with cumin seeds, ghee, and whole spices.',
    price: 99,
    category: 'Biryani & Rice',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Steamed Basmati Rice',
    description: 'Perfectly cooked long-grain basmati rice.',
    price: 69,
    category: 'Biryani & Rice',
    dietary_tags: 'Vegetarian, Vegan',
  },

  // ═══════════════════════════════════════════
  // BREADS
  // ═══════════════════════════════════════════
  {
    name: 'Butter Naan',
    description: 'Soft leavened bread baked in tandoor and brushed with melted butter.',
    price: 49,
    category: 'Breads',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Garlic Naan',
    description: 'Tandoor-baked naan topped with minced garlic, coriander, and butter.',
    price: 59,
    category: 'Breads',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Tandoori Roti',
    description: 'Whole wheat bread baked in a clay oven for a smoky, rustic flavor.',
    price: 35,
    category: 'Breads',
    dietary_tags: 'Vegetarian, Vegan',
  },
  {
    name: 'Cheese Naan',
    description: 'Naan stuffed with melted cheese blend and herbs, baked to golden perfection.',
    price: 79,
    category: 'Breads',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Paratha (Aloo / Gobi)',
    description: 'Layered whole wheat flatbread stuffed with spiced potatoes or cauliflower, served with curd.',
    price: 69,
    category: 'Breads',
    dietary_tags: 'Vegetarian',
  },

  // ═══════════════════════════════════════════
  // STARTERS & SNACKS
  // ═══════════════════════════════════════════
  {
    name: 'Paneer Tikka',
    description: 'Marinated cottage cheese cubes grilled with bell peppers and onions in a tandoor.',
    price: 219,
    category: 'Starters',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Chicken 65',
    description: 'Spicy deep-fried chicken bites tossed with curry leaves, red chilies, and yogurt.',
    price: 229,
    category: 'Starters',
    dietary_tags: 'Spicy',
  },
  {
    name: 'Gobi Manchurian',
    description: 'Crispy cauliflower florets in a tangy Indo-Chinese soy-chili sauce.',
    price: 169,
    category: 'Starters',
    dietary_tags: 'Vegetarian, Spicy',
  },
  {
    name: 'Seekh Kebab (4 pcs)',
    description: 'Minced lamb skewers spiced with ginger, green chilies, and herbs, charcoal grilled.',
    price: 279,
    category: 'Starters',
    dietary_tags: 'Spicy',
  },
  {
    name: 'Samosa (2 pcs)',
    description: 'Crispy triangular pastries filled with spiced potatoes and peas, served with tamarind chutney.',
    price: 69,
    category: 'Starters',
    dietary_tags: 'Vegetarian, Vegan',
  },
  {
    name: 'Tandoori Prawns',
    description: 'Jumbo prawns marinated in tandoori spices and grilled until smoky and juicy.',
    price: 349,
    category: 'Starters',
    dietary_tags: '',
    is_special: true,
  },

  // ═══════════════════════════════════════════
  // BEVERAGES
  // ═══════════════════════════════════════════
  {
    name: 'Masala Chai',
    description: 'Traditional Indian tea brewed with ginger, cardamom, cinnamon, and cloves.',
    price: 49,
    category: 'Beverages',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Mango Lassi',
    description: 'Creamy yogurt drink blended with Alphonso mango pulp and a hint of cardamom.',
    price: 99,
    category: 'Beverages',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Sweet Lassi',
    description: 'Chilled yogurt beverage sweetened with sugar and rose water.',
    price: 79,
    category: 'Beverages',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Fresh Lime Soda',
    description: 'Sparkling soda with freshly squeezed lime, sugar, and black salt.',
    price: 59,
    category: 'Beverages',
    dietary_tags: 'Vegetarian, Vegan',
  },
  {
    name: 'Filter Coffee',
    description: 'South Indian style drip coffee with chicory, served frothy with hot milk.',
    price: 69,
    category: 'Beverages',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Buttermilk (Chaas)',
    description: 'Spiced churned yogurt with cumin, curry leaves, and fresh coriander.',
    price: 49,
    category: 'Beverages',
    dietary_tags: 'Vegetarian',
  },

  // ═══════════════════════════════════════════
  // DESSERTS
  // ═══════════════════════════════════════════
  {
    name: 'Gulab Jamun (3 pcs)',
    description: 'Soft milk-solid dumplings soaked in warm rose-cardamom sugar syrup.',
    price: 99,
    category: 'Desserts',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Rasmalai (2 pcs)',
    description: 'Soft paneer discs soaked in chilled, saffron-scented sweetened milk with pistachios.',
    price: 119,
    category: 'Desserts',
    dietary_tags: 'Vegetarian',
    is_special: true,
  },
  {
    name: 'Kulfi Falooda',
    description: 'Traditional Indian ice cream with rose syrup, vermicelli, basil seeds, and nuts.',
    price: 129,
    category: 'Desserts',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Jalebi with Rabri',
    description: 'Crispy saffron-soaked spirals served with thickened sweet milk rabri.',
    price: 109,
    category: 'Desserts',
    dietary_tags: 'Vegetarian',
  },
  {
    name: 'Payasam',
    description: 'South Indian vermicelli kheer with cashews, raisins, and cardamom in sweetened milk.',
    price: 89,
    category: 'Desserts',
    dietary_tags: 'Vegetarian',
  },
];

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // Remove old items for this tenant
    const deleted = await MenuItem.destroy({ where: { tenant_id: TENANT_ID } });
    console.log(`Removed ${deleted} existing items`);

    // Insert new items
    const items = menuItems.map(item => ({
      ...item,
      tenant_id: TENANT_ID,
      is_available: true,
      is_special: item.is_special || false,
      image_url: null,
    }));

    await MenuItem.bulkCreate(items);
    console.log(`✅ Seeded ${items.length} menu items for Demo Bistro (tenant ${TENANT_ID})`);

    // Print summary
    const categories = {};
    items.forEach(i => {
      categories[i.category] = (categories[i.category] || 0) + 1;
    });
    console.log('\nBreakdown:');
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`  ${cat}: ${count} items`);
    });
  } catch (err) {
    console.error('Seed error:', err.message);
  } finally {
    process.exit();
  }
}

seed();
