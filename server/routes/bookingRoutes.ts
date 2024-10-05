import express from 'express'
import Booking from '../models/Booking'
import Property from '../models/Property'

const router = express.Router()

router.post('/', async (req: express.Request, res: express.Response) => {
  try {
    const { propertyId, startDate, endDate } = req.body;

    //checks if the property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' })
    }

    //checking for overlapping bookings
    const overlappingBooking = await Booking.findOne({
      propertyId,
      $or: [
        { startDate: { $lt: endDate }, endDate: { $gt: startDate } }
      ]
    })

    if (overlappingBooking) {
      return res.status(400).json({ message: 'The property is already booked for the selected dates.' });
    }

    //total price
    const start = new Date(startDate);
    const end = new Date(endDate);
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24));
    const totalPrice = nights * property.pricePerNight;

    const newBooking = new Booking({
      propertyId,
      startDate,
      endDate,
      totalPrice,
      status: 'confirmed'
    })

    await newBooking.save()
    return res.status(201).json(newBooking)
  } catch (error) {
    console.error('Error creating booking:', error)
    return res.status(500).json({ message: 'Error creating booking', error: error.message })
  }
})

router.get('/unavailable/:propertyId', async (req: express.Request, res: express.Response) => {
  try {
    const bookings = await Booking.find({
      propertyId: req.params.propertyId,
      status: { $ne: 'cancelled' } 
    }).select('startDate endDate')
    
    res.json({ unavailableDates: bookings })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching unavailable dates', error: error.message })
  }
})

export default router
