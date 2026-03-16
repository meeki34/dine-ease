const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { StaffInvite, User, Tenant } = require('../models/index');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
const INVITE_TTL_DAYS = Number(process.env.STAFF_INVITE_TTL_DAYS || 7);

const hashToken = (token) =>
  crypto.createHash('sha256').update(token, 'utf8').digest('hex');

const toInviteResponse = (invite) => ({
  id: invite.id,
  email: invite.email,
  role: invite.role,
  expires_at: invite.expires_at,
  used_at: invite.used_at,
  createdAt: invite.createdAt,
  inviteUrl: invite.token ? `${FRONTEND_URL}/staff-invite/${invite.token}` : null,
});

// @desc    Create staff invite (admin only)
// @route   POST /api/staff/invites
exports.createStaffInvite = async (req, res) => {
  try {
    const { email, role } = req.body;

    if (!email || !role) {
      return res.status(400).json({ success: false, message: 'Email and role are required' });
    }

    if (!['chef', 'manager', 'waiter'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const token_hash = hashToken(token);
    const expires_at = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);

    const invite = await StaffInvite.create({
      tenant_id: req.user.tenant_id,
      invited_by_user_id: req.user.id,
      email,
      role,
      token_hash,
      token,
      expires_at,
    });

    return res.status(201).json({
      success: true,
      data: {
        ...toInviteResponse(invite),
        token, // keep returning token for immediate use/copy
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    List staff invites (admin only)
// @route   GET /api/staff/invites
exports.listStaffInvites = async (req, res) => {
  try {
    const invites = await StaffInvite.findAll({
      where: { tenant_id: req.user.tenant_id },
      order: [['createdAt', 'DESC']],
      limit: 25,
    });

    return res.json({ success: true, count: invites.length, data: invites.map(toInviteResponse) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Regenerate invite link (admin only)
// @route   POST /api/staff/invites/:id/regenerate
exports.regenerateStaffInvite = async (req, res) => {
  try {
    const invite = await StaffInvite.findOne({
      where: { id: req.params.id, tenant_id: req.user.tenant_id },
    });

    if (!invite) return res.status(404).json({ success: false, message: 'Invite not found' });
    if (invite.used_at) return res.status(400).json({ success: false, message: 'Invite already used' });

    const token = crypto.randomBytes(32).toString('hex');
    const token_hash = hashToken(token);
    const expires_at = new Date(Date.now() + INVITE_TTL_DAYS * 24 * 60 * 60 * 1000);

    await invite.update({ token, token_hash, expires_at });

    return res.json({
      success: true,
      data: {
        ...toInviteResponse(invite),
        token,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get invite details (public)
// @route   GET /api/staff/invites/:token
exports.getStaffInvite = async (req, res) => {
  try {
    const token = req.params.token;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Token is required' });
    }

    const invite = await StaffInvite.findOne({
      where: { token_hash: hashToken(token) },
    });

    if (!invite || invite.used_at || new Date(invite.expires_at) <= new Date()) {
      return res.status(400).json({ success: false, message: 'Invite is invalid or expired' });
    }

    const tenant = await Tenant.findByPk(invite.tenant_id, { attributes: ['id', 'name'] });

    return res.json({
      success: true,
      data: {
        email: invite.email,
        role: invite.role,
        expires_at: invite.expires_at,
        tenant: tenant ? { id: tenant.id, name: tenant.name } : null,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Accept invite and create user (public)
// @route   POST /api/staff/invites/accept
exports.acceptStaffInvite = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    if (!token || !name || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Token, name and password are required' });
    }

    const invite = await StaffInvite.findOne({
      where: { token_hash: hashToken(token) },
    });

    if (!invite || invite.used_at || new Date(invite.expires_at) <= new Date()) {
      return res.status(400).json({ success: false, message: 'Invite is invalid or expired' });
    }

    const userExists = await User.findOne({ where: { email: invite.email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      tenant_id: invite.tenant_id,
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
    });

    await invite.update({ used_at: new Date(), accepted_user_id: user.id, token: null });

    return res.status(201).json({
      success: true,
      message: 'Invite accepted',
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenant_id: user.tenant_id,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
