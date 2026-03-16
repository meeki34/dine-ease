const express = require('express');
const router = express.Router();
const {
  getStaff,
  addStaff,
  updateStaff,
  deactivateStaff
} = require('../controllers/staffController');
const {
  createStaffInvite,
  listStaffInvites,
  getStaffInvite,
  acceptStaffInvite,
  regenerateStaffInvite,
} = require('../controllers/inviteController');
const { protect, allowRoles } = require('../middleware/auth');

// Public invite routes (no auth)
router.get('/invites/:token', getStaffInvite);
router.post('/invites/accept', acceptStaffInvite);

// All routes protected
router.use(protect);

// Create invite - admin only
router.post('/invites', allowRoles('admin'), createStaffInvite);

// List invites - admin only
router.get('/invites', allowRoles('admin'), listStaffInvites);

// Regenerate invite link - admin only
router.post('/invites/:id/regenerate', allowRoles('admin'), regenerateStaffInvite);

// Get all staff - admin and manager
router.get('/', allowRoles('admin', 'manager'), getStaff);

// Add staff - admin only
router.post('/', allowRoles('admin'), addStaff);

// Update staff - admin only
router.put('/:id', allowRoles('admin'), updateStaff);

// Deactivate staff - admin only
router.delete('/:id', allowRoles('admin'), deactivateStaff);

module.exports = router;
