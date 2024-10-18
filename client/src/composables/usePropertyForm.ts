import { ref } from 'vue'
import { createNewProperty } from '../services/propertyService'

//handles the form state, file upload logic, property creation functionality 
export const usePropertyForm = (userId: string) => {
    const title = ref('')
  const description = ref('')
  const country = ref('')
  const city = ref('')
  const maxGuests = ref(0)
  const pricePerNight = ref(0)
  const rooms = ref(0)
  const beds = ref(0)
  const amenities = ref('')
  const errorMessage = ref<string | null>(null)
  const selectedFiles = ref<File[]>([])

  //handles file upload and limits selection to 10 files
  const handleFileUpload =(event: Event) => {
    const target = event.target as HTMLInputElement
    if (target.files) {
        selectedFiles.value = Array.from(target.files).slice(0, 10)
    }
  }

  //create new property by sending form data to server
  const createProperty = async () => {
    try {
        const formData = new FormData()
        formData.append('title', title.value)
      formData.append('description', description.value)
      formData.append('country', country.value)
      formData.append('city', city.value)
      formData.append('maxGuests', maxGuests.value.toString())
      formData.append('pricePerNight', pricePerNight.value.toString())
      formData.append('rooms', rooms.value.toString())
      formData.append('beds', beds.value.toString())
      formData.append('amenities', amenities.value)
      formData.append('clerkUserId', userId)

      //append imgs
      selectedFiles.value.forEach((file) => {
        formData.append('images', file)
      })

      await createNewProperty(formData)

    resetForm()
    } catch (error) {
        console.error('Error creating property:', error)
        errorMessage.value = 'Failed to create property. Try again'
    }
  }

  const resetForm = () => {
    title.value = ''
    description.value = ''
    country.value = ''
    city.value = ''
    maxGuests.value = 0
    pricePerNight.value = 0
    rooms.value = 0
    beds.value = 0
    amenities.value = ''
    selectedFiles.value = []
    errorMessage.value = null
  }

  return {
    title,
    description,
    country,
    city,
    maxGuests,
    pricePerNight,
    rooms,
    beds,
    amenities,
    selectedFiles,
    errorMessage,
    handleFileUpload,
    createProperty,
    resetForm
  }
}