import express, { Request, Response } from 'express'
import Property from '../models/Property'
import User from '../models/User'
import { clerkClient } from '@clerk/clerk-sdk-node'
import cloudinary from '../config/cloudinary'
import upload from '../middleware/upload'

const router = express.Router()

// GET all properties
router.get('/', async (_req: Request, res: Response) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Error fetching properties', error });
  }
});

// POST new property
router.post('/', upload.array('images', 10), async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      location,
      maxGuests,
      pricePerNight,
      rooms,
      beds,
      amenities,
      clerkUserId
    } = req.body

    let user = await User.findOne({ clerkUserId })
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId)
      console.log('Clerk User:', clerkUser);
      const username = clerkUser?.username || clerkUser?.firstName + ' ' + clerkUser?.lastName || 'Unknown'
      const email = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown@example.com'
      user = new User({ clerkUserId, username, email })
      await user.save()
    }

    const imageUrls = []
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path)
        imageUrls.push(result.secure_url)
      }
    }

    const newProperty = new Property({
      title,
      description,
      location,
      maxGuests,
      pricePerNight,
      rooms,
      beds,
      amenities: amenities.split(',').map((item: string) => item.trim()),
      userId: user._id,
      username: user.username,
      images: imageUrls
    })

    await newProperty.save()
    return res.status(201).json(newProperty)
  } catch (error) {
    console.error('Error creating property:', error)
    return res.status(400).json({ message: 'Error creating property', error })
  }
})

export default router