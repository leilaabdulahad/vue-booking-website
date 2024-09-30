<script setup lang="ts">
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from 'vue-clerk'
import CreateProperty from './components/CreateProperty.vue'
import PropertyList from './components/PropertyList.vue'
import UserAuth from './components/UserAuth.vue'

const { isLoaded, isSignedIn, user } = useUser()
</script>

<template>
  <div class="app">
    <UserAuth />
    <div v-if="!isLoaded">
      Loading...
    </div>
    <div v-else-if="!isSignedIn">
      Not signed in
    </div>
    <div v-else>
      Hello, {{ user?.fullName || 'User' }}!
    </div>

    <header>
      <h1>Property App</h1>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>

    <main>
      <PropertyList />

      <SignedIn>
        <CreateProperty />
      </SignedIn>

      <SignedOut>
        <p>Please sign in to create posts</p>
      </SignedOut>
    </main>
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}
</style>
