import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Fetch unavailable dates for a property
export const fetchUnavailableDates = async (propertyId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/bookings/unavailable/${propertyId}`)
    return response.data.unavailableDates.map((booking: any) => ({
      startDate: new Date(booking.startDate),
      endDate: new Date(booking.endDate),
    }))
  } catch (err) {
    console.error('Error fetching unavailable dates:', err)
    throw err;
  }
}

// Create a new booking
export const bookProperty = async (
  propertyId: string,
  startDate: string,
  endDate: string,
  clerkUserId: string,
  numberOfNights: number,
  firstName: string,
  lastName: string,
  address: string,
  postalCode: string,
  city: string,
  email: string,
  phoneNumber: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/bookings`, {
      propertyId,
      startDate,
      endDate,
      clerkUserId,
      numberOfNights,
      firstName,
      lastName,
      address,
      postalCode,
      city,
      email,
      phoneNumber,
    })
    return response.data
  } catch (err) {
    console.error('Error booking property:', err)
    throw err
  }
}

// Fetch a booking by confirmation token
export const getBookingByToken = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/bookings/confirmation/${token}`)
    return response.data;
  } catch (err) {
    console.error('Error fetching booking confirmation:', err)
    throw err
  }
}

// Fetch all bookings for a specific user
export const fetchUserBookings = async (clerkUserId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/bookings/user/${clerkUserId}`)
    return response.data;
  } catch (err) {
    console.error('Error fetching user bookings:', err)
    throw err
  }
}
