<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useUser } from 'vue-clerk'
import { fetchFavoriteStatus, addToFavorites, removeFromFavorites } from '@/services/favoritesService'
import { useFavorite } from '@/composables/favorite/useFavorite'

const props = defineProps<{
  propertyId: string
}>()
const emit = defineEmits(['favoriteToggled'])
const { isFavorite, loading, error, toggleFavorite } = useFavorite(props.propertyId, emit)
</script>

<template>
  <div>
    <button
      @click="toggleFavorite"
      :disabled="loading"
      class="favorite-button"
      :class="{ 'is-favorite': isFavorite }"
      :aria-label="isFavorite ? 'Remove from Favorites' : 'Add to Favorites'"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :fill="isFavorite ? '#ff385c' : 'white'"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="heart-icon"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<style scoped>
.favorite-button {
  padding: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
}

.heart-icon {
  width: 24px;
  height: 24px;
  transition: all 0.2s;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
}

.favorite-button:hover .heart-icon {
  transform: scale(1.1);
}

.error {
  color: #ff385c;
  font-size: 0.8em;
  margin-top: 4px;
}
</style>