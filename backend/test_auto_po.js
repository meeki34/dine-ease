require('dotenv').config({ path: __dirname + '/.env' });
const { Ingredient, PurchaseOrder, PurchaseOrderItem } = require('./models/index');
const { checkAndAutoDraftPOs } = require('./controllers/poController');

async function test() {
  try {
    // 1. Get an ingredient
    const ingredient = await Ingredient.findOne({ where: { is_active: true } });
    if (!ingredient) {
      console.log('No active ingredients found to test with.');
      return;
    }

    console.log(`Using ingredient: ${ingredient.name}`);
    const originalQty = ingredient.current_quantity;
    const threshold = ingredient.low_stock_threshold;
    const tenant_id = ingredient.tenant_id;

    // 2. Mock preferred supplier if needed
    if (!ingredient.preferred_supplier_id) {
      const { Supplier } = require('./models/index');
      let supplier = await Supplier.findOne({ where: { tenant_id } });
      if (!supplier) {
        supplier = await Supplier.create({ tenant_id, name: 'Test Supplier' });
      }
      await ingredient.update({ preferred_supplier_id: supplier.id });
      console.log(`Assigned preferred supplier: ${supplier.name}`);
    }

    // 3. Set to low stock
    await ingredient.update({ current_quantity: threshold - 1 });
    console.log(`Reduced ${ingredient.name} stock to ${threshold - 1} (Threshold: ${threshold})`);

    // 4. Trigger auto-draft
    console.log('Triggering checkAndAutoDraftPOs...');
    await checkAndAutoDraftPOs(tenant_id);

    // 5. Verify results
    const po = await PurchaseOrder.findOne({
      where: { tenant_id, status: 'draft' },
      order: [['createdAt', 'DESC']],
      include: [PurchaseOrderItem]
    });

    if (po) {
      console.log('SUCCESS: Draft PO created/found!');
      console.log('PO Number:', po.po_number);
      console.log('Total Amount:', po.total_amount);
      console.log('Item count:', po.PurchaseOrderItems.length);
    } else {
      console.log('FAILURE: No draft PO found.');
    }

    // 6. Restore quantity
    await ingredient.update({ current_quantity: originalQty });
    console.log('Restored original quantity.');

    process.exit(0);
  } catch (err) {
    console.error('Test failed:', err);
    process.exit(1);
  }
}

test();
