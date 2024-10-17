import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

//function to fetch the favorite status of a property for a user
export const fetchFavoriteStatus = async (userId: string, propertyId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites/${userId}`)
    return response.data.some((fav: { propertyId: string }) => fav.propertyId === propertyId)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching favorites:', error.response?.data || error.message)
      throw new Error(`Failed to fetch favorites: ${error.response?.data?.message || error.message}`)
    } else {
      console.error('Unpected error:', error)
      throw new Error('An unexpected error occurred while fetching favorites')
    }
  }
}

//function to add a property to a users favorites
export const addToFavorites = async (userId: string, propertyId: string) => {
  try {
    await axios.post(`${API_BASE_URL}/api/favorites`, {
      clerkUserId: userId,
      propertyId,
    })
  } catch (error) {
    console.error('Error adding to favorites:', error)
    throw new Error('Failed to add to favorites')
  }
}

//function to remove a property from a users favorites
export const removeFromFavorites = async(userId: string, propertyId: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/favorites/${userId}/${propertyId}`)
  } catch (error) {
    console.error('Error removing from favorites:', error)
    throw new Error('Failed to remove from favorites')
  }
}