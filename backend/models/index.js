const { sequelize } = require('../config/db');
const Tenant = require('./Tenant');
const User = require('./User');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');
const Table = require('./Table');
const StaffInvite = require('./StaffInvite');
const Ingredient = require('./Ingredient');
const InventoryTransaction = require('./InventoryTransaction');
const Expense = require('./Expense');
const DailyLog = require('./DailyLog');
const Recipe = require('./Recipe');
const Supplier = require('./Supplier');
const PurchaseOrder = require('./PurchaseOrder');
const PurchaseOrderItem = require('./PurchaseOrderItem');
const EmployeePerformance = require('./EmployeePerformance');
const Shift = require('./Shift');

// Associations
Tenant.hasMany(Order, { foreignKey: 'tenant_id' });
// ... (rest of imports)

Tenant.hasMany(PurchaseOrder, { foreignKey: 'tenant_id' });
PurchaseOrder.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Supplier.hasMany(PurchaseOrder, { foreignKey: 'supplier_id' });
PurchaseOrder.belongsTo(Supplier, { foreignKey: 'supplier_id' });

PurchaseOrder.hasMany(PurchaseOrderItem, { foreignKey: 'po_id' });
PurchaseOrderItem.belongsTo(PurchaseOrder, { foreignKey: 'po_id' });

Ingredient.hasMany(PurchaseOrderItem, { foreignKey: 'ingredient_id' });
PurchaseOrderItem.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });
Order.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(User, { foreignKey: 'tenant_id' });
User.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

MenuItem.hasMany(OrderItem, { foreignKey: 'menu_item_id' });
OrderItem.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

Tenant.hasMany(MenuItem, { foreignKey: 'tenant_id' });
MenuItem.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Table, { foreignKey: 'tenant_id' });
Table.belongsTo(Table, { foreignKey: 'tenant_id' });

Tenant.hasMany(Ingredient, { foreignKey: 'tenant_id' });
Ingredient.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Ingredient.hasMany(InventoryTransaction, { foreignKey: 'ingredient_id' });
InventoryTransaction.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });

Tenant.hasMany(Expense, { foreignKey: 'tenant_id' });
Expense.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(DailyLog, { foreignKey: 'tenant_id' });
DailyLog.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Supplier, { foreignKey: 'tenant_id' });
Supplier.belongsTo(Tenant, { foreignKey: 'tenant_id' });

// Supplier associations
Supplier.hasMany(Ingredient, { foreignKey: 'preferred_supplier_id' });
Ingredient.belongsTo(Supplier, { foreignKey: 'preferred_supplier_id', as: 'PreferredSupplier' });

// Recipe associations
MenuItem.hasMany(Recipe, { foreignKey: 'menu_item_id' });
Recipe.belongsTo(MenuItem, { foreignKey: 'menu_item_id' });

Ingredient.hasMany(Recipe, { foreignKey: 'ingredient_id' });
Recipe.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });

// Phase 3: Performance & Scheduling
User.hasMany(EmployeePerformance, { foreignKey: 'user_id' });
EmployeePerformance.belongsTo(User, { foreignKey: 'user_id' });

Order.hasMany(EmployeePerformance, { foreignKey: 'order_id' });
EmployeePerformance.belongsTo(Order, { foreignKey: 'order_id' });

User.hasMany(Shift, { foreignKey: 'user_id' });
Shift.belongsTo(User, { foreignKey: 'user_id' });

Tenant.hasMany(EmployeePerformance, { foreignKey: 'tenant_id' });
EmployeePerformance.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Shift, { foreignKey: 'tenant_id' });
Shift.belongsTo(Tenant, { foreignKey: 'tenant_id' });

// Sync all models
const syncDB = async () => {
    try {
        await sequelize.sync();
        console.log('All models synced successfully!');
    } catch (error) {
        console.error('Model sync failed:', error);
    }
};

module.exports = {
    sequelize,
    Tenant,
    User,
    MenuItem,
    Order,
    OrderItem,
    Table,
    StaffInvite,
    Ingredient,
    InventoryTransaction,
    Expense,
    DailyLog,
    Recipe,
    Supplier,
    PurchaseOrder,
    PurchaseOrderItem,
    EmployeePerformance,
    Shift,
    syncDB
};
