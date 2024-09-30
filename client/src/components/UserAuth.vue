<script setup lang="ts">
import { watch } from 'vue'
import { useUser } from 'vue-clerk'
import axios from 'axios'

const { isSignedIn, user } = useUser()

watch([isSignedIn, user], async ([newIsSignedIn, newUser]) => {
  if (newIsSignedIn && newUser) {
    try {
      await axios.post('http://localhost:5000/api/users', {
        clerkUserId: newUser.id
      })
      console.log('User synced with database')
    } catch (error) {
      console.error('Error syncing user with database:', error)
    }
  }
}, { immediate: true })
</script>

<template>
</template>