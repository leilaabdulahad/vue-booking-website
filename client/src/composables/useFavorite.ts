import { ref, onMounted, watch } from 'vue'
import { useUser } from 'vue-clerk'
import { fetchFavoriteStatus, addToFavorites, removeFromFavorites } from '@/services/favoritesService'

export function useFavorite(propertyId: string, emit: (event: 'favoriteToggled', propertyId: string) => void) {
  const { user, isLoaded } = useUser()
  const isFavorite = ref(false)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const updateFavoriteStatus = async () => {
    if (!user.value) return
    
    loading.value = true
    error.value = null
    
    try {
      isFavorite.value = await fetchFavoriteStatus(user.value.id, propertyId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      loading.value = false
    }
  }

  const toggleFavorite = async () => {
    if (!user.value) {
      alert('Please sign in to manage favorites')
      return
    }
    
    loading.value = true
    error.value = null
    
    try {
      if (isFavorite.value) {
        await removeFromFavorites(user.value.id, propertyId)
      } else {
        await addToFavorites(user.value.id, propertyId)
      }
      isFavorite.value = !isFavorite.value
      emit('favoriteToggled', propertyId)
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
    } finally {
      loading.value = false
    }
  }

  onMounted(async () => {
    if (isLoaded.value && user.value) {
      await updateFavoriteStatus()
    }
  })

  watch([user, isLoaded], async ([newUser, loaded]) => {
    if (newUser && loaded) {
      await updateFavoriteStatus()
    }
  })

  return {
    isFavorite,
    loading,
    error,
    toggleFavorite,
    updateFavoriteStatus
  }
}
