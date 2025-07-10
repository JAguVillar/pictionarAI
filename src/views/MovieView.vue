<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { GoogleGenAI } from '@google/genai'
// import LoattieLoader from '@/components/LoattieLoader.vue'
// import animationData from '@/assets/animations/loader.json'
import PosterIcon from '@/components/icons/PosterIcon.vue'
import CloseIcon from '@/components/icons/CloseIcon.vue'
import AIIcon from '@/components/icons/AIIcon.vue'

const route = useRoute()
const movie = ref(null)
const suggestions = ref(null)
const currentLanguage = ref('ES')
const showPoster = ref(false)
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
})
const loading = ref(false)
const loadingAI = ref(false)
const AIButtonDisabled = ref(false)
const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: 'Bearer ' + TMDB_API_KEY,
  },
}

async function fetchMovie() {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${route.params.movieId}?language=es-MX`,
      options,
    )
    const data = await response.json()
    movie.value = data // aquí asignas el array de películas
  } catch (error) {
    console.error('Error fetching movies:', error)
  }
}

async function fetchAI() {
  loadingAI.value = true
  AIButtonDisabled.value = true
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents:
      'Estoy jugando un juego de "Dígalo con Mímica" cuya temática es películas y series. El juego funciona así: A un integrante del equipo se le asigna una película o serie, y debe representarla a través de mímica. El resto del equipo debe adivinar de cuál se trata. La mímica no puede ser literal ni demasiado obvia. Por ejemplo, si me toca Interestelar, no está permitido simplemente señalar al cielo. En cambio, la representación debe basarse en acciones, escenas específicas o comportamientos de los personajes dentro de la película o serie. El objetivo es que la mímica evoque momentos icónicos o reconocibles de la obra, sin revelar el nombre directamente ni hacer gestos genéricos (como señalar estrellas, hacer forma de TV, etc.). Teniendo en cuenta este contexto y estas reglas, dame como minimo 5 ejemplos de posibles mímicas para la siguiente película/serie: ' +
      movie.value.title,
    config: {
      responseMimeType: 'application/json',
      systemInstruction:
        'Dime los ejemplos lo mas resumido posible. Y devuelve un json, donde cada objeto tenga un id, empezando de 1 a n elementyos y un nombre con el string de cada ejemplos. Sin formateo adicional ni explicaciones. Intenta utilizar un acento argentino o español neutro.',
    },
  })
  console.log(response.text)
  suggestions.value = JSON.parse(response.text)
  loadingAI.value = false
}

const yearFromDate = (date) => {
  return new Date(date).getFullYear()
}

onMounted(async () => {
  await fetchMovie()
})
</script>

<template>
  <div>
    <template v-if="loading"> </template>
    <template v-else>
      <div v-if="movie">
        <div class="">
          <div>
            <img
              class="w-full mb-6"
              :src="`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`"
              alt=""
            />
            <div class="flex-col space-y-2 px-6">
              <div class="flex items-center justify-between mb-4 gap-3 flex-wrap">
                <div class="min-w-0">
                  <h1 class="text-xl font-bold truncate">
                    {{ currentLanguage === 'ES' ? movie.title : movie.original_title }}
                  </h1>
                  <p class="text-sm text-gray-600 font-semibold">
                    {{ yearFromDate(movie.release_date) }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-px h-5 bg-white/20"></div>
                  <span
                    class="px-2 py-1 text-xs font-medium bg-gray-700 text-white rounded-md cursor-pointer"
                    @click="currentLanguage = currentLanguage === 'ES' ? 'EN' : 'ES'"
                  >
                    {{ currentLanguage }}
                  </span>
                </div>
              </div>
              <p>
                {{ movie.overview }}
              </p>
              <button
                class="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition-transform active:scale-95"
                @click="showPoster = true"
              >
                <PosterIcon class="w-5 h-5" />
                Ver póster
              </button>

              <hr class="my-6 border-t border-gray-300" />
            </div>
          </div>
          <div class="px-6">
            <div class="flex flex-col items-center justify-center mb-6 text-xl font-bold">
              <h1>¿No sabes que mimicas hacer?</h1>
            </div>
            <button
              class="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-linear-to-bl from-violet-500 to-fuchsia-500 text-white font-medium"
              :class="{
                'opacity-50 cursor-not-allowed': AIButtonDisabled,
              }"
              @click="fetchAI"
            >
              <AIIcon class="w-5 h-5" />
              Generar mímicas con IA
            </button>
            <div class="mt-4">
              <template v-if="loadingAI">
                <div class="flex flex-col items-center justify-center h-full">
                  <div>✨Generando ideas para mímicas...✨</div>
                </div>
              </template>
              <div v-else class="pb-22">
                <div class="mb-4" v-for="suggestion in suggestions" :key="suggestion.id">
                  <div
                    class="bg-white rounded-lg shadow-md border border-gray-200 text-black grid grid-cols-[auto_1fr] overflow-hidden"
                  >
                    <div
                      class="flex items-center justify-center px-5 bg-gray-200 font-bold text-lg text-gray-800"
                    >
                      {{ suggestion.id }}
                    </div>
                    <div class="py-3 px-4 font-medium text-sm leading-relaxed">
                      {{ suggestion.nombre }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <transition name="fade">
          <div
            v-if="showPoster"
            class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            @click.self="showPoster = false"
          >
            <div class="relative max-w-md w-full mx-4">
              <img
                :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                alt="Póster"
                class="w-full rounded-lg shadow-lg"
              />
              <button
                @click="showPoster = false"
                class="absolute top-4 right-4 bg-white text-black rounded-full w-8 h-8 flex items-center justify-center shadow"
              >
                <CloseIcon class="w-5 h-5" />
              </button>
            </div>
          </div>
        </transition>
      </div>
    </template>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
