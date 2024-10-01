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
}

const PropertySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  maxGuests: { type: Number, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  pricePerNight: { type: Number, required: true },
  rooms: { type: Number, required: true },
  beds: { type: Number, required: true},
  amenities: { type: [String], required: true },
  images: { type: [String], default: [] }  
}, { timestamps: true })

export default mongoose.model<IProperty>('Property', PropertySchema)