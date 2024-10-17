import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

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

export const bookProperty = async (
  propertyId: string,
  startDate: string,
  endDate: string,
  clerkUserId: string
) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/bookings`, {
      propertyId,
      startDate,
      endDate,
      clerkUserId,
    })
    return response.data;
  } catch (err) {
    console.error('Error booking property:', err)
    throw err;
  }
}
