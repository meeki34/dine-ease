const { sequelize, User, Tenant, MenuItem, Ingredient, Recipe, Expense, Supplier } = require('./models');

const seedDemoBistro = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');

    // 1. Find the manager / tenant
    const manager = await User.findOne({ where: { email: 'manager@demo-bistro.test' } });
    if (!manager) {
      console.error('Manager manager@demo-bistro.test not found!');
      process.exit(1);
    }
    const tenantId = manager.tenant_id;
    const adminId = manager.id;
    console.log('Found Tenant ID:', tenantId);

    // 2. Clear existing demo bistro menu/ingredients/recipes/expenses/suppliers
    const existingItems = await MenuItem.findAll({ where: { tenant_id: tenantId } });
    const itemIds = existingItems.map(i => i.id);
    if (itemIds.length) await Recipe.destroy({ where: { menu_item_id: itemIds } });
    
    await MenuItem.destroy({ where: { tenant_id: tenantId } });
    await Ingredient.destroy({ where: { tenant_id: tenantId } });
    await Expense.destroy({ where: { tenant_id: tenantId } });
    await Supplier.destroy({ where: { tenant_id: tenantId } });

    console.log('Cleared old data for tenant.');

    // 3. Create Suppliers
    const supplierData = [
      { name: 'Fresh Farms Produce', contact_name: 'Sarah Jenkins', email: 'orders@freshfarms.demo', phone: '+1-555-0192', payment_terms: 'Net 15', tenant_id: tenantId },
      { name: 'Premier Meats & Dairy', contact_name: 'Mike Beef', email: 'mike@premiermeats.demo', phone: '+1-555-0234', payment_terms: 'Net 30', tenant_id: tenantId },
      { name: 'Bistro Beverages & Dry Goods', contact_name: 'Emily Tran', email: 'sales@bistrodrygoods.demo', phone: '+1-555-0345', payment_terms: 'COD', tenant_id: tenantId }
    ];

    const createdSuppliers = await Supplier.bulkCreate(supplierData, { returning: true });
    
    // Map of supplier names to IDs
    const suppMap = {};
    createdSuppliers.forEach(s => {
      suppMap[s.name] = s.id;
    });
    console.log('Created suppliers.');

    // 4. Create Ingredients with linked suppliers
    const ingredientsData = [
      // Dry Goods
      { name: 'Brioche Bun', unit: 'pcs', current_quantity: 200, low_stock_threshold: 50, last_purchase_price: 0.50, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Penne Pasta', unit: 'kg', current_quantity: 40, low_stock_threshold: 10, last_purchase_price: 2.50, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Croutons', unit: 'kg', current_quantity: 10, low_stock_threshold: 3, last_purchase_price: 4.50, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Coffee Beans', unit: 'kg', current_quantity: 20, low_stock_threshold: 5, last_purchase_price: 18.00, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Cola Syrup', unit: 'liters', current_quantity: 30, low_stock_threshold: 10, last_purchase_price: 3.50, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'French Fries', unit: 'kg', current_quantity: 100, low_stock_threshold: 30, last_purchase_price: 2.00, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Frying Oil', unit: 'liters', current_quantity: 60, low_stock_threshold: 20, last_purchase_price: 3.00, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Bistro Sauce', unit: 'liters', current_quantity: 10, low_stock_threshold: 3, last_purchase_price: 8.00, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Marinara Sauce', unit: 'liters', current_quantity: 25, low_stock_threshold: 5, last_purchase_price: 4.00, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      { name: 'Caesar Dressing', unit: 'liters', current_quantity: 15, low_stock_threshold: 4, last_purchase_price: 5.00, preferred_supplier_id: suppMap['Bistro Beverages & Dry Goods'] },
      
      // Meats & Dairy
      { name: 'Beef Patty (8oz)', unit: 'pcs', current_quantity: 150, low_stock_threshold: 40, last_purchase_price: 2.50, preferred_supplier_id: suppMap['Premier Meats & Dairy'] },
      { name: 'Chicken Breast', unit: 'kg', current_quantity: 30, low_stock_threshold: 10, last_purchase_price: 6.50, preferred_supplier_id: suppMap['Premier Meats & Dairy'] },
      { name: 'Cheddar Cheese', unit: 'slices', current_quantity: 500, low_stock_threshold: 100, last_purchase_price: 0.20, preferred_supplier_id: suppMap['Premier Meats & Dairy'] },
      { name: 'Parmesan Cheese', unit: 'kg', current_quantity: 8, low_stock_threshold: 2, last_purchase_price: 15.00, preferred_supplier_id: suppMap['Premier Meats & Dairy'] },
      { name: 'Milk', unit: 'liters', current_quantity: 50, low_stock_threshold: 15, last_purchase_price: 1.10, preferred_supplier_id: suppMap['Premier Meats & Dairy'] },
      
      // Produce
      { name: 'Lettuce', unit: 'heads', current_quantity: 50, low_stock_threshold: 15, last_purchase_price: 1.00, preferred_supplier_id: suppMap['Fresh Farms Produce'] },
      { name: 'Romaine Lettuce', unit: 'heads', current_quantity: 40, low_stock_threshold: 10, last_purchase_price: 1.20, preferred_supplier_id: suppMap['Fresh Farms Produce'] },
      { name: 'Tomato', unit: 'kg', current_quantity: 20, low_stock_threshold: 5, last_purchase_price: 3.00, preferred_supplier_id: suppMap['Fresh Farms Produce'] },
      { name: 'Red Onion', unit: 'kg', current_quantity: 15, low_stock_threshold: 5, last_purchase_price: 2.00, preferred_supplier_id: suppMap['Fresh Farms Produce'] }
    ].map(i => ({ ...i, tenant_id: tenantId }));

    const createdIngredients = await Ingredient.bulkCreate(ingredientsData, { returning: true });
    
    // Create a map to easily get ingredient id by name
    const ingMap = {};
    createdIngredients.forEach(ing => {
      ingMap[ing.name] = ing.id;
    });

    console.log('Created ingredients mapping to suppliers.');

    // 5. Create Menu Items
    const menuData = [
      { name: 'Classic Bistro Burger', category: 'Mains', price: 14.99, description: '8oz beef patty with cheddar, lettuce, tomato, onion and our signature bistro sauce on a brioche bun.', image_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=60' },
      { name: 'Chicken Caesar Salad', category: 'Salads', price: 12.50, description: 'Crisp romaine, grilled chicken breast, parmesan, croutons and creamy Caesar dressing.', image_url: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=500&q=60', dietary_tags: 'Healthy' },
      { name: 'Penne Arrabbiata', category: 'Mains', price: 13.99, description: 'Penne pasta in a spicy garlic and tomato marinara sauce, topped with parmesan.', image_url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=500&q=60', dietary_tags: 'Vegetarian' },
      { name: 'Side Fries', category: 'Sides', price: 4.50, description: 'Crispy golden french fries.', image_url: 'https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=500&q=60', dietary_tags: 'Vegan, Gluten-Free' },
      { name: 'Artisan Latte', category: 'Beverages', price: 4.50, description: 'Freshly pulled espresso with steamed milk.', image_url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=500&q=60' },
      { name: 'Fountain Soda', category: 'Beverages', price: 2.50, description: 'Chilled cola or choice of soda.', image_url: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=500&q=60' }
    ].map(m => ({ ...m, tenant_id: tenantId, is_available: true }));

    const createdMenuItems = await MenuItem.bulkCreate(menuData, { returning: true });
    
    // Map of menu item names to their IDs
    const menuMap = {};
    createdMenuItems.forEach(item => {
      menuMap[item.name] = item.id;
    });

    console.log('Created menu items.');

    // 6. Create Recipes (linking logic)
    const recipeData = [
      // Burger
      { menu_item_id: menuMap['Classic Bistro Burger'], ingredient_id: ingMap['Brioche Bun'], quantity_required: 1 },
      { menu_item_id: menuMap['Classic Bistro Burger'], ingredient_id: ingMap['Beef Patty (8oz)'], quantity_required: 1 },
      { menu_item_id: menuMap['Classic Bistro Burger'], ingredient_id: ingMap['Cheddar Cheese'], quantity_required: 2 },
      { menu_item_id: menuMap['Classic Bistro Burger'], ingredient_id: ingMap['Lettuce'], quantity_required: 0.1 },
      { menu_item_id: menuMap['Classic Bistro Burger'], ingredient_id: ingMap['Tomato'], quantity_required: 0.1 },
      { menu_item_id: menuMap['Classic Bistro Burger'], ingredient_id: ingMap['Red Onion'], quantity_required: 0.05 },
      { menu_item_id: menuMap['Classic Bistro Burger'], ingredient_id: ingMap['Bistro Sauce'], quantity_required: 0.05 },
      // Caesar Salad
      { menu_item_id: menuMap['Chicken Caesar Salad'], ingredient_id: ingMap['Romaine Lettuce'], quantity_required: 0.3 },
      { menu_item_id: menuMap['Chicken Caesar Salad'], ingredient_id: ingMap['Chicken Breast'], quantity_required: 0.2 },
      { menu_item_id: menuMap['Chicken Caesar Salad'], ingredient_id: ingMap['Parmesan Cheese'], quantity_required: 0.03 },
      { menu_item_id: menuMap['Chicken Caesar Salad'], ingredient_id: ingMap['Croutons'], quantity_required: 0.05 },
      { menu_item_id: menuMap['Chicken Caesar Salad'], ingredient_id: ingMap['Caesar Dressing'], quantity_required: 0.05 },
      // Pasta
      { menu_item_id: menuMap['Penne Arrabbiata'], ingredient_id: ingMap['Penne Pasta'], quantity_required: 0.2 },
      { menu_item_id: menuMap['Penne Arrabbiata'], ingredient_id: ingMap['Marinara Sauce'], quantity_required: 0.15 },
      { menu_item_id: menuMap['Penne Arrabbiata'], ingredient_id: ingMap['Parmesan Cheese'], quantity_required: 0.02 },
      // Fries
      { menu_item_id: menuMap['Side Fries'], ingredient_id: ingMap['French Fries'], quantity_required: 0.3 },
      { menu_item_id: menuMap['Side Fries'], ingredient_id: ingMap['Frying Oil'], quantity_required: 0.05 },
      // Latte
      { menu_item_id: menuMap['Artisan Latte'], ingredient_id: ingMap['Coffee Beans'], quantity_required: 0.02 },
      { menu_item_id: menuMap['Artisan Latte'], ingredient_id: ingMap['Milk'], quantity_required: 0.3 },
      // Soda
      { menu_item_id: menuMap['Fountain Soda'], ingredient_id: ingMap['Cola Syrup'], quantity_required: 0.05 }
    ];

    await Recipe.bulkCreate(recipeData);

    console.log('Created recipes.');

    // 7. Create Expenses
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(today.getMonth() - 1);
    
    const expenseData = [
      { tenant_id: tenantId, amount: 2500, category: 'Rent', description: 'Monthly Restaurant Rent', expense_date: today, created_by: adminId },
      { tenant_id: tenantId, amount: 450.50, category: 'Utilities', description: 'Electricity and Water Bills', expense_date: today, created_by: adminId },
      { tenant_id: tenantId, amount: 300, category: 'Marketing', description: 'Social Media Ad Campaign', expense_date: today, created_by: adminId },
      { tenant_id: tenantId, amount: 150, category: 'Maintenance', description: 'Oven Repair', expense_date: lastMonth, created_by: adminId },
      { tenant_id: tenantId, amount: 2500, category: 'Rent', description: 'Monthly Restaurant Rent', expense_date: lastMonth, created_by: adminId }
    ];

    await Expense.bulkCreate(expenseData);
    console.log('Created expenses.');

    console.log('Successfully seeded database with realistic data including Suppliers for Demo Bistro!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to seed:', err);
    process.exit(1);
  }
};

seedDemoBistro();
