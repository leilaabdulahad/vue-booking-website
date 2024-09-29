<template>
  <div class="create-property">
    <h2>Create a New Property</h2>
    <form @submit.prevent="createProperty">
      <div>
        <label for="title">Title:</label>
        <input id="title" v-model="title" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div>
        <label for="location">Location:</label>
        <input id="location" v-model="location" required />
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
        <label for="amenities">Amenities (comma separated):</label>
        <input id="amenities" v-model="amenities" required />
      </div>
      <button type="submit">Create Property</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from 'vue-clerk'
import axios from 'axios'

const title = ref('')
const description = ref('')
const location = ref('')
const maxGuests = ref(0)
const pricePerNight = ref(0)
const rooms = ref(0)
const amenities = ref('')
const errorMessage = ref<string | null>(null)

const { userId } = useAuth();

const createProperty = async () => {
  try {
    const amenitiesArray = amenities.value.split(',').map(item => item.trim())

    const response = await axios.post('http://localhost:5000/api/properties', {
      title: title.value,
      description: description.value,
      location: location.value,
      maxGuests: maxGuests.value,
      pricePerNight: pricePerNight.value,
      rooms: rooms.value,
      amenities: amenitiesArray,
      clerkUserId: userId.value,
    })

    console.log('Property created:', response.data)
    
    title.value = ''
    description.value = ''
    location.value = ''
    maxGuests.value = 0
    pricePerNight.value = 0
    rooms.value = 0
    amenities.value = ''
    errorMessage.value = null

  } catch (error) {
    console.error('Error creating property:', error)
    errorMessage.value = 'Failed to create property. Please try again.'
  }
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
  background-color: #4CAF50;
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
