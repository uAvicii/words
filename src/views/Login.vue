<template>
  <div class="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4">
    <div class="max-w-md w-full space-y-8">
      <div class="text-center">
        <h2 class="text-3xl font-bold text-gray-900">📚 专属背单词</h2>
        <p class="mt-2 text-sm text-gray-600">登录或注册开始学习</p>
      </div>
      
      <div class="bg-white shadow-md rounded-lg p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="block text-sm font-medium text-gray-700">
              用户名
            </label>
            <input
              id="username"
              v-model="username"
              type="text"
              required
              autocomplete="username"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入用户名"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">
              密码
            </label>
            <input
              id="password"
              v-model="password"
              type="password"
              required
              autocomplete="current-password"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="请输入密码"
            />
          </div>

          <div v-if="errorMessage" class="text-sm text-red-600">
            {{ errorMessage }}
          </div>

          <div v-if="successMessage" class="text-sm text-green-600">
            {{ successMessage }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ loading ? '登录中...' : '登录 / 注册' }}
          </button>
        </form>

        <div class="mt-4 text-xs text-gray-500 text-center">
          <p>首次登录将自动创建账号</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { useWordStore } from '../stores/wordStore'

const router = useRouter()
const userStore = useUserStore()
const wordStore = useWordStore()

const username = ref('')
const password = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const handleLogin = async () => {
  errorMessage.value = ''
  successMessage.value = ''
  loading.value = true

  try {
    const result = await userStore.login(username.value, password.value)
    successMessage.value = result.message
    
    // 加载用户的单词数据
    if (result.words && result.words.length > 0) {
      wordStore.setWords(result.words)
    } else {
      wordStore.initializeData()
    }
    
    // 延迟跳转以显示成功消息
    setTimeout(() => {
      router.push('/')
    }, 500)
  } catch (error) {
    errorMessage.value = error.message || '登录失败，请重试'
  } finally {
    loading.value = false
  }
}
</script>

