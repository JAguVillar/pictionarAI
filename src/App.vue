<script setup>
import { RouterView } from 'vue-router'
import BackIcon from '@/components/icons/BackIcon.vue'
import BottomNav from './components/BottomNav.vue'

import '@fontsource/dm-sans/100.css'
import '@fontsource/dm-sans/200.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import '@fontsource/dm-sans/800.css'
import '@fontsource/dm-sans/900.css'
</script>

<template>
  <header
    class="h-14 p-4 w-full absolute"
    :class="
      $route.meta.absolute
        ? 'bg-linear-to-b dark:from-black to-transparent bg-transparent'
        : 'bg-transparent'
    "
  >
    <back-icon
      v-if="$route.meta.showBack"
      class="cursor-pointer size-6"
      @click="$router.back()"
    ></back-icon>
    <div v-else>
      <h1 class="font-semibold text-xl">
        Dígalo con Mimic<span
          class="bg-linear-to-bl from-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-black text-2xl"
          >AI</span
        >
      </h1>
    </div>
  </header>
  <RouterView />
  <BottomNav />
</template>

<style scoped>
@media (min-width: 1024px) {
}
</style>
