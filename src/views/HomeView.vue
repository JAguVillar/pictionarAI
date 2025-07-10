<script setup>
import { ref, onMounted, watch } from 'vue'
import { GoogleGenAI } from '@google/genai'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
})
const loading = ref(false)
const bgColorClasses = {
  'yellow-500': 'bg-yellow-500/90',
  'blue-500': 'bg-blue-500/90',
  'orange-500': 'bg-orange-500/90',
  'green-500': 'bg-green-500/90',
  'red-500': 'bg-red-500/90',
  'purple-500': 'bg-purple-500/90',
  'pink-500': 'bg-pink-500/90',
  'sky-500': 'bg-sky-500/90',
}
const defaultWords = [
  {
    id: 1,
    category: 'Persona, animal o lugar',
    word: 'Taylor Swift',
    color: 'yellow-500',
  },
  {
    id: 2,
    category: 'Objeto',
    word: 'Auriculares inalámbricos',
    color: 'blue-500',
  },
  {
    id: 3,
    category: 'Acción',
    word: 'Maratonear una serie',
    color: 'orange-500',
  },
  {
    id: 4,
    category: 'Difícil',
    word: 'Inteligencia artificial',
    color: 'green-500',
  },
  {
    id: 5,
    category: 'Todos Juegan',
    word: 'Fiesta sorpresa',
    color: 'red-500',
  },
  {
    id: 6,
    category: 'Marca o logo',
    word: 'Spotify',
    color: 'purple-500',
  },
  {
    id: 7,
    category: 'Meme o tendencia',
    word: 'Mujer gritándole a un gato',
    color: 'pink-500',
  },
  {
    id: 8,
    category: 'Argenta',
    word: 'Tomar mate',
    color: 'sky-500',
  },
]
const words = ref([...defaultWords])

async function fetchAI() {
  loading.value = true
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: `Quiero que generes una tarjeta de Pictionary compuesta por 8 palabras o frases, cada una perteneciente a las siguientes categorías:

🟡 categoria 1, nombre: persona/animal/lugar, color: amarillo, explicacion de la categoria: nombres, persona, animales o lugares.
categoria 2, nombre: objeto, color: azul, explicacion de la categoria: cosas que se pueden ver o tocar.
categoria 3, nombre: accion, color: naranja, explicacion de la categoria: cosas que se pueden hacer.
categoria 4, nombre: dificil, color: verde, explicacion de la categoria: palabras, conceptos o expresiones desafiantes.
categoria 5, nombre: todos juegan, color: rojo, explicacion de la categoria: puede ser cualquier palabra.
categoria 6, nombre: Marca o logo, color: purpura, marcas reconocidas o logos visualmente conocidos.
categoria 7, nombre: Meme o tendencia, color: rosa, explicacion de la categoria: meme popular, tendencia viral o situación reconocible en redes sociales.
categoria 8, nombre: Argenta, color: cielo, explicacion de la categoria: elemento cultural argentino reconocible, como comidas típicas, modismos, personajes, costumbres o íconos nacionales.
⚠️ Las palabras deben ser actuales o ampliamente conocidas por el público general. Pueden referirse a cultura pop, tecnología, redes sociales, memes virales o costumbres argentinas populares. Recuerda que no todo tiene que ser de Argentina, pero sí debe ser algo que la mayoría de las personas pueda reconocer o entender.`,
      config: {
        responseMimeType: 'application/json',
        systemInstruction: `
      Devolvé un JSON, con este formato:
      [
      {
      id: 1,
      category: "Persona, animal o lugar" o categoria correspondiente,
      word: "aqui iria la palabra generada de acuerdo a la categoria",
      color: "yellow-500", // o el color correspondiente a la categoria en formato tailwindcss
      },
      ]
      . Sin explicaciones ni texto adicional. Usá español argentino o neutro. Por ejemplo, decí "celular", no "teléfono móvil".
      `,
      },
    })
    console.log(response.text)
    words.value = JSON.parse(response.text)
  } catch (e) {
    console.error('Error al generar palabras:', e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {})
</script>
<template>
  <main class="min-h-screen flex flex-col justify-center items-center p-4 main">
    <div class="flex flex-col flex-1 w-full gap-y-2">
      <h1
        class="font-black text-3xl text-center flex-1 flex justify-center items-center"
        @click="fetchAI"
      >
        <span class="cinzel"> pictionar </span>
        <span
          class="bg-linear-to-bl from-violet-500 to-fuchsia-500 bg-clip-text text-transparent font-black cinzel"
          >AI</span
        >
      </h1>
      <div
        v-for="word in words"
        :key="word.id"
        class="rounded-lg text-black flex-1 grid grid-rows-[auto_1fr] text-center"
        :class="[bgColorClasses[word.color]]"
      >
        <div class="bg-black/35">
          <h1 class="text-lg font-bold dmsans">
            {{ word.category }}
          </h1>
        </div>
        <div class="flex justify-center items-center">
          <h2
            class="text-2xl font-black dmsans transition-opacity duration-300"
            :class="loading ? 'opacity-30' : 'opacity-100'"
          >
            {{ loading ? '✨Generando palabras...✨' : word.word }}
          </h2>
        </div>
      </div>
    </div>
  </main>
</template>
