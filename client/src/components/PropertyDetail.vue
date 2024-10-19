<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from 'vue-clerk'
import BookProperty from './BookProperty.vue'
import FavoriteManager from '@/components/FavoriteManager.vue'
import { fetchPropertyById, updatePropertyDates } from '../services/propertyService'

const route = useRoute()
const router = useRouter()
const { user, isLoaded } = useUser()

const property = ref<Property | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)
const checkInDate = ref<string | null>(route.query.checkIn as string || null)
const checkOutDate = ref<string | null>(route.query.checkOut as string || null)
const currentImageIndex = ref(0)

const propertyId = computed(() => route.params.id as string)

const fetchProperty = async () => {
  try {
    property.value = await fetchPropertyById(propertyId.value)
    loading.value = false
  } catch (err) {
    console.error('Error fetching property:', err)
    error.value = 'Failed to fetch property details'
    loading.value = false
  }
}

const updateDates = async (newCheckIn: string, newCheckOut: string) => {
  checkInDate.value = newCheckIn
  checkOutDate.value = newCheckOut
  try {
    await updatePropertyDates(propertyId.value, newCheckIn, newCheckOut)
    router.replace({
      query: {
        ...route.query,
        checkIn: newCheckIn,
        checkOut: newCheckOut
      }
    })
  } catch (err) {
    console.error('Error updating property dates:', err)
    // You might want to show an error message to the user here
  }
}

const nextImage = () => {
  if (property.value?.images) {
    currentImageIndex.value = (currentImageIndex.value + 1) % property.value.images.length
  }
}

const prevImage = () => {
  if (property.value?.images) {
    currentImageIndex.value = (currentImageIndex.value - 1 + property.value.images.length) % property.value.images.length
  }
}

const redirectToBookingPage = () => {
  if (checkInDate.value && checkOutDate.value) {
    router.push({
      name: 'BookingPage',
      query: {
        propertyId: propertyId.value,
        checkIn: checkInDate.value,
        checkOut: checkOutDate.value
      }
    })
  } else {
    alert('Please select check-in and check-out dates before proceeding')
  }
}

const isDateRangeSelected = computed(() => checkInDate.value && checkOutDate.value)

watch(
  () => route.query,
  (query) => {
    checkInDate.value = query.checkIn as string || null
    checkOutDate.value = query.checkOut as string || null
  }
)

onMounted(fetchProperty)
</script>

<template>
  <div class="detail-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="property" class="property-details">
      <h2>{{ property.title }}</h2>
      
      <div v-if="property.images?.length" class="image-carousel">
        <button class="carousel-arrow left" @click="prevImage">&lt;</button>
        <img :src="property.images[currentImageIndex]" :alt="`Property image ${currentImageIndex + 1}`" />
        <button class="carousel-arrow right" @click="nextImage">&gt;</button>
        <div class="carousel-indicator">
          {{ currentImageIndex + 1 }} / {{ property.images.length }}
        </div>
        <div class="favorite-manager-overlay">
          <FavoriteManager 
            :propertyId="property._id" 
            @favoriteToggled="fetchProperty"  
          />
        </div>
      </div>

      <div class="property-info">
        <p><strong>Your host:</strong> {{ property.username || 'Unknown user' }}</p>
        <p>{{ property.rooms }} rooms · {{ property.beds }} beds</p>
        <p>{{ property.description }}</p>
        <p><strong>Price per night:</strong> {{ property.pricePerNight }} kr</p>
        <p><strong>Amenities:</strong> {{ property.amenities.join(', ') }}</p>
      </div>

      <div class="date-selection">
        <h3>Select your dates</h3>
        <BookProperty 
          :propertyId="property._id" 
          :checkIn="checkInDate" 
          :checkOut="checkOutDate"
          @dateChange="updateDates"
        />
      </div>

      <div v-if="isDateRangeSelected" class="booking-summary">
        <p><strong>Selected dates:</strong> {{ checkInDate }} to {{ checkOutDate }}</p>
        <button @click="redirectToBookingPage" class="book-now-btn">Proceed to Booking</button>
      </div>
    </div>
  </div>
</template>


<style scoped>
.detail-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.loading, .error {
  text-align: center;
  margin-top: 50px;
}

.image-carousel {
  position: relative;
  margin-bottom: 20px;
}

.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

.carousel-arrow.left { left: 10px; }
.carousel-arrow.right { right: 10px; }

.carousel-indicator {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px 10px;
}

.favorite-manager-overlay {
  position: absolute;
  top: 10px;
  right: 10px;
}

.property-info, .date-selection, .booking-summary {
  margin-bottom: 20px;
}

.book-now-btn {
  background-color: #0077cc;
  color: white;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
}

.book-now-btn:hover {
  background-color: #005fa3;
}
</style>