import { onMounted } from 'vue'
import { useAuth } from '@/composables/user/useAuth'
import { useFavoritesList } from '@/composables/favorite/useFavoriteList'

export const useFavoritesListView = () => {
  const { isSignedIn, user, isLoaded } = useAuth()
  
  const {
    favorites,
    loading,
    error,
    fetchFavoritesList,
    removeFavoriteFromList
  } = useFavoritesList()

  const handleFavoriteToggled = (propertyId: string) => {
    removeFavoriteFromList(propertyId)
  }

  onMounted(() => {
    if (isLoaded.value && user.value) {
      fetchFavoritesList()
    }
  })

  return {
    isSignedIn,
    favorites,
    loading,
    error,
    handleFavoriteToggled
  }
}