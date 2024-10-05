<template>
  <div>
    <input 
      v-model="searchQuery" 
      @input="debounceSearch"
      placeholder="Search for a country or city..."
      type="text"
    />
  </div>
</template>

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

<style scoped>
input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>