import mongoose, { Document, Schema } from 'mongoose'

interface IProperty extends Document {
  title: string
  description: string
  location: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

const PropertySchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true })


export default mongoose.model<IProperty>('Property', PropertySchema)