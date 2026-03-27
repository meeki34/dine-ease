const { MenuItem, Order, OrderItem, Tenant, Table } = require('../models');
const { getIO } = require('../utils/socket');

const getPublicMenu = async (req, res) => {
    try {
        const { tenantId } = req.params;
        const tenant = await Tenant.findByPk(tenantId);
        if (!tenant) {
            return res.status(404).json({ success: false, message: 'Restaurant not found' });
        }
        
        const menuItems = await MenuItem.findAll({
            where: { tenant_id: tenantId, is_available: true }
        });

        res.json({ success: true, count: menuItems.length, data: menuItems, restaurantName: tenant.name });
    } catch (error) {
        console.error('Error fetching public menu:', error);
        res.status(500).json({ success: false, message: 'Server error fetching menu' });
    }
};

const submitPublicOrder = async (req, res) => {
    const t = await Order.sequelize.transaction();
    try {
        const { tenant_id, table_number, items, notes } = req.body;

        if (!tenant_id || !table_number || !items || items.length === 0) {
            await t.rollback();
            return res.status(400).json({ success: false, message: 'Invalid order details' });
        }

        // Calculate total amount
        let total_amount = 0;
        for (const item of items) {
            total_amount += item.price * item.quantity;
        }

        const newOrder = await Order.create({
            tenant_id,
            table_number,
            status: 'pending',
            total_amount,
            notes: notes ? notes + ' (QR QR Order)' : 'QR Customer Order',
            created_by: null // Customer order
        }, { transaction: t });

        const orderItemsData = items.map(item => ({
            order_id: newOrder.id,
            menu_item_id: item.menu_item_id,
            quantity: item.quantity,
            price: item.price
        }));

        await OrderItem.bulkCreate(orderItemsData, { transaction: t });

        // Update table status if exists
        await Table.update(
            { status: 'occupied' },
            { where: { tenant_id, table_number }, transaction: t }
        );

        await t.commit();

        // Fetch full order for socket
        // Note: adjust includes to match models configuration if needed. Usually OrderItem has many MenuItem.
        // If the association is not setup perfectly, we rely on the frontend fetching or we join manually.
        // We will try simple relations first.
        let savedOrder = newOrder;
        try {
            savedOrder = await Order.findByPk(newOrder.id, {
                include: [{ model: OrderItem }]
            });
        } catch(assocError) {
            console.error("Association include failed:", assocError);
        }

        // Emit socket event to the tenant room
        const io = getIO();
        if (io) {
            io.to(`tenant_${tenant_id}`).emit('order_created', savedOrder);
        }

        res.status(201).json({ success: true, data: savedOrder });
    } catch (error) {
        await t.rollback();
        console.error('Error submitting public order:', error);
        res.status(500).json({ success: false, message: 'Server error submitting order' });
    }
};

module.exports = {
    getPublicMenu,
    submitPublicOrder
};
