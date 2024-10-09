<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'
import { useUser } from 'vue-clerk'

const props = defineProps<{
  propertyId: string
}>()

const emit = defineEmits(['favoriteToggled'])

const { user, isLoaded } = useUser()
const isFavorite = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const fetchFavoriteStatus = async () => {
  if (!user.value) return
  loading.value = true
  error.value = null
  try {
    const response = await axios.get(`${API_BASE_URL}/api/favorites/${user.value.id}`)
    isFavorite.value = response.data.some((fav: { propertyId: string }) => fav.propertyId === props.propertyId)
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error('Error fetching favorites:', err.response?.data || err.message)
      error.value = `Failed to fetch favorites: ${err.response?.data?.message || err.message}`
    } else {
      console.error('Unexpected error:', err)
      error.value = 'An unexpected error occurred'
    }
  } finally {
    loading.value = false
  }
}

const toggleFavorite = async () => {
  if (!user.value) {
    alert('Please sign in to manage favorites.')
    return
  }
  loading.value = true
  error.value = null
  try {
    if (isFavorite.value) {
      await removeFromFavorites()
    } else {
      await addToFavorites()
    }
    isFavorite.value = !isFavorite.value
    emit('favoriteToggled', props.propertyId)
  } catch (err) {
    console.error('Error toggling favorite:', err)
    if (axios.isAxiosError(err)) {
      error.value = `Failed to update favorite: ${err.response?.data?.message || err.message}`
    } else {
      error.value = 'An unexpected error occurred while updating favorite'
    }
  } finally {
    loading.value = false
  }
}

const addToFavorites = async () => {
  await axios.post(`${API_BASE_URL}/api/favorites`, {
    clerkUserId: user.value!.id,
    propertyId: props.propertyId,
  })
}

const removeFromFavorites = async () => {
  await axios.delete(`${API_BASE_URL}/api/favorites/${user.value!.id}/${props.propertyId}`)
}

onMounted(async () => {
  if (isLoaded.value && user.value) {
    await fetchFavoriteStatus()
  }
})

watch([user, isLoaded], async ([newUser, loaded]) => {
  if (newUser && loaded) {
    await fetchFavoriteStatus()
  }
})
</script>

<template>
  <div>
    <button @click="toggleFavorite" :disabled="loading">
      {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.error {
  color: red;
  font-size: 0.8em;
}
</style>