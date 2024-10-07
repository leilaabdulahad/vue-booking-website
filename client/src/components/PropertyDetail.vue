<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import { useRoute } from 'vue-router'
  import axios from 'axios'
  
  const route = useRoute()
  const property = ref<Property | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)
  
  const fetchProperty = async () => {
    const propertyId = route.params.id
    try {
      const response = await axios.get<Property>(`http://localhost:5000/api/properties/${propertyId}`)
      property.value = response.data
    } catch (err) {
      console.error('Error fetching property:', err)
      if (axios.isAxiosError(err)) {
        error.value = `Error fetching property: ${err.message}. ${err.response?.data?.message || ''}`
      } else {
        error.value = 'An unexpected error occurred while fetching the property'
      }
    } finally {
      loading.value = false
    }
  }
  
  onMounted(fetchProperty)
  </script>
  
  <template>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
      <h2>{{ property?.title }}</h2>
      <div class="image-gallery" v-if="property?.images && property.images.length > 0">
        <img v-for="(image, index) in property.images" :key="index" :src="image" :alt="`Property image ${index + 1}`" />
      </div>
      <p>{{ property?.description }}</p>
      <p><strong>City:</strong> {{ property?.location.city }}</p>
      <p><strong>Country:</strong> {{ property?.location.country }}</p>
      <p><strong>Max Guests:</strong> {{ property?.maxGuests }}</p>
      <p><strong>Price Per Night:</strong> ${{ property?.pricePerNight }}</p>
      <p><strong>Rooms:</strong> {{ property?.rooms }}</p>
      <p><strong>Beds:</strong> {{ property?.beds }}</p>
      <p><strong>Amenities:</strong> {{ property?.amenities.join(', ') }}</p>
      <p><strong>Posted by:</strong> {{ property?.username || 'Unknown user' }}</p>
      <p><small>Posted on: {{ property ? new Date(property.createdAt).toLocaleString() : '' }}</small></p>
    </div>
</template>

  <style scoped>
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
  