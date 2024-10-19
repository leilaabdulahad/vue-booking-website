import { ref } from 'vue'
import axios from 'axios'
import { bookProperty } from '../services/bookingService'

export const useBooking = (propertyId: string, userId: string) => {
  //reactive references for error, success message and loading state
  const error = ref('')
  const success = ref('')
  const isLoading = ref(false)

  //function to handle booking a property
  const handleBookProperty = async (startDate: string, endDate: string) => {
    isLoading.value = true
    error.value = ''
    success.value = ''

    try {
      await bookProperty(propertyId, startDate, endDate, userId)
      success.value = 'Booking successful!'
    } catch (err) {
      //handle errors from booking service
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
    handleBookProperty
  }
}