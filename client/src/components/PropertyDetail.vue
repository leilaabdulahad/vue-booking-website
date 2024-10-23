<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUser } from 'vue-clerk'
import PropertyHeader from './PropertyHeader.vue'
import ImageCarousel from './ImageCarousel.vue'
import HostSection from './HostSection.vue'
import AmenitiesSection from './AmenitiesSection.vue'
import BookingSidebar from './BookingSidebar.vue'
import { fetchPropertyById } from '../services/propertyService'

const route = useRoute()
const router = useRouter()
const { user, isLoaded } = useUser()

const property = ref<Property | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

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

onMounted(fetchProperty)
</script>

<template>
  <div class="detail-container">
    <div v-if="loading" class="loading">Loading...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="property" class="property-content">
      <PropertyHeader 
        :title="property.title" 
        :rating="property.rating" 
      />
      
      <ImageCarousel :images="property.images" variant="detail" />

      <div class="content-wrapper">
        <div class="main-content">
          <HostSection 
            :username="property.username" 
            :rooms="property.rooms"
            :beds="property.beds"
          />
          
          <div class="description-section">
            <p>{{ property.description }}</p>
          </div>

          <AmenitiesSection :amenities="property.amenities" />
        </div>

        <BookingSidebar 
          :property="property"
          :propertyId="propertyId"
        />
      </div>
    </div>
  </div>
</template>
<style scoped>
.detail-container {
  max-width: 1120px;
  margin: 50px;
  padding: 24px;
  font-family: sans-serif;
}
.content-wrapper {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 80px;
}

.description-section {
  padding: 32px 0;
  line-height: 1.5;
  color: #222222;
}


@media (max-width: 1000px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

@media (max-width: 744px) {
  .detail-container {
    padding: 16px;
  }
}
</style>