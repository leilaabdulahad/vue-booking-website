<template>
    <div class="sign-in-container">
        <SignIn path="/sign-in" />
    </div>
</template>

<script setup lang="ts">
import { SignIn } from 'vue-clerk'
</script>

<style>
.sign-in-container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>