import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

//function to sync user with the database
export const syncUserWithDatabase = async (clerkUserId: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/users`, {
      clerkUserId,
    })
    console.log('User synced with the database:', response.data)
  } catch (error) {
    console.error('Error syncing user with the database:', error)
    throw error;
  }
}
