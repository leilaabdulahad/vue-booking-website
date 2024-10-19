import mongoose, { Document, Schema } from 'mongoose'

interface IProperty extends Document {
  title: string
  description: string
  location: string
  maxGuests: number
  userId: mongoose.Types.ObjectId
  username: string
  createdAt: Date
  pricePerNight: number
  rooms: number
  beds: number
  amenities: string[]
  images: string[]
  rating: number
  checkInDate?: Date
  checkOutDate?: Date
}

const PropertySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: {
    country: { type: String, required: true },
    city: { type: String, required: true }
  },
  maxGuests: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pricePerNight: { type: Number, required: true },
  rooms: { type: Number, required: true },
  beds: { type: Number, required: true},
  amenities: { type: [String], required: true },
  images: { type: [String], default: [] },
  rating: { type: Number, default: 0 },
  checkInDate: { type: Date },
  checkOutDate: { type: Date }
}, { timestamps: true })

export default mongoose.model<IProperty>('Property', PropertySchema)