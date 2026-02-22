"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Order_1 = __importDefault(require("../models/Order"));
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = express_1.default.Router();
/* ── Multer setup ── */
const uploadDir = path_1.default.join(__dirname, '../../uploads/screenshots');
if (!fs_1.default.existsSync(uploadDir))
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
        cb(null, `${unique}${path_1.default.extname(file.originalname)}`);
    },
});
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (_req, file, cb) => {
        const allowed = /jpeg|jpg|png|webp|gif/;
        if (allowed.test(path_1.default.extname(file.originalname).toLowerCase())) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    },
});
/* ════════════════════════════════
   GET /api/orders/screenshot/:filename
   ⚠️ MUST be before /:id route
════════════════════════════════ */
router.get('/screenshot/:filename', auth_middleware_1.protect, (req, res) => {
    const filePath = path_1.default.join(uploadDir, String(req.params.filename));
    if (!fs_1.default.existsSync(filePath)) {
        return res.status(404).json({ success: false, message: 'File not found' });
    }
    res.sendFile(filePath);
});
/* ════════════════════════════════
   GET /api/orders
════════════════════════════════ */
router.get('/', auth_middleware_1.protect, async (req, res) => {
    try {
        const orders = await Order_1.default.find({ userId: req.user.id })
            .sort({ createdAt: -1 });
        res.json({ success: true, orders });
    }
    catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
/* ════════════════════════════════
   POST /api/orders
════════════════════════════════ */
router.post('/', auth_middleware_1.protect, upload.single('screenshot'), async (req, res) => {
    try {
        const { dealType, affiliateName, brandName, campaignManager, agentName, orderDate, orderIdText, orderAmount, refundAmount, productCode, productName, } = req.body;
        if (!dealType || !affiliateName || !brandName || !campaignManager
            || !orderDate || !orderIdText || !orderAmount || !refundAmount) {
            return res.status(400).json({ success: false, message: 'Missing required fields' });
        }
        const newOrder = await Order_1.default.create({
            userId: req.user.id,
            dealType,
            affiliateName,
            brandName,
            campaignManager,
            agentName: agentName || '',
            orderDate,
            orderIdText,
            orderAmount: Number(orderAmount),
            refundAmount: Number(refundAmount),
            productCode: productCode || '',
            productName: productName || '',
            screenshotPath: req.file ? req.file.filename : '',
        });
        res.status(201).json({ success: true, order: newOrder });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
/* ════════════════════════════════
   GET /api/orders/:id
════════════════════════════════ */
router.get('/:id', auth_middleware_1.protect, async (req, res) => {
    try {
        const order = await Order_1.default.findOne({ _id: req.params.id, userId: req.user.id });
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, order });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
/* ════════════════════════════════
   DELETE /api/orders/:id
════════════════════════════════ */
router.delete('/:id', auth_middleware_1.protect, async (req, res) => {
    try {
        const order = await Order_1.default.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!order)
            return res.status(404).json({ success: false, message: 'Order not found' });
        if (order.screenshotPath) {
            const filePath = path_1.default.join(uploadDir, order.screenshotPath);
            if (fs_1.default.existsSync(filePath))
                fs_1.default.unlinkSync(filePath);
        }
        res.json({ success: true, message: 'Order deleted' });
    }
    catch {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
exports.default = router;
