require('dotenv').config({ path: __dirname + '/.env' });
const { PurchaseOrder, Ingredient, Supplier } = require('./models/index');

async function check() {
  try {
    const pos = await PurchaseOrder.count();
    console.log('Total POs:', pos);
    
    // Check if there are any ingredients that SHOULD be auto-drafted
    const needsAutoDraft = await Ingredient.findAll({
      where: {
        is_active: true
      }
    });
    
    let lowStockCount = 0;
    let lowStockWithSupplierCount = 0;
    
    needsAutoDraft.forEach(i => {
      const isLow = Number(i.current_quantity) <= Number(i.low_stock_threshold);
      if (isLow) {
        lowStockCount++;
        if (i.preferred_supplier_id) lowStockWithSupplierCount++;
      }
    });

    console.log('Total Ingredients:', needsAutoDraft.length);
    console.log('Low Stock Ingredients:', lowStockCount);
    console.log('Low Stock with Preferred Supplier:', lowStockWithSupplierCount);
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
