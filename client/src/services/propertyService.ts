import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

//function to create a new property
export const createNewProperty = async (formData: FormData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/properties`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    console.log('Property created:', response.data)
    return response.data
  } catch (error) {
    console.error('Error creating property:', error)
    throw error
  }
}
