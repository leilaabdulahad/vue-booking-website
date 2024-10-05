<template>
    <div>
      <select v-model="selectedCountry" @change="fetchCities">
        <option value="" disabled>Select Country</option>
        <option v-for="country in countries" :key="country" :value="country">{{ country }}</option>
      </select>
      <select v-model="selectedCity" v-if="cities.length > 0">
        <option value="" disabled>Select City</option>
        <option v-for="city in cities" :key="city" :value="city">{{ city }}</option>
      </select>
      <button @click="filterProperties">Filter</button>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const countries = ['Sverige', 'England', 'Spanien', 'Tyskland']
  const countryCity: CountryCity = {
    Sverige: ['Stockholm', 'Borås'],
    England: ['London'],
    Spanien: ['Barcelona'],
    Tyskland: ['Berlin'],
  }
  
  const selectedCountry = ref<string>('')
  const selectedCity = ref<string>('')
  const cities = ref<string[]>([])
  
  const fetchCities = () => {
    cities.value = countryCity[selectedCountry.value] || []
    selectedCity.value = ''
  }
  
  const emit = defineEmits(['filter']);
  
  const filterProperties = () => {
    emit('filter', { country: selectedCountry.value, city: selectedCity.value })
  }
  </script>