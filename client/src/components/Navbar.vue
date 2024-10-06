<template>
    <nav class="navbar">
      <div class="navbar-container">
        <router-link to="/" class="navbar-brand">
          Property App
        </router-link>
        <button
          class="navbar-burger"
          @click="toggleMenu"
          :class="{ 'is-active': isMenuActive }"
          aria-label="menu"
          :aria-expanded="isMenuActive"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <div class="navbar-menu" :class="{ 'is-active': isMenuActive }">
          <router-link to="/" class="navbar-item">Home</router-link>
          <router-link to="/properties" class="navbar-item">Properties</router-link>
          <router-link to="/create-property" class="navbar-item">Create Property</router-link>
          <router-link to="/favorites" class="navbar-item">Favorites</router-link>
          <div class="navbar-item auth-buttons">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import { SignedIn, SignedOut, UserButton, SignInButton } from 'vue-clerk';
  
  const isMenuActive = ref(false);
  
  const toggleMenu = () => {
    isMenuActive.value = !isMenuActive.value;
  };
  </script>
  
  <style scoped>
  .navbar {
    background-color: #ffffff;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    padding: 1rem 2rem;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
  }
  
  .navbar-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .navbar-brand {
    font-size: 1.5rem;
    font-weight: 700;
    color: #333;
    text-decoration: none;
    transition: color 0.3s ease;
  }
  
  .navbar-brand:hover {
    color: #9f9f9f;
  }
  
  .navbar-menu {
    display: flex;
    align-items: center;
  }
  
  .navbar-item {
    color: #333;
    text-decoration: none;
    margin: 0 1rem;
    padding: 0.5rem 0;
    position: relative;
    transition: color 0.3s ease;
  }
  
  .navbar-item::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #3c3c3c;
    transition: width 0.3s ease;
  }
  
  .navbar-item:hover {
    color: #404740;
  }
  
  .navbar-item:hover::after {
    width: 100%;
  }
  
  .navbar-burger {
    display: none;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
  }
  
  .navbar-burger span {
    display: block;
    width: 25px;
    height: 3px;
    background-color: #333;
    margin: 5px 0;
    transition: all 0.3s ease;
  }
  
  .navbar-burger.is-active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  
  .navbar-burger.is-active span:nth-child(2) {
    opacity: 0;
  }
  
  .navbar-burger.is-active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
  
  .auth-buttons {
    margin-left: 1rem;
  }
  
  @media (max-width: 768px) {
    .navbar-burger {
      display: block;
    }
  
    .navbar-menu {
      display: none;
      flex-direction: column;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background-color: #ffffff;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1rem;
    }
  
    .navbar-menu.is-active {
      display: flex;
    }
  
    .navbar-item {
      margin: 0.5rem 0;
    }
  
    .auth-buttons {
      margin-left: 0;
      margin-top: 0.5rem;
    }
  }
  </style>