import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useAuthStore } from '../stores/auth' 
import GameListView from '@/views/GameListView.vue'
import GameDetailsView from '@/views/GameDetailsView.vue'
import RegisterView from '@/views/RegisterView.vue' 


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/favorites',
      name: 'favorites',
      component: () => import('../views/FavoritesView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/gamelist',
      name: 'gamelist',
      component: GameListView
    },
    {
      path: '/game/:id', 
      name: 'game-details',
      component: GameDetailsView 
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView
    }
  ],
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    next('/login')
  }
  else if (to.path === '/login' && auth.isLoggedIn) {
    next('/')
  }
  else {
    next()
  }
})

export default router 