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

// Associations
Tenant.hasMany(Order, { foreignKey: 'tenant_id' });
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
Table.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(Ingredient, { foreignKey: 'tenant_id' });
Ingredient.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Ingredient.hasMany(InventoryTransaction, { foreignKey: 'ingredient_id' });
InventoryTransaction.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });

Tenant.hasMany(Expense, { foreignKey: 'tenant_id' });
Expense.belongsTo(Tenant, { foreignKey: 'tenant_id' });

Tenant.hasMany(DailyLog, { foreignKey: 'tenant_id' });
DailyLog.belongsTo(Tenant, { foreignKey: 'tenant_id' });

// Sync all models
const syncDB = async () => {
    try {
        await sequelize.sync({ alter: true });
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
    syncDB
};
