import mongoose, { Document, Schema } from 'mongoose'

interface IUser extends Document {
  clerkUserId: string
  username: string
  email: string
}

const UserSchema: Schema = new Schema({
  clerkUserId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  email: { type: String, required: true },
}, { timestamps: true })

export default mongoose.model<IUser>('User', UserSchema)