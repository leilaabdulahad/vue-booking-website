import { fetchUserBookings } from "@/services/bookingService"
import { useAuth } from "vue-clerk"
import { ref, onMounted } from "vue"

// Fetches and manages all bookings for the currently autenticated user
// Sorting and date formatting for the fetched bookings

export const useFetchBookings = () => {

    const { userId } = useAuth()
    const bookings = ref<Booking[]>([])
    const loading = ref(true)
    const error = ref<string | null>(null)

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString()
    }

    const loadBookings = async () => {
        const currentUserId = userId.value

        if (!currentUserId) {
            error.value = 'No user ID found'
            loading.value = false
            return
        }

        try {
            loading.value = true
            error.value = null
            const fetchedBookings = await fetchUserBookings(currentUserId)

            bookings.value = fetchedBookings.sort((a: Booking, b: Booking) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())


        } catch (err) {
            error.value = 'Failed to load bookings, try again'
            console.error('Error loading bookings:', err)
        } finally {
            loading.value = false
        }
    }

    onMounted(() => {
        loadBookings()
    })


    return {
        loading, 
        error,
        bookings,
        loadBookings,
        formatDate,
    }
}