import mongoose, { Schema, Document } from 'mongoose'

interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId
  startDate: Date
  endDate: Date
  totalPrice: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
  username: string
}

const BookingSchema: Schema = new Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true}
})

export default mongoose.model<IBooking>('Booking', BookingSchema)
