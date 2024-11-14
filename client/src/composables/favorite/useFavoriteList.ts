import { ref, watch } from 'vue'
import type { Ref } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'
import { fetchFavorites as getFavorites, fetchPropertyById } from '@/services/favoritesService'

export const useFavoritesList = () => {
  const favorites = ref<Property[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const { user, isLoaded } = useUser()

  const fetchFavoritesList = async () => {
    if (!user.value || !isLoaded.value) return

    try {
      loading.value = true
      const favoriteIds = await getFavorites(user.value.id)
      const propertyResponses = await Promise.all(
        favoriteIds.map((id: { propertyId: string }) => fetchPropertyById(id.propertyId))
      )
      favorites.value = propertyResponses
      error.value = null
    } catch (err) {
      console.error('Error fetching favorites:', err)
      if (axios.isAxiosError(err)) {
        error.value = `Error fetching favorites: ${err.message}. ${err.response?.data?.message || ''}`
      } else {
        error.value = 'An unexpected error occurred while fetching favorites'
      }
    } finally {
      loading.value = false
    }
  }

  const removeFavoriteFromList = (propertyId: string) => {
    favorites.value = favorites.value.filter(property => property._id !== propertyId)
  }

  // Watch for changes in user authenthication
  watch([user, isLoaded], ([newUser, loaded]) => {
    if (newUser && loaded) {
      fetchFavoritesList()
    }
  })

  return {
    favorites,
    loading,
    error,
    fetchFavoritesList,
    removeFavoriteFromList
  }
}