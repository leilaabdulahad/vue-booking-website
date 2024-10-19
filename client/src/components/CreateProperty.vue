<script setup lang="ts">
import { ref, watch } from 'vue'
import { SignInButton, useUser } from 'vue-clerk'
import { useUserSync } from '../composables/useUserSync'
import { usePropertyForm } from '../composables/usePropertyForm'

//syncs user with database when signed in
const { isSignedIn, user } = useUserSync()

//inititalizing the propertyform and passing the userid
const {
  title, 
  description, 
  country, 
  city, 
  maxGuests, 
  pricePerNight, 
  rooms, 
  beds, 
  amenities, 
  selectedFiles, 
  errorMessage, 
  handleFileUpload, 
  createProperty
} = usePropertyForm(user.value?.id || '')

</script>


<template>
  <div class="create-property">
    <h2>Create a New Property</h2>
    <div v-if="!isSignedIn">
      <p>Please sign in to create a property.</p>
      <SignInButton />
    </div>
    <form v-else @submit.prevent="createProperty">
      <div>
        <label for="title">Title:</label>
        <input id="title" v-model.trim="title" required />
      </div>
      <div>
        <label for="description">Description:</label>
        <textarea id="description" v-model="description" required></textarea>
      </div>
      <div>
        <label for="country">Country:</label>
        <input id="country" v-model="country" required />
      </div>
      <div>
        <label for="city">City:</label>
        <input id="city" v-model="city" required />
      </div>
      <div>
        <label for="maxGuests">Max Guests:</label>
        <input id="maxGuests" type="number" v-model="maxGuests" required />
      </div>
      <div>
        <label for="pricePerNight">Price Per Night:</label>
        <input id="pricePerNight" type="number" v-model="pricePerNight" required />
      </div>
      <div>
        <label for="rooms">Rooms:</label>
        <input id="rooms" type="number" v-model="rooms" required />
      </div>
      <div>
        <label for="beds">Beds:</label>
        <input id="beds" type="number" v-model="beds" required />
      </div>
      <div>
        <label for="amenities">Amenities (comma separated):</label>
        <input id="amenities" v-model="amenities" required />
      </div>
      <div>
        <label for="images">Images (select up to 10):</label>
        <input 
          type="file" 
          id="images" 
          multiple 
          @change="handleFileUpload" 
          accept="image/*"
        />
      </div>
      <div v-if="selectedFiles.length > 0">
        <p>Selected files:</p>
        <ul>
          <li v-for="(file, index) in selectedFiles" :key="index">
            {{ file.name }}
          </li>
        </ul>
      </div>
      <button type="submit">Create Property</button>
    </form>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
  </div>
</template>

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
  background-color: #6b6b6b;
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