import express, { Request, Response } from 'express'
import Property from '../models/Property'
import User from '../models/User'
import { clerkClient } from '@clerk/clerk-sdk-node'

const router = express.Router()

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      maxGuests,
      pricePerNight,
      rooms,
      amenities,
      clerkUserId
    } = req.body

    //find/creates the user based on clerk id
    let user = await User.findOne({ clerkUserId })
    if (!user) {
      //fetches user details
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      const username = clerkUser?.username || clerkUser?.firstName + ' ' + clerkUser?.lastName || 'Unknown'
      const email = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown@example.com'
      
      user = new User({ clerkUserId, username, email })
      await user.save()
    }

    const newProperty = new Property({
      title,
      description,
      location,
      maxGuests,
      pricePerNight,
      rooms,
      amenities,
      userId: user._id,
      username: user.username,
    })
    await newProperty.save()

    res.status(201).json(newProperty)
  } catch (error) {
    res.status(400).json({ message: 'Error creating property', error })
  }
})

//using _ to indicates an unused parameter, will be used later
router.get('/', async (_: Request, res: Response) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 }).populate('userId', 'username')

    const propertiesWithUserInfo = properties.map(property => ({
      ...property.toObject(),
      user: property.userId ? { username: (property.userId as any).username } : null
    }))

    res.json(propertiesWithUserInfo)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching properties', error })
  }
})


export default router
