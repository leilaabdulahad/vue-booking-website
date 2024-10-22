<script setup lang="ts">
import { ref } from 'vue'
import debounce from 'lodash/debounce'
const searchQuery = ref('')
const emit = defineEmits(['search'])
const debounceSearch = debounce((event: Event) => {
  const target = event.target as HTMLInputElement
  emit('search', target.value)
}, 300)

</script>

<template>
  <div class="search-container">
    <input
      v-model="searchQuery"
      @input="debounceSearch"
      placeholder="Sök destination"
      type="text"
      class="search-input"
    />
  </div>
</template>

<style scoped>
.search-container {
  position: relative;
  width: 100%;
  max-width: 200px; 
}

.search-input {
  width: 100%;
  padding: 8px 0;
  font-size: 14px;
  border: none;
  outline: none;
  background: transparent;
  color: #222;
}

.search-input::placeholder {
  color: #717171;
}

@media (max-width: 768px) {
  .search-container {
    max-width: 100%;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .search-container {
    max-width: 150px;
  }
}
</style>