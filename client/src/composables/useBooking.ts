import { ref } from 'vue'
import axios from 'axios'
import { bookProperty } from '../services/bookingService'

export const useBooking = (propertyId: string, userId: string) => {
  const error = ref<string | null>(null)
  const success = ref(false)
  const isLoading = ref(false)

  const handleBooking = async (
    checkInDate: string,
    checkOutDate: string,
    firstName: string,
    lastName: string,
    address: string,
    postalCode: string,
    city: string,
    email: string,
    phoneNumber: string
  ) => {
    isLoading.value = true
    error.value = null
    success.value = false

    try {
      const numberOfNights = Math.round((new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) / (1000 * 60 * 60 * 24))
      const bookingResult = await bookProperty(
        propertyId,
        checkInDate,
        checkOutDate,
        userId,
        numberOfNights,
        firstName,
        lastName,
        address,
        postalCode,
        city,
        email,
        phoneNumber
      )
      success.value = true
      return bookingResult
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = `Error booking property: ${err.response.data.message || err.message}`
      } else {
        error.value = 'An unexpected error occurred. Try again'
      }
      console.error('Error booking property:', err)
    } finally {
      isLoading.value = false
    }
  }

  return {
    error,
    success,
    isLoading,
    handleBooking
  }
}