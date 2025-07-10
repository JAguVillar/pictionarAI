<template>
  <div class="aspect-[2/3] rounded-lg">
    <img :src="poster" class="w-full h-full object-cover rounded-lg" alt="" />
    <p class="mt-2 text-md font-bold">
      {{ title }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  poster: String,
})
</script>

<style lang="scss" scoped></style>
