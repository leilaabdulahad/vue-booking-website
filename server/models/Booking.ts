import mongoose, { Schema, Document } from 'mongoose'

interface IBooking extends Document {
  propertyId: mongoose.Types.ObjectId
  userId: mongoose.Types.ObjectId | string
  clerkUserId: string
  firstName: string
  lastName: string
  address: string
  postalCode: string
  city: string
  email: string
  phoneNumber: string
  startDate: Date
  endDate: Date
  totalPrice: number
  numberOfNights: number
  status: 'pending' | 'confirmed' | 'cancelled'
  createdAt: Date
  username: string
  confirmationToken: string       
  confirmationTokenUsed: boolean     
  confirmationTokenExpiry: Date       
}

const BookingSchema: Schema = new Schema({
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  clerkUserId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  address: { type: String, required: true },
  postalCode: { type: String, required: true },
  city: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  numberOfNights: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
  createdAt: { type: Date, default: Date.now },
  username: { type: String, required: true },
  confirmationToken: { type: String, required: true, unique: true },
  confirmationTokenUsed: { type: Boolean, default: false },
  confirmationTokenExpiry: { type: Date, required: true }
})

export default mongoose.model<IBooking>('Booking', BookingSchema)