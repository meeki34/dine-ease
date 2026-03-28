const express = require('express');
const router = express.Router();
const { protect, allowRoles } = require('../middleware/auth');
const {
  getBills,
  getBillableTables,
  generateBill,
  getBill,
  updateBill,
  payBill,
  getReceiptData
} = require('../controllers/billingController');

// All billing routes require auth + admin/manager/waiter
router.use(protect);
router.use(allowRoles('admin', 'manager', 'waiter'));

router.get('/', getBills);
router.get('/tables', getBillableTables);
router.post('/generate', generateBill);
router.get('/:id', getBill);
router.put('/:id', updateBill);
router.put('/:id/pay', payBill);
router.get('/:id/receipt', getReceiptData);

module.exports = router;
