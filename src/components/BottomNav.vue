<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const currentPath = computed(() => route.name)
const routes = router.getRoutes().filter((r) => r.meta?.show)
</script>

<template>
  <nav
    class="fixed bottom-5 left-1/2 -translate-x-1/2 bg-white border-t border-gray-200 drop-shadow-red-600 p-2 flex justify-around items-center z-50 rounded-full w-[calc(100%-2rem)] max-w-[440px]"
  >
    <button
      v-for="route in routes"
      :key="route.name"
      class="p-3 rounded-full hover:bg-gray-100 transition-colors duration-300"
      :class="{
        'bg-rose-500 text-white': currentPath === route.name,
        'bg-gray-200 text-black': currentPath !== route.name,
      }"
      @click="router.push({ name: route.name })"
    >
      <component :is="route.meta.icon" class="size-8" />
    </button>
  </nav>
</template>
