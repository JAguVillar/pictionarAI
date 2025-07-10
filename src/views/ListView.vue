<script setup>
import { ref, onMounted, watch } from 'vue'
import { useInfiniteScroll } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import Item from '@/components/MovieItem.vue'

const router = useRouter()
const route = useRoute()
const movies = ref([])
const page = ref(1)
const totalPages = ref(Infinity) // se actualizará en la primera llamada
const loading = ref(false)
const hasMore = ref(true)
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const scrollTarget = ref(null) // contenedor observable
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + TMDB_API_KEY,
  },
}

async function loadMore() {
  if (loading.value || !hasMore.value) return

  loading.value = true
  console.log(route.params.listId)

  if (route.params.listId) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/list/${route.params.listId}?language=es-MX&page=${page.value}`,
        options,
      )
      const data = await res.json()

      movies.value.push(...data.items)

      // Actualiza paginación
      totalPages.value = data.total_pages
      page.value += 1
      hasMore.value = page.value <= totalPages.value
    } catch (err) {
      console.error('Error cargando películas', err)
      hasMore.value = false
    } finally {
      loading.value = false
    }
  } else {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/top_rated?language=es-MX&page=${page.value}`,
        options,
      )
      const data = await res.json()

      movies.value.push(...data.results)

      // Actualiza paginación
      totalPages.value = data.total_pages
      page.value += 1
      hasMore.value = page.value <= totalPages.value
    } catch (err) {
      console.error('Error cargando películas', err)
      hasMore.value = false
    } finally {
      loading.value = false
    }
  }
}

function goToMovie(id) {
  router.push({ name: 'movie', params: { movieId: id } })
}

useInfiniteScroll(scrollTarget, loadMore, { distance: 200 })

onMounted(loadMore)

watch(
  () => route.params.listId,
  async () => {
    // reiniciar el estado cuando cambia el parámetro
    movies.value = []
    page.value = 1
    totalPages.value = Infinity
    hasMore.value = true
    await loadMore()
  },
)
</script>

<template>
  <main class="main">
    <div class="mb-6">
      <h1 class="text-3xl font-bold">
        {{ route.meta.title }}
      </h1>
      <h2 class="text-xl font-semibold text-gray-600">
        {{ route.params.listName }}
      </h2>
    </div>
    <div ref="scrollTarget" class="h-[90vh] overflow-auto">
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
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
      </div>

      <div v-if="!hasMore && !loading" class="py-6 text-center text-gray-500">
        Nada más para mostrar
      </div>
    </div>
  </main>
</template>
