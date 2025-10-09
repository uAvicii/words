<template>
  <div id="app" class="min-h-screen">
    <nav v-if="!isLoginPage" class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <router-link to="/" class="text-lg sm:text-xl font-bold text-gray-900">
              📚 专属背单词
            </router-link>
            <span v-if="userStore.username" class="ml-4 text-sm text-gray-600">
              用户: {{ userStore.username }}
            </span>
          </div>
          <!-- 桌面端导航 -->
          <div class="hidden md:flex items-center space-x-4">
            <router-link 
              to="/" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-600': $route.path === '/' }"
            >
              首页
            </router-link>
            <router-link 
              to="/browse" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-600': $route.path === '/browse' }"
            >
              浏览
            </router-link>
            <router-link 
              to="/review" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-600': $route.path === '/review' }"
            >
              复习
            </router-link>
            <router-link 
              to="/settings" 
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              :class="{ 'text-blue-600': $route.path === '/settings' }"
            >
              设置
            </router-link>
            <button 
              @click="handleLogout"
              class="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
            >
              登出
            </button>
          </div>
          <!-- 移动端菜单按钮 -->
          <div class="md:hidden">
            <button 
              @click="toggleMobileMenu"
              class="text-gray-600 hover:text-gray-900 p-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
          </div>
        </div>
        <!-- 移动端导航菜单 -->
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link 
              to="/" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/' }"
              @click="closeMobileMenu"
            >
              首页
            </router-link>
            <router-link 
              to="/browse" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/browse' }"
              @click="closeMobileMenu"
            >
              浏览
            </router-link>
            <router-link 
              to="/review" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/review' }"
              @click="closeMobileMenu"
            >
              复习
            </router-link>
            <router-link 
              to="/settings" 
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              :class="{ 'text-blue-600 bg-blue-50': $route.path === '/settings' }"
              @click="closeMobileMenu"
            >
              设置
            </router-link>
            <button 
              @click="handleLogout"
              class="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              登出
            </button>
          </div>
        </div>
      </div>
    </nav>
    
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useWordStore } from './stores/wordStore'
import { useUserStore } from './stores/userStore'

const route = useRoute()
const router = useRouter()
const wordStore = useWordStore()
const userStore = useUserStore()
const showMobileMenu = ref(false)

const isLoginPage = computed(() => route.path === '/login')

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}

onMounted(() => {
  // 恢复登录状态
  userStore.restoreSession()
  
  // 如果已登录，初始化数据
  if (userStore.isLoggedIn) {
    wordStore.initializeData()
    wordStore.loadFromServer()
  }
})
</script>
