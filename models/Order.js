import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  items: [{
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'Menu' },
    quantity: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
