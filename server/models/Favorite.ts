import mongoose, { Schema, Document } from 'mongoose'

interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId
  propertyId: mongoose.Types.ObjectId
}

const FavoriteSchema: Schema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property', required: true },
}, { timestamps: true })

export default mongoose.model<IFavorite>('Favorite', FavoriteSchema)
