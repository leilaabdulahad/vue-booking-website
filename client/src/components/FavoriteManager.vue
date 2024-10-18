<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUser } from 'vue-clerk'
import { fetchFavoriteStatus, addToFavorites, removeFromFavorites } from '@/services/favoritesService'
import { useFavorite } from '../composables/useFavorite'

const props = defineProps<{
  propertyId: string
}>()

const emit = defineEmits(['favoriteToggled'])

const {isFavorite, loading, error, toggleFavorite } = useFavorite(props.propertyId, emit)
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