import express, { Request, Response } from 'express';
import Property from '../models/Property';
import User from '../models/User';
import { clerkClient } from '@clerk/clerk-sdk-node';
import cloudinary from '../config/cloudinary';
import upload from '../middleware/upload';

const router = express.Router();

// GET all properties with optional filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { country, city } = req.query;
    const filters: any = {};

    // Apply filters based on query parameters
    if (country) {
      filters['location.country'] = country;
    }
    if (city) {
      filters['location.city'] = city;
    }

    const properties = await Property.find(filters).sort({ createdAt: -1 });
    return res.json(properties); // Ensure response is returned
  } catch (error) {
    console.error('Error fetching properties:', error);
    return res.status(500).json({ message: 'Error fetching properties', error }); // Ensure response is returned
  }
});

// POST new property
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
      country, // Get country from request body
      city,    // Get city from request body
    } = req.body;

    let user = await User.findOne({ clerkUserId });
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      console.log('Clerk User:', clerkUser);
      const username = clerkUser?.username || clerkUser?.firstName + ' ' + clerkUser?.lastName || 'Unknown';
      const email = clerkUser?.emailAddresses[0]?.emailAddress || 'unknown@example.com';
      user = new User({ clerkUserId, username, email });
      await user.save();
    }

    const imageUrls = [];
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        const result = await cloudinary.uploader.upload(file.path);
        imageUrls.push(result.secure_url);
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
    });

    await newProperty.save();
    return res.status(201).json(newProperty); // Ensure response is returned
  } catch (error) {
    console.error('Error creating property:', error);
    return res.status(400).json({ message: 'Error creating property', error }); // Ensure response is returned
  }
});

// GET a specific property by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    return res.json(property); // Ensure response is returned
  } catch (error) {
    console.error('Error fetching property:', error);
    return res.status(500).json({ message: 'Error fetching property', error }); // Ensure response is returned
  }
});

export default router;
