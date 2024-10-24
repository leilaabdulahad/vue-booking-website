import { ref } from 'vue'
import { fetchProperties } from '@/services/propertyService'

export const useProperties = () => {
    const loading = ref(false)
    const error = ref<string | null>(null)
    const properties = ref<Property[]>([])

    const loadProperties = async () => {
        loading.value = true
        error.value = null
        try {
          const data = await fetchProperties()
          properties.value = data
        } catch (err) {
          if (err instanceof Error) {
            error.value = err.message
          } else {
            error.value = 'Unknown error occurred while loading properties.'
          }
          properties.value = []
        } finally {
          loading.value = false
        }
      }

      return {
        loading, 
        error,
        properties,
        loadProperties
      }
    
}