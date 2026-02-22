"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const OrderSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    dealType: {
        type: String,
        enum: ['review', 'rating', 'only-order'],
        required: true,
    },
    affiliateName: { type: String, required: true },
    brandName: { type: String, required: true },
    campaignManager: { type: String, required: true },
    agentName: { type: String, default: '' },
    orderDate: { type: String, required: true },
    orderIdText: { type: String, required: true },
    orderAmount: { type: Number, required: true },
    refundAmount: { type: Number, required: true },
    productCode: { type: String, default: '' },
    productName: { type: String, default: '' },
    screenshotPath: { type: String, default: '' }, // server path
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'refunded'],
        default: 'pending',
    },
    reviewPending: { type: Boolean, default: true },
    refundInitiated: { type: Boolean, default: false },
}, { timestamps: true });
exports.default = mongoose_1.default.model('Order', OrderSchema);
