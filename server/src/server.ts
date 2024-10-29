import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors from 'cors'
import propertyRoutes from '../routes/properties'
import userRoutes from '../routes/users'
import bookings from '../routes/bookings'
import favoritesRoutes from '../routes/favorites'


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/bookings', bookings)
app.use('/api/favorites', favoritesRoutes)

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in the environment variables.')
  process.exit(1)
}

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.error('MongoDB connection error:', error))

app.use('/api/properties', propertyRoutes)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
