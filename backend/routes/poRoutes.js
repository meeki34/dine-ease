const express = require('express');
const router = express.Router();
const {
  getPOs,
  createPO,
  updatePOStatus
} = require('../controllers/poController');
const { protect, allowRoles } = require('../middleware/auth');

router.use(protect);
router.use(allowRoles('admin', 'manager'));

router.get('/', getPOs);
router.post('/', createPO);
router.put('/:id/status', updatePOStatus);

module.exports = router;
