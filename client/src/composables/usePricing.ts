import { computed } from 'vue'
import type { Ref } from 'vue'

interface UsePricingOptions {
  property: Ref<Property | null>
  checkInDate: Ref<string>
  checkOutDate: Ref<string>
  cleaningFee?: number
  serviceFee?: number
}

export const usePricing = ({
    property,
    checkInDate,
    checkOutDate,
    cleaningFee = 500,
    serviceFee = 350
  }: UsePricingOptions) => {
    const numberOfNights = computed(() => {
      if (!checkInDate.value || !checkOutDate.value) return 0
      const start = new Date(checkInDate.value)
      const end = new Date(checkOutDate.value)
      return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
    })
    

  

  const basePrice = computed(() => {
    if (!property.value) return 0
    return property.value.pricePerNight * numberOfNights.value
  })

  const totalPrice = computed(() => {
    return basePrice.value + cleaningFee + serviceFee
  })

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleString('sv-SE', { month: 'long' })
    return `${day} ${month}`
  }

  const formattedDateRange = computed(() => {
    if (!checkInDate.value || !checkOutDate.value) return ''
    const formattedCheckIn = formatDate(checkInDate.value)
    const formattedCheckOut = formatDate(checkOutDate.value)
    return `${formattedCheckIn} - ${formattedCheckOut}`
  })

  return {
    numberOfNights,
    basePrice,
    totalPrice,
    formattedDateRange,
    cleaningFee,
    serviceFee
  }
}