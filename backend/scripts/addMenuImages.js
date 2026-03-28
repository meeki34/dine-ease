const { sequelize } = require('../config/db');
const { MenuItem } = require('../models');

const TENANT_ID = 2; // Demo Bistro

// High-quality food images from Unsplash
const imageMap = {
  // North Indian Veg
  'Paneer Butter Masala': 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&h=400&fit=crop',
  'Dal Makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&h=400&fit=crop',
  'Shahi Paneer': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop',
  'Aloo Gobi': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
  'Malai Kofta': 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=600&h=400&fit=crop',
  'Chole Bhature': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&h=400&fit=crop',
  'Palak Paneer': 'https://images.unsplash.com/photo-1618449840665-9ed506d73a34?w=600&h=400&fit=crop',

  // North Indian Non-Veg
  'Butter Chicken': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=600&h=400&fit=crop',
  'Chicken Tikka Masala': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
  'Mutton Rogan Josh': 'https://images.unsplash.com/photo-1545247181-516773cae754?w=600&h=400&fit=crop',
  'Keema Matar': 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=600&h=400&fit=crop',
  'Tandoori Chicken (Full)': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop',
  'Fish Amritsari': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=600&h=400&fit=crop',

  // South Indian
  'Masala Dosa': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop',
  'Idli Sambar (4 pcs)': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&h=400&fit=crop',
  'Medu Vada (3 pcs)': 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&h=400&fit=crop',
  'Uttapam': 'https://images.unsplash.com/photo-1567337710282-00832b415979?w=600&h=400&fit=crop',
  'Rava Dosa': 'https://images.unsplash.com/photo-1668236543090-82eb5eafe6d4?w=600&h=400&fit=crop',
  'Chettinad Chicken Curry': 'https://images.unsplash.com/photo-1631292784640-2b24be784d5d?w=600&h=400&fit=crop',
  'Hyderabadi Chicken Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&h=400&fit=crop',
  'Kerala Fish Curry': 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=600&h=400&fit=crop',
  'Appam with Stew': 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=600&h=400&fit=crop',

  // Biryani & Rice
  'Veg Biryani': 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=600&h=400&fit=crop',
  'Mutton Biryani': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=600&h=400&fit=crop',
  'Egg Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&h=400&fit=crop',
  'Jeera Rice': 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&h=400&fit=crop',
  'Steamed Basmati Rice': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=600&h=400&fit=crop',

  // Breads
  'Butter Naan': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop',
  'Garlic Naan': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
  'Tandoori Roti': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&h=400&fit=crop',
  'Cheese Naan': 'https://images.unsplash.com/photo-1587116861219-230ac19df971?w=600&h=400&fit=crop',
  'Paratha (Aloo / Gobi)': 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=600&h=400&fit=crop',

  // Starters
  'Paneer Tikka': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=600&h=400&fit=crop',
  'Chicken 65': 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=600&h=400&fit=crop',
  'Gobi Manchurian': 'https://images.unsplash.com/photo-1625220194993-26b06d55e05b?w=600&h=400&fit=crop',
  'Seekh Kebab (4 pcs)': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&h=400&fit=crop',
  'Samosa (2 pcs)': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=400&fit=crop',
  'Tandoori Prawns': 'https://images.unsplash.com/photo-1625943553852-781c6dd46faa?w=600&h=400&fit=crop',

  // Beverages
  'Masala Chai': 'https://images.unsplash.com/photo-1571934811356-5cc061b6211f?w=600&h=400&fit=crop',
  'Mango Lassi': 'https://images.unsplash.com/photo-1527661591475-527312dd65f5?w=600&h=400&fit=crop',
  'Sweet Lassi': 'https://images.unsplash.com/photo-1488900128323-21503983a07e?w=600&h=400&fit=crop',
  'Fresh Lime Soda': 'https://images.unsplash.com/photo-1513558161293-cdaf765ed514?w=600&h=400&fit=crop',
  'Filter Coffee': 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&h=400&fit=crop',
  'Buttermilk (Chaas)': 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=600&h=400&fit=crop',

  // Desserts
  'Gulab Jamun (3 pcs)': 'https://images.unsplash.com/photo-1666190060060-ba52e2dd0226?w=600&h=400&fit=crop',
  'Rasmalai (2 pcs)': 'https://images.unsplash.com/photo-1602881917445-0b1ba001adce?w=600&h=400&fit=crop',
  'Kulfi Falooda': 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&h=400&fit=crop',
  'Jalebi with Rabri': 'https://images.unsplash.com/photo-1601303516118-35085e4e9952?w=600&h=400&fit=crop',
  'Payasam': 'https://images.unsplash.com/photo-1571006003932-daf1b65e9eab?w=600&h=400&fit=crop',
};

async function addImages() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    const items = await MenuItem.findAll({ where: { tenant_id: TENANT_ID } });
    let updated = 0;

    for (const item of items) {
      const url = imageMap[item.name];
      if (url) {
        await item.update({ image_url: url });
        updated++;
        console.log(`  ✅ ${item.name}`);
      } else {
        console.log(`  ⏭️  No image for: ${item.name}`);
      }
    }

    console.log(`\nDone! Updated ${updated}/${items.length} items with images.`);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit();
  }
}

addImages();
