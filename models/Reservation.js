import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table' },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  guestCount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'cancelled'],
    default: 'pending'
  }
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);
