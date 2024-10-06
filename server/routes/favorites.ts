import express, { Request, Response } from 'express'
import Favorite from '../models/Favorite'
import User from '../models/User'
import Property from '../models/Property'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  const { clerkUserId, propertyId } = req.body

  try {
    const user = await User.findOne({ clerkUserId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const property = await Property.findById(propertyId)
    if (!property) return res.status(404).json({ message: 'Property not found' })

    const existingFavorite = await Favorite.findOne({ userId: user._id, propertyId })
    if (existingFavorite) return res.status(400).json({ message: 'Property already in favorites' })

    const favorite = new Favorite({
      userId: user._id,
      propertyId,
    })

    await favorite.save()
    return res.status(201).json(favorite) 
  } catch (error) {
    console.error('Error adding favorite:', error)
    return res.status(500).json({ message: 'Failed to add favorite', error }) 
  }
})

router.get('/:clerkUserId', async (req: Request, res: Response) => {
  const { clerkUserId } = req.params

  try {
    const user = await User.findOne({ clerkUserId })
    if (!user) return res.status(404).json({ message: 'User not found' })

    const favorites = await Favorite.find({ userId: user._id }).populate('propertyId')
    return res.json(favorites.map(fav => fav.propertyId)) 
  } catch (error) {
    console.error('Error fetching favorites:', error)
    return res.status(500).json({ message: 'Failed to fetch favorites', error })
  }
})

export default router
