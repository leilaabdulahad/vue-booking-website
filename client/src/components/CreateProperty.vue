<template>
  <div class="create-property">
    <h2>Create a New Property</h2>
    <form @submit.prevent="createProperty">
      <div>
        <label for="title">Title:</label>
        <input id="title" v-model="title" required>
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div>
        <label for="location">Location:</label>
        <input id="location" v-model="location" required>
      </div>
      <button type="submit">Create Property</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from 'vue-clerk';
import axios from 'axios';

const title = ref('');
const description = ref('');
const location = ref('');
const { userId } = useAuth();

const createProperty = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/properties', {
      title: title.value,
      description: description.value,
      location: location.value,
      clerkUserId: userId.value,
    });
    console.log('Property created:', response.data);
    // Reset form fields
    title.value = '';
    description.value = '';
    location.value = '';
    // You might want to emit an event here to notify the parent component
  } catch (error) {
    console.error('Error creating property:', error);
  }
};
</script>

<style scoped>
.create-property {
  max-width: 500px;
  margin: 0 auto;
}
form div {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.5rem;
}
input, textarea {
  width: 100%;
  padding: 0.5rem;
}
button {
  background-color: #4CAF50;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  cursor: pointer;
}
.error-message {
  color: red;
  margin-top: 1rem;
}
</style>