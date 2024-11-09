import { computed, type Ref } from 'vue'

interface PropertyPricingParams {
  checkInDate: Ref<string | null>
  checkOutDate: Ref<string | null>
  pricePerNight: number
}

export const usePropertyPricing = ({
  checkInDate,
  checkOutDate,
  pricePerNight
}: PropertyPricingParams) => {
  const numberOfNights = computed(() => {
    if (!checkInDate.value || !checkOutDate.value) return 0
    
    const start = new Date(checkInDate.value)
    const end = new Date(checkOutDate.value)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  })

  const basePrice = computed(() => pricePerNight)
  
  const totalPrice = computed(() => {
    if (numberOfNights.value === 0) return 0
    return (numberOfNights.value * basePrice.value) + 350 + 500
  })

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('sv-SE', {
      style: 'currency',
      currency: 'SEK',
      maximumFractionDigits: 0
    }).format(amount).replace('SEK', 'kr')
  }

  return {
    numberOfNights,
    basePrice,
    totalPrice,
    formatPrice
  }
}