<script setup>
import BackIcon from '@/components/icons/BackIcon.vue'
</script>

<template>
  <div>
    <header
      class="h-14 p-4 w-full bg-linear-to-b from-black to-transparent"
      :class="$route.meta.absolute ? 'absolute' : ''"
    >
      <back-icon class="cursor-pointer text-white size-6" @click="$router.back()"></back-icon>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
