import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import MovieView from '@/views/MovieView.vue'
import SearchView from '@/views/SearchView.vue'
import ListsView from '@/views/ListsView.vue'
import ListView from '@/views/ListView.vue'

import HomeIcon from '@/components/icons/HomeIcon.vue'
import ListIcon from '@/components/icons/ListIcon.vue'
import SearchIcon from '@/components/icons/SearchIcon.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/:listId?',
      component: HomeView,
      name: 'home',
      meta: {
        title: 'Inicio',
        subTitle: 'Peliculas más populares',
        icon: HomeIcon,
        show: true,
        absolute: false,
        showBack: false,
      },
    },
    {
      path: '/movie/:movieId',
      component: MovieView,
      name: 'movie',
      meta: {
        title: 'Detalles de la Película',
        icon: ListIcon,
        show: false,
        absolute: true,
        showBack: true,
      },
    },
    {
      path: '/lists',
      component: ListsView,
      name: 'lists',
      meta: { title: 'Listas', icon: ListIcon, show: true, absolute: false, showBack: true },
    },
    {
      path: '/list/:listId/:listName',
      component: ListView,
      name: 'list',
      meta: { title: 'Lista', icon: ListIcon, show: false, absolute: false, showBack: true },
    },
    {
      path: '/search',
      component: SearchView,
      name: 'search',
      meta: { title: 'Buscar', icon: SearchIcon, show: true, absolute: false, showBack: true },
    },
    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue'),
    // },
  ],
})

export default router
