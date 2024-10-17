import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

//fetches all favorites for the user
export const fetchFavorites = async (userId: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites/${userId}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching favorites:', error.response?.data || error.message)
      throw new Error(`Failed to fetch favorites: ${error.response?.data?.message || error.message}`)
    } else {
      console.error('Unexpected error:', error)
      throw new Error('An unexpected error occurred while fetching favorites')
    }
  }
}

//checks if property is in users favorites
export const fetchFavoriteStatus = async (userId: string, propertyId: string) => {
  try {
    const favorites = await fetchFavorites(userId);
    return favorites.some((fav: { propertyId: string }) => fav.propertyId === propertyId)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching favorite status:', error.response?.data || error.message)
      throw new Error(`Failed to fetch favorite status: ${error.response?.data?.message || error.message}`)
    } else {
      console.error('Unexpected error:', error)
      throw new Error('An unexpected error occurred while fetching favorite status')
    }
  }
}

//adds a property to favorites
export const addToFavorites = async (userId: string, propertyId: string) => {
  try {
    await axios.post(`${API_BASE_URL}/api/favorites`, {
      clerkUserId: userId,
      propertyId,
    });
  } catch (error) {
    console.error('Error adding to favorites:', error)
    throw new Error('Failed to add to favorites')
  }
}

//removes property from favorites
export const removeFromFavorites = async (userId: string, propertyId: string) => {
  try {
    await axios.delete(`${API_BASE_URL}/api/favorites/${userId}/${propertyId}`)
  } catch (error) {
    console.error('Error removing from favorites:', error)
    throw new Error('Failed to remove from favorites')
  }
}

//fetches a property by its id
export const fetchPropertyById = async (propertyId: string): Promise<Property> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/properties/${propertyId}`)
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching property:', error.response?.data || error.message);
      throw new Error(`Failed to fetch property: ${error.response?.data?.message || error.message}`)
    } else {
      console.error('Unexpected error:', error)
      throw new Error('An unexpected error occurred while fetching property')
    }
  }
}