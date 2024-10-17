import axios from 'axios'

//function to sync user with the database
export const syncUserWithDatabase = async (clerkUserId: string) => {
  try {
    const response = await axios.post('http://localhost:5000/api/users', {
      clerkUserId,
    })
    console.log('User synced with the database:', response.data)
  } catch (error) {
    console.error('Error syncing user with the database:', error)
    throw error;
  }
}
