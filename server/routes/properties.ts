import express, { Request, Response } from 'express'
import Property from '../models/Property'
import User from '../models/User'
import { clerkClient } from '@clerk/clerk-sdk-node'
import cloudinary from '../config/cloudinary'
import upload from '../middleware/upload'

const router = express.Router()

router.get('/', async (req: Request, res: Response) => {
  try {
    const { search } = req.query
    let filter = {}

    //if a search query is provided, create a filter for properties
    if (search) {
      filter = {
        $or: [
          { 'location.country': { $regex: search, $options: 'i' } },
          { 'location.city': { $regex: search, $options: 'i' } }
        ]
      }
    }

    //fetch properties, sorted by creation date
    const properties = await Property.find(filter).sort({ createdAt: -1 })
    return res.json(properties)
  } catch (error) {
    console.error('Error fetching properties:', error)
    return res.status(500).json({ message: 'Error fetching properties', error })
  }
})

//route to create a new property, including img uploads
router.post('/', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      maxGuests,
      pricePerNight,
      rooms,
      beds,
      amenities,
      clerkUserId,
      country, 
      city,    
    } = req.body

    //check if the user exists, if not create new one
    let user = await User.findOne({ clerkUserId })
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      console.log('Clerk User:', clerkUser)
      const username = clerkUser?.username || clerkUser?.firstName + ' ' + clerkUser?.lastName || 'Unknown'
      const email = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown@example.com'
      user = new User({ clerkUserId, username, email })
      await user.save()
    }

    const imageUrls = []
    //uploads imgs to cloudinary and collects their URLs
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path)
        imageUrls.push(result.secure_url)
      }
    }

    const newProperty = new Property({
      title,
      description,
      location: {
        country, 
        city,  
      },
      maxGuests,
      pricePerNight,
      rooms,
      beds,
      amenities: amenities.split(',').map((item: string) => item.trim()),
      userId: user._id,
      username: user.username,
      images: imageUrls,
    })

    await newProperty.save()
    return res.status(201).json(newProperty)
  } catch (error) {
    console.error('Error creating property:', error)
    return res.status(400).json({ message: 'Error creating property', error })
  }
})

//fetches to individual properties
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }
    return res.json(property)
  } catch (error) {
    console.error('Error fetching property:', error)
    return res.status(500).json({ message: 'Error fetching property', error })
  }
})

//route to update checkin/checkout dates for specific properties
router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { checkInDate, checkOutDate } = req.body

    const updatedProperty = await Property.findByIdAndUpdate (
      id,
      { $set: { checkInDate, checkOutDate } },
      { new: true }
    )

    if(!updatedProperty) {
      return res.status(404).json({ message: 'Property not found' })
    }

    return res.json(updatedProperty)
  } catch (error) {
    console.error('Error updating property dates:', error)
    return res.status(500).json({ message: 'Error updating property dates:', error})
  }
})

export default router
