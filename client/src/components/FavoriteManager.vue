<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUser } from 'vue-clerk'
import { fetchFavoriteStatus, addToFavorites, removeFromFavorites } from '@/services/favoritesService'

const props = defineProps<{
  propertyId: string
}>()

const emit = defineEmits(['favoriteToggled'])
const { user, isLoaded } = useUser()
const isFavorite = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

const updateFavoriteStatus = async () => {
  if (!user.value) return
  
  loading.value = true
  error.value = null
  
  try {
    isFavorite.value = await fetchFavoriteStatus(user.value.id, props.propertyId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

const toggleFavorite = async () => {
  if (!user.value) {
    alert('Please sign in to manage favorites')
    return
  }
  
  loading.value = true
  error.value = null
  
  try {
    if (isFavorite.value) {
      await removeFromFavorites(user.value.id, props.propertyId)
    } else {
      await addToFavorites(user.value.id, props.propertyId)
    }
    isFavorite.value = !isFavorite.value
    emit('favoriteToggled', props.propertyId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  if (isLoaded.value && user.value) {
    await updateFavoriteStatus()
  }
})

watch([user, isLoaded], async ([newUser, loaded]) => {
  if (newUser && loaded) {
    await updateFavoriteStatus()
  }
})
</script>

<template>
  <div>
    <button 
      @click="toggleFavorite" 
      :disabled="loading"
      class="favorite-button"
    >
      {{ isFavorite ? 'Remove from Favorites' : 'Add to Favorites' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.favorite-button {
  padding: 8px 16px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
}

.error {
  color: #ff385c;
  font-size: 0.8em;
  margin-top: 4px;
}
</style>