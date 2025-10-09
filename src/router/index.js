import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Browse from '../views/Browse.vue'
import Review from '../views/Review.vue'
import Settings from '../views/Settings.vue'
import Login from '../views/Login.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: true }
  },
  {
    path: '/browse',
    name: 'Browse',
    component: Browse,
    meta: { requiresAuth: true }
  },
  {
    path: '/review',
    name: 'Review',
    component: Review,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const username = localStorage.getItem('vocabulary-username')
  const isLoggedIn = !!username

  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login')
  } else if (to.path === '/login' && isLoggedIn) {
    next('/')
  } else {
    next()
  }
})

export default router
