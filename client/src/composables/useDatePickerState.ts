import { watch } from 'vue'
import { useDateRange } from './useDateRange'
import { useBookingDates } from './useBookingDates'

interface UseDatePickerStateProps {
  propertyId: string
  initialCheckIn: string | Date | null
  initialCheckOut: string | Date | null
}

export const useDatePickerState = ({
  propertyId,
  initialCheckIn,
  initialCheckOut
}: UseDatePickerStateProps) => {
  const { startDate, endDate, minDate, updateDates } = useDateRange(initialCheckIn, initialCheckOut)
  const { bookingCheckInDate, bookingCheckOutDate, updateDates: updateBookingDates } = useBookingDates(propertyId)

  // handles date changes
  const handleDateChange = async () => {
    if (startDate.value && endDate.value) {
      updateDates(startDate.value, endDate.value)
      await updateBookingDates(startDate.value, endDate.value)
    }
  }

  // watching for date changing and handles them
  watch(
    [startDate, endDate],
    ([newStartDate, newEndDate]: [(string | null), (string | null)],
     [oldStartDate, oldEndDate]: [(string | null), (string | null)]) => {
      if (newStartDate && newEndDate && (newStartDate !== oldStartDate || newEndDate !== oldEndDate)) {
        handleDateChange()
      }
    }
  )

  return {
    startDate,
    endDate,
    minDate,
    handleDateChange
  }
}