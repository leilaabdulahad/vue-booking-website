<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'

interface Property {
  _id: string
  title: string
  description: string
  location: string
  maxGuests: number
  pricePerNight: number
  rooms: number
  amenities: string[]
  username: string
  createdAt: string
  images: string[]
}

const properties = ref<Property[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

const fetchProperties = async () => {
  try {
    loading.value = true
    const response = await axios.get<Property[]>('http://localhost:5000/api/properties')
    properties.value = response.data
    loading.value = false
  } catch (err) {
    console.error('Error fetching properties:', err)
    if (axios.isAxiosError(err)) {
      error.value = `Error fetching properties: ${err.message}. ${err.response?.data?.message || ''}`
    } else {
      error.value = 'An unexpected error occurred while fetching properties'
    }
    loading.value = false
  }
}

onMounted(fetchProperties)
</script>

<template>
  <div class="property-list">
    <h2>Recent Properties</h2>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else-if="properties.length === 0">No properties available</div>
    <ul v-else>
      <li v-for="property in properties" :key="property._id" class="property-item">
        <h3>{{ property.title }}</h3>
        <div class="image-gallery" v-if="property.images && property.images.length > 0">
          <img v-for="(image, index) in property.images" :key="index" :src="image" :alt="`Property image ${index + 1}`" />
        </div>
        <p>{{ property.description }}</p>
        <p><strong>Location:</strong> {{ property.location }}</p>
        <p><strong>Max Guests:</strong> {{ property.maxGuests }}</p>
        <p><strong>Price Per Night:</strong> ${{ property.pricePerNight }}</p>
        <p><strong>Rooms:</strong> {{ property.rooms }}</p>
        <p><strong>Amenities:</strong> {{ property.amenities.join(', ') }}</p>
        <p><strong>Posted by:</strong> {{ property.username || 'Unknown user' }}</p>
        <p><small>Posted on: {{ new Date(property.createdAt).toLocaleString() }}</small></p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.property-list {
  max-width: 800px;
  margin: 0 auto;
}
.property-item {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-bottom: 1rem;
  list-style-type: none;
}
h3 {
  margin-top: 0;
}
.image-gallery {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 1rem;
}
.image-gallery img {
  width: 150px;
  height: 150px;
  object-fit: cover;
}
</style>