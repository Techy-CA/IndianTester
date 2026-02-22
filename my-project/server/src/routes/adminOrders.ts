import express, { Request, Response } from 'express';
import Order from '../models/Order';
import { verifyToken, requireRole } from '../middleware/auth.middleware';

const router = express.Router();

/* ════════════════════════════════
   GET /api/admin/orders  — all orders
════════════════════════════════ */
router.get(
  '/',
  verifyToken,
  requireRole(['admin', 'superadmin']),
  async (_req: Request, res: Response) => {
    try {
      const orders = await Order.find()
        .populate('userId', 'name email')
        .sort({ createdAt: -1 });
      res.json({ success: true, orders });
    } catch {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/* ════════════════════════════════
   PATCH /api/admin/orders/:id/status
   Body: { status, reviewPending, refundInitiated }
════════════════════════════════ */
router.patch(
  '/:id/status',
  verifyToken,
  requireRole(['admin', 'superadmin']),
  async (req: Request, res: Response) => {
    try {
      const { status, reviewPending, refundInitiated } = req.body;

      const allowedStatus = ['pending', 'accepted', 'rejected', 'refunded'];
      if (status && !allowedStatus.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const update: Record<string, unknown> = {};
      if (status !== undefined)          update.status = status;
      if (reviewPending !== undefined)   update.reviewPending = reviewPending;
      if (refundInitiated !== undefined) update.refundInitiated = refundInitiated;

      const order = await Order.findByIdAndUpdate(
        req.params.id,
        { $set: update },
        { new: true }
      ).populate('userId', 'name email');

      if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

      res.json({ success: true, order });
    } catch {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

export default router;
