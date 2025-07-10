<script setup>
import SearchIcon from '@/components/icons/SearchIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'
</script>

<template>
  <div>
    <header class="h-14 p-4 w-full flex items-center justify-between">
      <button
        class="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium"
      >
        <list-icon
          class="cursor-pointer text-white size-6"
          @click="$router.push({ name: 'lists' })"
        ></list-icon>
        Listas
      </button>

      <search-icon
        class="cursor-pointer text-white size-6"
        @click="$router.push({ name: 'search' })"
      ></search-icon>
    </header>
    <main>
      <router-view />
    </main>
  </div>
</template>
