const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const dotenv = require('dotenv');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { connectDB } = require('./config/db');
const { syncDB } = require('./models/index');
const { initSocket } = require('./utils/socket');
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const orderRoutes = require('./routes/orderRoutes');
const staffRoutes = require('./routes/staffRoutes');
const tableRoutes = require('./routes/tableRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const kitchenRoutes = require('./routes/kitchenRoutes'); 
const superAdminRoutes = require('./routes/superAdminRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const supplierRoutes = require('./routes/supplierRoutes');
const poRoutes = require('./routes/poRoutes');
const performanceRoutes = require('./routes/performanceRoutes');
const tenantRoutes = require('./routes/tenantRoutes');
const publicRoutes = require('./routes/publicRoutes');
const billingRoutes = require('./routes/billingRoutes');
// Load env vars
dotenv.config();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads', 'menu');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Init app
const app = express();
const server = http.createServer(app);
const io = initSocket(server);

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/staff', staffRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/kitchen', kitchenRoutes); // New kitchen route
app.use('/api/superadmin', superAdminRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/pos', poRoutes);
app.use('/api/performance', performanceRoutes);
app.use('/api/tenant', tenantRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/billing', billingRoutes);

// Test route
app.get('/', (req, res) => {
    res.json({
        message: 'DINE-EASE API is running!',
        version: '2.0',
        status: 'success'
    });
});

// Port
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const initDB = async () => {
    await connectDB();
    await syncDB();
};


initDB();
