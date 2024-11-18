import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePropertyPricing } from './usePropertyPricing'
import { useBookingDates } from '@/composables/booking/useBookingDates'

export function usePropertyBooking(property: Property, propertyId: string) {
  const route = useRoute()
  const router = useRouter()

  // Initializing dates from route query params
  const initialCheckInDate = ref<string | null>(route.query.checkIn as string || null)
  const initialCheckOutDate = ref<string | null>(route.query.checkOut as string || null)

  // Gets booking dates functionality
  const {
    bookingCheckInDate,
    bookingCheckOutDate,
    updateDates
  } = useBookingDates(propertyId)

  // Creating computed values for pricing calculations
  const currentCheckInDate = computed(() => bookingCheckInDate.value)
  const currentCheckOutDate = computed(() => bookingCheckOutDate.value)

  // Gets pricing functionality
  const {
    numberOfNights,
    basePrice,
    totalPrice,
    formatPrice
  } = usePropertyPricing({
    checkInDate: currentCheckInDate,
    checkOutDate: currentCheckOutDate,
    pricePerNight: property.pricePerNight
  })

  const isDateRangeSelected = computed(() => 
    bookingCheckInDate.value && bookingCheckOutDate.value
  )

  // Watching for date changes
  watch(
    [bookingCheckInDate, bookingCheckOutDate],
    ([newCheckIn, newCheckOut], [oldCheckIn, oldCheckOut]) => {
      if (newCheckIn !== oldCheckIn || newCheckOut !== oldCheckOut) {
        console.log('Dates updated:', newCheckIn, newCheckOut)
      }
    }
  )

  const redirectToBookingPage = () => {
    if (bookingCheckInDate.value && bookingCheckOutDate.value) {
      router.push({
        name: 'BookingPage',
        query: {
          propertyId,
          checkIn: bookingCheckInDate.value,
          checkOut: bookingCheckOutDate.value
        }
      })
    } else {
      console.error('Dates are not selected')
    }
  }

  return {
    // Dates
    bookingCheckInDate,
    bookingCheckOutDate,
    updateDates,
    // Pricing
    numberOfNights,
    basePrice,
    totalPrice,
    formatPrice,
    // State
    isDateRangeSelected,
    // Actions
    redirectToBookingPage
  }
}