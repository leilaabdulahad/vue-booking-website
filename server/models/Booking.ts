import mongoose, { Schema, Document } from 'mongoose'

interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId
  startDate: Date
  endDate: Date
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
}

const BookingSchema: Schema = new Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.model<IBooking>('Booking', BookingSchema)