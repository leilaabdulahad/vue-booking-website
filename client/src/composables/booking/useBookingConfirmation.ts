import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getBookingByToken } from '@/services/bookingService'

// Fetches and displays booking confirmation details using a confirmation token
// Handles the post-booking confirmation page and error

export const useBookingConfirmation = () => {
    const route = useRoute()
    const booking = ref<Booking | null>(null)
    const error = ref<string>('')
    const loading = ref(true)

    const fetchBooking = async () => {
        const token = route.query.token as string

        if(!token) {
            error.value = 'Ingen bokningsinformation tillgänglig'
            loading.value = false
            return
        }

        try {
            const fetchedBooking = await getBookingByToken(token)
            booking.value = fetchedBooking
        } catch (err) {
            error.value = 'Bokningen har utgått eller är ogiltig'
        } finally {
            loading.value = false
        }
    }

    return {
        booking,
        error,
        loading,
        fetchBooking
    }
}