import express from 'express'
import Booking from '../models/Booking'
import Property from '../models/Property'
import { clerkClient } from '@clerk/clerk-sdk-node'
import crypto from 'crypto'

const router = express.Router()

// Helper function to generate token
const generateConfirmationToken = (): string => {
  return crypto.randomBytes(32).toString('hex')
}

// Route to create a booking
router.post('/', async (req, res) => {
  try {
    const {
      propertyId,
      startDate,
      endDate,
      firstName,
      lastName,
      address,
      postalCode,
      city,
      email,
      phoneNumber,
      clerkUserId,
      numberOfNights,
    } = req.body

    // Validating property existence
    const property = await Property.findById(propertyId)
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    // Checking for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      propertyId,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } },
      ],
    })
    if (overlappingBooking) {
      return res.status(400).json({ message: 'The property is already booked for the selected dates' })
    }

    // Generating confirmation token 24h and expiry
    const confirmationToken = generateConfirmationToken()
    const confirmationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

    // Fetching username from Clerk
    let username = 'Unknown'
    if (clerkUserId) {
      try {
        const clerkUser = await clerkClient.users.getUser(clerkUserId);
        username = clerkUser?.username || `${clerkUser?.firstName} ${clerkUser?.lastName}`.trim() || 'Unknown';
      } catch (clerkError) {
        console.error('Error fetching user from Clerk:', clerkError);
      }
    }

    // Calculating total price
    const nights = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 3600 * 24)
    )
    const totalPrice = nights * property.pricePerNight;

    const newBooking = new Booking({
      propertyId,
      startDate,
      endDate,
      totalPrice,
      status: 'confirmed',
      username,
      firstName,
      lastName,
      address,
      postalCode,
      city,
      email,
      phoneNumber,
      numberOfNights,
      createdAt: new Date(),
      clerkUserId,
      confirmationToken,
      confirmationTokenExpiry,
      confirmationTokenUsed: false,
    })

    await newBooking.save();

    // Return confirmation URL
    return res.status(201).json({
      ...newBooking.toObject(),
      confirmationUrl: `/booking-confirmation?token=${confirmationToken}`,
    })
  } catch (error) {
    console.error('Error creating booking:', error)
    return res.status(500).json({ message: 'Error creating booking', error: error.message })
  }
})

// Route to validate confirmation token and fetch booking
router.get('/confirmation/:token', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      confirmationToken: req.params.token,
      confirmationTokenExpiry: { $gt: new Date() },
      confirmationTokenUsed: false,
    }).populate('propertyId')

    if (!booking) {
      return res.status(404).json({ message: 'Bokningen har utgått eller är ogiltig' })
    }

    // Marking token as used
    booking.confirmationTokenUsed = true
    await booking.save()

    return res.json(booking)
  } catch (error) {
    return res.status(500).json({
      message: 'Error fetching booking confirmation',
      error: error.message,
    })
  }
})

// Route to fetch unavailable dates
router.get('/unavailable/:propertyId', async (req, res) => {
  try {
    const bookings = await Booking.find({
      propertyId: req.params.propertyId,
      status: { $ne: 'cancelled' },
    }).select('startDate endDate')
    res.json({ unavailableDates: bookings })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unavailable dates', error: error.message })
  }
})

// Route to fetch user bookings
router.get('/user/:clerkUserId', async (req, res) => {
  try {
    const bookings = await Booking.find({
      clerkUserId: req.params.clerkUserId,
    }).populate('propertyId')
    res.json(bookings)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message })
  }
})

export default router
