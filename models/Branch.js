import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  contactNumber: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  operatingHours: {
    open: String,
    close: String
  }
}, { timestamps: true });

export default mongoose.model('Branch', branchSchema);
