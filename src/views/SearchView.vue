<script setup>
import { ref, watch } from 'vue'
import { useDebounce, useInfiniteScroll } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import Item from '@/components/MovieItem.vue'

const loading = ref(false)
const searchText = ref('')
const debouncedSearch = useDebounce(searchText, 500)
const movies = ref([])
const page = ref(1)
const totalPages = ref(Infinity)
const hasMore = ref(true)
const scrollTarget = ref(null)
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const router = useRouter()
const route = useRoute()

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + TMDB_API_KEY,
  },
}

async function fetchMovies() {
  if (loading.value || !hasMore.value) return

  loading.value = true

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${debouncedSearch.value}&include_adult=false&language=es-MX&page=${page.value}`,
      options,
    )
    const data = await response.json()

    if (page.value === 1) {
      movies.value = data.results
    } else {
      movies.value.push(...data.results)
    }

    totalPages.value = data.total_pages
    hasMore.value = page.value < totalPages.value
    page.value += 1
  } catch (error) {
    console.error('Error fetching movies:', error)
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

watch(debouncedSearch, (value) => {
  if (value.length >= 3 && value.trim()) {
    page.value = 1
    hasMore.value = true
    fetchMovies()
  } else if (value.length === 0) {
    movies.value = []
  }
})

function goToMovie(id) {
  router.push({ name: 'movie', params: { movieId: id } })
}

useInfiniteScroll(scrollTarget, fetchMovies, { distance: 200 })
</script>

<template>
  <main ref="scrollTarget" class="h-[90vh] overflow-auto px-4 main">
    <div class="mb-6">
      <h1 class="text-3xl font-bold mb-6">
        {{ route.meta.title }}
      </h1>
      <input
        v-model="searchText"
        type="text"
        placeholder="Escribe algo..."
        class="w-full h-full px-4 py-4 border-2 border-gray-300 rounded-full text-2xl font-bold"
      />
      <h2
        class="text-xl font-semibold text-gray-600 mt-6"
        v-if="debouncedSearch && movies.length > 0"
      >
        Mostrando resultados para "{{ debouncedSearch }}"
      </h2>
    </div>
    <div class="grid grid-cols-3 sm:grid-cols-3 gap-x-4 gap-y-6">
      <div
        v-for="movie in movies"
        :key="movie.id"
        class="transition duration-200 hover:scale-[1.02] hover:shadow-xl"
      >
        <Item
          @click="goToMovie(movie.id)"
          :title="movie.title"
          :poster="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        />
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

    <div v-if="!hasMore && !loading && movies.length > 0" class="py-6 text-center text-gray-500">
      No hay más resultados
    </div>
  </main>
</template>
