const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const { listExpenses, createExpense, updateExpense, deleteExpense } = require('../controllers/expenseController');

router.use(protect);

router.get('/', allowRoles('admin', 'manager'), listExpenses);
router.post('/', allowRoles('admin', 'manager'), createExpense);
router.put('/:id', allowRoles('admin', 'manager'), updateExpense);
router.delete('/:id', allowRoles('admin', 'manager'), deleteExpense);

module.exports = router;

