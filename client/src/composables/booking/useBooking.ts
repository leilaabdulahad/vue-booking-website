import { ref } from 'vue'
import axios from 'axios'
import { bookProperty } from '@/services/bookingService'
import { useRouter } from 'vue-router'

// Handles creation of new bokings and manages the booking submission 
// Takes propertyId and userId as parameters to create new booking with user details

export const useBooking = (propertyId: string, userId: string | undefined) => {
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
      // Check for userId before proceeding
      if (!userId) {
        throw new Error('User must be logged in to make a booking')
      }

      const numberOfNights = Math.round(
        (new Date(checkOutDate).getTime() - new Date(checkInDate).getTime()) /
        (1000 * 60 * 60 * 24)
      )

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

      if (bookingResult.confirmationToken) {
        success.value = true
        return bookingResult
      } else {
        error.value = 'No confirmation token received'
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        error.value = `Error booking property: ${err.response.data.message || err.message}`
      } else {
        error.value = 'An unexpected error occurred. Try again'
      }
    } finally {
      isLoading.value = false
    }
  }

  return {
    error,
    success,
    isLoading,
    handleBooking,
  }
}
