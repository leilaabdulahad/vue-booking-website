import axios from 'axios'

//function to create a new property
export const createNewProperty = async (formData: FormData) => {
  try {
    const response = await axios.post('http://localhost:5000/api/properties', formData, {
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
