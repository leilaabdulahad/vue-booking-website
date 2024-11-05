<script setup lang="ts">
import { SignInButton, useUser } from 'vue-clerk'
import { useUserSync } from '../composables/useUserSync'
import { usePropertyForm } from '../composables/usePropertyForm'

const { isSignedIn, user } = useUserSync()
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
    <h2 class="title">Publicera boende</h2>
    
    <div v-if="!isSignedIn" class="signin-container">
      <p>Please sign in to create a property.</p>
      <SignInButton />
    </div>

    <form v-else @submit.prevent="createProperty" class="property-form">
      <div class="form-group">
        <label for="title">Titel</label>
        <input id="title" v-model.trim="title" required class="form-input"  />
      </div>

      <div class="form-group">
        <label for="description">Beskrivning</label>
        <textarea 
          id="description" 
          v-model="description" 
          required 
          class="form-textarea"
          rows="4"
        ></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="country">Land</label>
          <input id="country" v-model="country" required class="form-input"  />
        </div>
        <div class="form-group">
          <label for="city">Stad</label>
          <input id="city" v-model="city" required class="form-input" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="maxGuests">Max antal gäster</label>
          <input id="maxGuests" type="number" v-model="maxGuests" required class="form-input" min="1" />
        </div>
        <div class="form-group">
          <label for="pricePerNight">Pris per natt</label>
            <input id="pricePerNight" type="number" v-model="pricePerNight" required class="form-input" min="0" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="rooms">Rum</label>
          <input id="rooms" type="number" v-model="rooms" required class="form-input" min="1" />
        </div>
        <div class="form-group">
          <label for="beds">Sängar</label>
          <input id="beds" type="number" v-model="beds" required class="form-input" min="1" />
        </div>
      </div>

      <div class="form-group">
        <label for="amenities">Bekvämligheter</label>
        <input 
          id="amenities" 
          v-model="amenities" 
          required 
          class="form-input"
          placeholder="Wifi, Parkering, Pool, m.m." 
        />
      </div>

      <div class="form-group">
        <label for="images">Välj bilder (Max 10 bilder)</label>
        <div class="file-upload">
          <input
            type="file"
            id="images"
            multiple
            @change="handleFileUpload"
            accept="image/*"
            class="form-input-file"
          />
        </div>
      </div>

      <div v-if="selectedFiles.length > 0" class="selected-files">
        <p class="files-heading">Välj bilder</p>
        <ul class="files-list">
          <li v-for="(file, index) in selectedFiles" :key="index">
            {{ file.name }}
          </li>
        </ul>
      </div>

      <button type="submit" class="submit-button">Publicera</button>
    </form>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
  </div>
</template>

<style scoped>
.create-property {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  margin-bottom: 2rem;
  text-align: center;
}

.signin-container {
  text-align: center;
  padding: 2rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.property-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

label {
  font-weight: 600;
  color: #4a5568;
  font-size: 0.9rem;
}

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s;
  background-color: #fff;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.2);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.price-input .form-input {
  padding-left: 1.75rem;
}

.file-upload {
  border: 2px dashed #e2e8f0;
  border-radius: 6px;
  padding: 1rem;
  text-align: center;
  background-color: #f8fafc;
}

.form-input-file {
  width: 100%;
  cursor: pointer;
}

.selected-files {
  background-color: #f8fafc;
  padding: 1rem;
  border-radius: 6px;
}

.files-heading {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.files-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.files-list li {
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
}

.files-list li:last-child {
  border-bottom: none;
}

.submit-button {
  background-color: #1E3E62;
  color: white;
  padding: 1rem;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
  margin: 1rem auto 0; 
  max-width: 200px; 
  width: 100%; 
  display: block;
}

.submit-button:hover {
  background-color: #1E3E62;
}

.submit-button:active {
  background-color: #1E3E62;
}

.error-message {
  color: #e53e3e;
  background-color: #fff5f5;
  padding: 1rem;
  border-radius: 6px;
  margin-top: 1rem;
  border: 1px solid #feb2b2;
}

@media (max-width: 768px) {
  .create-property {
    padding: 1rem;
    margin: 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .title {
    font-size: 1.5rem;
  }
}
</style>