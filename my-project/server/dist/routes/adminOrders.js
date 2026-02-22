"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Order_1 = __importDefault(require("../models/Order"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
/* ════════════════════════════════
   GET /api/admin/orders  — all orders
════════════════════════════════ */
router.get('/', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRole)(['admin', 'superadmin']), async (_req, res) => {
    try {
        const orders = await Order_1.default.find()
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
/* ════════════════════════════════
   PATCH /api/admin/orders/:id/status
   Body: { status, reviewPending, refundInitiated }
════════════════════════════════ */
router.patch('/:id/status', auth_middleware_1.verifyToken, (0, auth_middleware_1.requireRole)(['admin', 'superadmin']), async (req, res) => {
    try {
        const { status, reviewPending, refundInitiated } = req.body;
        const allowedStatus = ['pending', 'accepted', 'rejected', 'refunded'];
        if (status && !allowedStatus.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        const update = {};
        if (status !== undefined)
            update.status = status;
        if (reviewPending !== undefined)
            update.reviewPending = reviewPending;
        if (refundInitiated !== undefined)
            update.refundInitiated = refundInitiated;
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, { $set: update }, { new: true }).populate('userId', 'name email');
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.default = router;
