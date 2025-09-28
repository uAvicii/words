import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Browse from '../views/Browse.vue'
import Review from '../views/Review.vue'
import Settings from '../views/Settings.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/browse',
    name: 'Browse',
    component: Browse
  },
  {
    path: '/review',
    name: 'Review',
    component: Review
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
