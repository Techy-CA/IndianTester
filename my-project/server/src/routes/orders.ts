import express, { Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Order from '../models/Order';
import { protect, AuthRequest } from '../middleware/auth.middleware';

const router = express.Router();

/* ── Multer setup ── */
const uploadDir = path.join(__dirname, '../../uploads/screenshots');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/* ════════════════════════════════
   GET /api/orders/screenshot/:filename
   ⚠️ MUST be before /:id route
════════════════════════════════ */
router.get('/screenshot/:filename', protect, (req: AuthRequest, res: Response) => {
const filePath = path.join(uploadDir, String(req.params.filename));
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'File not found' });
  }
  res.sendFile(filePath);
});

/* ════════════════════════════════
   GET /api/orders
════════════════════════════════ */
router.get('/', protect, async (req: AuthRequest, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.user!.id })
      .sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ════════════════════════════════
   POST /api/orders
════════════════════════════════ */
router.post(
  '/',
  protect,
  upload.single('screenshot'),
  async (req: AuthRequest, res: Response) => {
    try {
      const {
        dealType, affiliateName, brandName, campaignManager,
        agentName, orderDate, orderIdText,
        orderAmount, refundAmount, productCode, productName,
      } = req.body;

      if (!dealType || !affiliateName || !brandName || !campaignManager
          || !orderDate || !orderIdText || !orderAmount || !refundAmount) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const newOrder = await Order.create({
        userId:         req.user!.id,
        dealType,
        affiliateName,
        brandName,
        campaignManager,
        agentName:      agentName || '',
        orderDate,
        orderIdText,
        orderAmount:    Number(orderAmount),
        refundAmount:   Number(refundAmount),
        productCode:    productCode || '',
        productName:    productName || '',
        screenshotPath: req.file ? req.file.filename : '',
      });

      res.status(201).json({ success: true, order: newOrder });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
);

/* ════════════════════════════════
   GET /api/orders/:id
════════════════════════════════ */
router.get('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, userId: req.user!.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.json({ success: true, order });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/* ════════════════════════════════
   DELETE /api/orders/:id
════════════════════════════════ */
router.delete('/:id', protect, async (req: AuthRequest, res: Response) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, userId: req.user!.id });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    if (order.screenshotPath) {
      const filePath = path.join(uploadDir, order.screenshotPath);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    res.json({ success: true, message: 'Order deleted' });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
