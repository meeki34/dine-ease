const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const {
  listIngredients,
  createIngredient,
  updateIngredient,
  deleteIngredient,
  adjustIngredient,
  listTransactions,
} = require('../controllers/inventoryController');

router.use(protect);

// Read-only inventory views for kitchen/staff
router.get('/ingredients', allowRoles('admin', 'manager', 'chef', 'waiter'), listIngredients);
router.get('/transactions', allowRoles('admin', 'manager', 'chef'), listTransactions);

// Management actions
router.post('/ingredients', allowRoles('admin', 'manager'), createIngredient);
router.put('/ingredients/:id', allowRoles('admin', 'manager'), updateIngredient);
router.delete('/ingredients/:id', allowRoles('admin', 'manager'), deleteIngredient);
router.post('/ingredients/:id/adjust', allowRoles('admin', 'manager'), adjustIngredient);

module.exports = router;

