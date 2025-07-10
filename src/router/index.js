import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import ListIcon from '@/components/icons/ListIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      name: 'home',
    },
  ],
})

export default router
