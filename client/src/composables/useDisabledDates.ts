import { computed } from 'vue'
import { useUnavailableDates } from './useUnavailableDates'


export const useDisabledDates = (propertyId: string) => {
  const { unavailableDates, isLoading: isLoadingDates, isDateUnavailable } = useUnavailableDates(propertyId)

  const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
    const dates: Date[] = []
    let currentDate = new Date(startDate)
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return dates
  }

  const disabledDates = computed(() => {
    return unavailableDates.value.flatMap((booking: Booking) =>
      getDatesBetween(
        new Date(booking.startDate),
        new Date(booking.endDate)
      )
    )
  })

  return {
    disabledDates,
    isLoadingDates,
    isDateUnavailable
  }
}