import axios from 'axios'
import { property } from 'lodash'

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

//function to fetch a property by its id
export const fetchPropertyById = async (propertyId: string) => {
  try {
    const response = await axios.get (`${API_BASE_URL}/api/properties/${propertyId}`)
    return response.data
  } catch (error) {
    console.error(`Èrror fetching property with ID ${propertyId}:`, error)
    throw error
  }
}

//function to update the checkin and checkout dates of a property
export const updatePropertyDates = async (propertyId: string, checkInDate: string, checkOutDate: string) => {
  try {
    const response = await axios.patch(`${API_BASE_URL}/api/properties/${propertyId}`, {
      checkInDate,
      checkOutDate
    })
    return response.data
  } catch (error) {
    console.error('Error updating property dates:', error)
    throw error
  }
}

export const fetchProperties = async (): Promise<Property[]> => {
  try {
    const response = await axios.get<Property[]>('http://localhost:5000/api/properties')
    return response.data
  } catch (err) {
    if (err instanceof Error) {
      console.error('Error fetching properties:', err.message)
      throw new Error(err.message)
    } else {
      console.error('Unknown error fetching properties:', err)
      throw new Error('An unknown error occurred while fetching properties.')
    }
  }
}