<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'


const properties = ref<Property[]>([])

const fetchProperties = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/properties')
    properties.value = response.data
  } catch (error) {
    console.error('Error fetching properties:', error)
  }
}

onMounted(fetchProperties)
</script>

<template>
  <div class="property-list">
    <h2>Recent Properties</h2>
    <ul>
      <li v-for="property in properties" :key="property._id" class="property-item">
        <h3>{{ property.title }}</h3>
        <p>{{ property.description }}</p>
        <p><strong>Location:</strong> {{ property.location }}</p>
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
</style>