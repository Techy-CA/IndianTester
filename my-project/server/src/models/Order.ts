import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  dealType: {
    type: String,
    enum: ['review', 'rating', 'only-order'],
    required: true,
  },
  affiliateName:    { type: String, required: true },
  brandName:        { type: String, required: true },
  campaignManager:  { type: String, required: true },
  agentName:        { type: String, default: '' },
  orderDate:        { type: String, required: true },
  orderIdText:      { type: String, required: true },
  orderAmount:      { type: Number, required: true },
  refundAmount:     { type: Number, required: true },
  productCode:      { type: String, default: '' },
  productName:      { type: String, default: '' },
  screenshotPath:   { type: String, default: '' },  // server path
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'refunded'],
    default: 'pending',
  },
  reviewPending:    { type: Boolean, default: true },
  refundInitiated:  { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Order', OrderSchema);
