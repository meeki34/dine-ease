const { EmployeePerformance, User, Order, Shift, sequelize } = require('../models/index');
const { Op } = require('sequelize');

const SHIFT_STATUSES = new Set(['scheduled', 'in_progress', 'completed', 'absent']);

const parseDateParam = (v, endOfDay = false) => {
    if (!v) return null;
    const s = String(v);
    // Expect YYYY-MM-DD
    const d = new Date(`${s}T${endOfDay ? '23:59:59.999' : '00:00:00'}`);
    return Number.isNaN(d.getTime()) ? null : d;
};

const parseDateTime = (v) => {
    if (!v) return null;
    const d = new Date(v);
    return Number.isNaN(d.getTime()) ? null : d;
};

const validateShiftTimes = ({ start_time, end_time }) => {
    const start = parseDateTime(start_time);
    const end = parseDateTime(end_time);
    if (!start || !end) return { ok: false, message: 'Invalid start_time or end_time' };
    if (start.getTime() >= end.getTime()) return { ok: false, message: 'start_time must be before end_time' };
    return { ok: true };
};

// @desc    Get employee performance stats
// @route   GET /api/performance/stats
exports.getEmployeeStats = async (req, res) => {
    try {
        const { tenant_id, id, role } = req.user;
        const where = { tenant_id, end_time: { [Op.ne]: null } };

        // If not admin/manager, only show own stats
        if (role !== 'admin' && role !== 'manager') {
            where.user_id = id;
        }

        // Guard: check if any records exist before running the GROUP BY aggregation
        // (avoids MySQL strict mode errors on empty datasets)
        const count = await EmployeePerformance.count({ where });
        if (count === 0) {
            return res.json({ success: true, data: [] });
        }

        const stats = await EmployeePerformance.findAll({
            where,
            include: [{ model: User, attributes: ['name', 'role'] }],
            attributes: [
                'user_id',
                'role',
                [sequelize.fn('AVG', sequelize.literal('TIMESTAMPDIFF(SECOND, start_time, end_time)')), 'avg_seconds'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'order_count']
            ],
            group: ['user_id', 'EmployeePerformance.role', 'User.id']
        });

        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get shifts for a tenant
// @route   GET /api/performance/shifts
exports.getShifts = async (req, res) => {
    try {
        const { tenant_id, id, role } = req.user;
        const where = { tenant_id };

        // Non-admin/manager: only return own shifts
        if (role !== 'admin' && role !== 'manager') {
            where.user_id = id;
        } else if (req.query.user_id) {
            const uid = Number(req.query.user_id);
            if (!Number.isFinite(uid) || uid <= 0) {
                return res.status(400).json({ success: false, message: 'Invalid user_id' });
            }
            where.user_id = uid;
        }

        if (req.query.status) {
            const status = String(req.query.status);
            if (!SHIFT_STATUSES.has(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }
            where.status = status;
        }

        const from = req.query.from ? parseDateParam(req.query.from, false) : null;
        const to = req.query.to ? parseDateParam(req.query.to, true) : null;
        if (req.query.from && !from) {
            return res.status(400).json({ success: false, message: 'Invalid from date' });
        }
        if (req.query.to && !to) {
            return res.status(400).json({ success: false, message: 'Invalid to date' });
        }
        if (from || to) {
            where.start_time = {};
            if (from) where.start_time[Op.gte] = from;
            if (to) where.start_time[Op.lte] = to;
        }

        const shifts = await Shift.findAll({
            where,
            include: [{ model: User, attributes: ['name', 'role'] }],
            order: [['start_time', 'ASC'], ['id', 'ASC']]
        });
        res.json({ success: true, data: shifts });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create a shift
// @route   POST /api/performance/shifts
exports.createShift = async (req, res) => {
    try {
        const { user_id, start_time, end_time, status } = req.body;

        const uid = Number(user_id);
        if (!Number.isFinite(uid) || uid <= 0) {
            return res.status(400).json({ success: false, message: 'user_id is required' });
        }

        const timeCheck = validateShiftTimes({ start_time, end_time });
        if (!timeCheck.ok) {
            return res.status(400).json({ success: false, message: timeCheck.message });
        }

        const staff = await User.findOne({ where: { id: uid, tenant_id: req.user.tenant_id } });
        if (!staff) {
            return res.status(400).json({ success: false, message: 'Invalid user_id for this tenant' });
        }

        const nextStatus = status ? String(status) : 'scheduled';
        if (nextStatus && !SHIFT_STATUSES.has(nextStatus)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const shift = await Shift.create({
            user_id: uid,
            start_time,
            end_time,
            status: nextStatus,
            tenant_id: req.user.tenant_id
        });
        res.status(201).json({ success: true, data: shift });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update a shift
// @route   PUT /api/performance/shifts/:id
exports.updateShift = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const shift = await Shift.findOne({ where: { id: req.params.id, tenant_id } });
        if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });

        const patch = {};

        if (req.body.user_id !== undefined) {
            const uid = Number(req.body.user_id);
            if (!Number.isFinite(uid) || uid <= 0) {
                return res.status(400).json({ success: false, message: 'Invalid user_id' });
            }
            const staff = await User.findOne({ where: { id: uid, tenant_id } });
            if (!staff) {
                return res.status(400).json({ success: false, message: 'Invalid user_id for this tenant' });
            }
            patch.user_id = uid;
        }

        if (req.body.start_time !== undefined) patch.start_time = req.body.start_time;
        if (req.body.end_time !== undefined) patch.end_time = req.body.end_time;

        if (patch.start_time !== undefined || patch.end_time !== undefined) {
            const timeCheck = validateShiftTimes({
                start_time: patch.start_time !== undefined ? patch.start_time : shift.start_time,
                end_time: patch.end_time !== undefined ? patch.end_time : shift.end_time
            });
            if (!timeCheck.ok) {
                return res.status(400).json({ success: false, message: timeCheck.message });
            }
        }

        if (req.body.status !== undefined) {
            const status = String(req.body.status);
            if (!SHIFT_STATUSES.has(status)) {
                return res.status(400).json({ success: false, message: 'Invalid status' });
            }
            patch.status = status;
        }

        await shift.update(patch);
        res.json({ success: true, data: shift });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete a shift
// @route   DELETE /api/performance/shifts/:id
exports.deleteShift = async (req, res) => {
    try {
        const tenant_id = req.user.tenant_id;
        const shift = await Shift.findOne({ where: { id: req.params.id, tenant_id } });
        if (!shift) return res.status(404).json({ success: false, message: 'Shift not found' });

        await shift.destroy();
        res.json({ success: true, message: 'Shift deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
