import { ref } from 'vue'
import { fetchPropertyById } from '@/services/propertyService'

export const usePropertyDetails = (propertyId: string) => {
  const property = ref<Property | null>(null)
  const loading = ref(true)
  const error = ref('')

  const fetchProperty = async () => {
    try {
      property.value = await fetchPropertyById(propertyId)
    } catch (err) {
      console.error('Failed to fetch property details:', err)
      error.value = 'Failed to load property details. Try again'
    } finally {
      loading.value = false
    }
  }

  return {
    property,
    loading,
    error,
    fetchProperty
  }
}
