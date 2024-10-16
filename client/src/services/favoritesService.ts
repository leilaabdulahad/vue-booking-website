import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

//creating an object to hold methods to interact with favorites API
export const favoritesService = {
  //method to fetch a user's favorite properties by userid
  async fetchFavorites(userId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/favorites/${userId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching favorites:', error)
      throw error
    }
  },

  //method to fetch property details by property id
  async fetchPropertyById(propertyId: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/properties/${propertyId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching property:', error)
      throw error
    }
  }
}
