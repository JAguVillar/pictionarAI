<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const lists = ref([])
const loading = ref(false)

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + TMDB_API_KEY,
  },
}

async function fetchLists() {
  loading.value = true
  try {
    const res = await fetch('https://api.themoviedb.org/3/account/8317503/lists?page=1', options)
    const data = await res.json()
    console.log(data)
    lists.value = data.results
  } catch (err) {
    console.error('Error cargando películas', err)
  } finally {
    loading.value = false
  }
}

function goToList(id, name) {
  router.push({ name: 'list', params: { listId: id, listName: name } })
}

onMounted(fetchLists)
</script>

<template>
  <main>
    <div class="mb-6">
      <h1 class="text-3xl font-bold">
        {{ route.meta.title }}
      </h1>
      <h2 class="text-xl font-semibold text-gray-600">
        {{ route.meta.subTitle }}
      </h2>
    </div>
    <div
      class="mb-4 cursor-pointer transition-colors duration-200 hover:bg-gray-100"
      v-for="list in lists"
      :key="list.id"
      @click="goToList(list.id, list.name)"
    >
      <div class="bg-white rounded-lg shadow-md border border-gray-200">
        <div class="p-4 font-medium text-lg text-gray-800">
          {{ list.name }}
        </div>
      </div>
    </div>

    <div v-if="loading" class="flex justify-center py-6">
      <svg
        class="animate-spin h-6 w-6 text-indigo-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
    </div>
  </main>
</template>
