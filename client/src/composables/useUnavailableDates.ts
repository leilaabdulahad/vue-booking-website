import { ref, onMounted } from 'vue'
import type { Ref } from 'vue'
import { fetchUnavailableDates } from '../services/bookingService'

export function useUnavailableDates(propertyId: string) {
  const unavailableDates: Ref<Booking[]> = ref([])
  const isLoading = ref(false)

  //function to load unavailable dates from the server
  const loadUnavailableDates = async () => {
    isLoading.value = true
    try {
      unavailableDates.value = await fetchUnavailableDates(propertyId)
    } catch (err){
      console.error('Error fetching unavailable dates:', err)
    } finally {
      isLoading.value = false
    }
  }

  //load unavailable dates when the component is mounted
  onMounted(() => {
    loadUnavailableDates()
  })

  //function to check if a given date is unavailable
  const isDateUnavailable = (date: Date): boolean => {
    return unavailableDates.value.some((booking: Booking) => {
      return date >= booking.startDate && date <= booking.endDate
    })
  }

  return {
    unavailableDates,
    isLoading,
    isDateUnavailable,
    loadUnavailableDates
  }
}
