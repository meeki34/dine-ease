const express = require('express');
const router = express.Router();
const { getPublicMenu, submitPublicOrder } = require('../controllers/publicController');

router.get('/menu/:tenantId', getPublicMenu);
router.post('/order', submitPublicOrder);

module.exports = router;
