import { updatePropertyDates } from "@/services/propertyService"
import { useRoute, useRouter } from 'vue-router'
import { ref } from 'vue'

export const useBookingDates = (propertyId: string) => {
    const route = useRoute()
    const router = useRouter()

    const bookingCheckInDate = ref<string | null>(route.query.checkIn as string || null)
    const bookingCheckOutDate = ref<string | null>(route.query.checkOut as string || null)

    const updateDates = async (newCheckIn: string, newCheckOut: string) => {
        bookingCheckInDate.value = newCheckIn
        bookingCheckOutDate.value = newCheckOut

        try {
            await updatePropertyDates(propertyId, newCheckIn, newCheckOut)
            router.replace({
                query: {
                    ...route.query,
                    checkIn: newCheckIn,
                    checkOut: newCheckOut
                }
            })
        } catch (err) {
            console.error('Error updating property dates:', err)
        }
    }

    return {
        bookingCheckInDate,
        bookingCheckOutDate,
        updateDates
    }
}