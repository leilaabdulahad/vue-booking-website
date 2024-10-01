<template>
  <div class="create-property">
    <h2>Create a New Property</h2>
    <div v-if="!isSignedIn">
      <p>Please sign in to create a property.</p>
      <SignInButton />
    </div>
    <form v-else @submit.prevent="createProperty">
      <div>
        <label for="title">Title:</label>
        <input id="title" v-model="title" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div>
        <label for="country">Country:</label>
        <input id="country" v-model="country" required />
      </div>
      <div>
        <label for="city">City:</label>
        <input id="city" v-model="city" required />
      </div>
      <div>
        <label for="maxGuests">Max Guests:</label>
        <input id="maxGuests" type="number" v-model="maxGuests" required />
      </div>
      <div>
        <label for="pricePerNight">Price Per Night:</label>
        <input id="pricePerNight" type="number" v-model="pricePerNight" required />
      </div>
      <div>
        <label for="rooms">Rooms:</label>
        <input id="rooms" type="number" v-model="rooms" required />
      </div>
      <div>
        <label for="beds">Beds:</label>
        <input id="beds" type="number" v-model="beds" required />
      </div>
      <div>
        <label for="amenities">Amenities (comma separated):</label>
        <input id="amenities" v-model="amenities" required />
      </div>
      <div>
        <label for="images">Images (select up to 10):</label>
        <input 
          type="file" 
          id="images" 
          multiple 
          @change="handleFileUpload" 
          accept="image/*"
        />
      </div>
      <div v-if="selectedFiles.length > 0">
        <p>Selected files:</p>
        <ul>
          <li v-for="(file, index) in selectedFiles" :key="index">
            {{ file.name }}
          </li>
        </ul>
      </div>
      <button type="submit">Create Property</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { SignInButton, useUser } from 'vue-clerk'
import axios from 'axios'

const title = ref('')
const description = ref('')
const country = ref('')  // New country field
const city = ref('')     // New city field
const maxGuests = ref(0)
const pricePerNight = ref(0)
const rooms = ref(0)
const beds = ref(0)
const amenities = ref('')
const errorMessage = ref<string | null>(null)
const selectedFiles = ref<File[]>([])

const { isSignedIn, user } = useUser()

watch([isSignedIn, user], async ([newIsSignedIn, newUser]) => {
  if (newIsSignedIn && newUser) {
    try {
      await axios.post('http://localhost:5000/api/users', {
        clerkUserId: newUser.id
      })
      console.log('User synced with database')
    } catch (error) {
      console.error('Error syncing user with database:', error)
    }
  }
}, { immediate: true })

const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files) {
    selectedFiles.value = Array.from(target.files).slice(0, 10) 
  }
}

const createProperty = async () => {
  if (!isSignedIn.value || !user.value) {
    errorMessage.value = 'You must be signed in to create a property.'
    return
  }

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
    formData.append('clerkUserId', user.value.id)

    selectedFiles.value.forEach((file) => {
      formData.append('images', file)
    })

    const response = await axios.post('http://localhost:5000/api/properties', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    console.log('Property created:', response.data)
    resetForm()
  } catch (error) {
    console.error('Error creating property:', error)
    errorMessage.value = 'Failed to create property. Please try again.'
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
</script>


<style scoped>
.create-property {
  max-width: 500px;
  margin: 0 auto;
}

form div {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
}

input, textarea {
  width: 100%;
  padding: 0.5rem;
}

button {
  background-color: #6b6b6b;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}

.error-message {
  color: red;
  margin-top: 1rem;
}
</style>