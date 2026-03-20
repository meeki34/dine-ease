require('dotenv').config({ path: './backend/.env' });
const { PurchaseOrder, Ingredient, Supplier } = require('./backend/models/index');

async function check() {
  try {
    const pos = await PurchaseOrder.count();
    console.log('Total POs:', pos);
    
    const lowStock = await Ingredient.count({
      where: {
        current_quantity: { $lte: 0 }, // Using 0 for simplicity in this check
        is_active: true
      }
    });
    console.log('Ingredients with 0 stock:', lowStock);
    
    const withSupplier = await Ingredient.count({
      where: {
        preferred_supplier_id: { $ne: null }
      }
    });
    console.log('Ingredients with Preferred Supplier:', withSupplier);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
