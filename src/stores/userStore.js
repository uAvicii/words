import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

const API_BASE = 'http://localhost:3000/api'

export const useUserStore = defineStore('user', () => {
  const username = ref(null)
  const isLoggedIn = ref(false)

  // 从 localStorage 恢复登录状态
  const restoreSession = () => {
    const savedUsername = localStorage.getItem('vocabulary-username')
    if (savedUsername) {
      username.value = savedUsername
      isLoggedIn.value = true
    }
  }

  // 登录
  const login = async (user, pass) => {
    try {
      const response = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: user, password: pass })
      })

      // 检查响应是否为 JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('服务器返回格式错误，请检查后端是否正常运行')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || '登录失败')
      }

      username.value = user
      isLoggedIn.value = true
      localStorage.setItem('vocabulary-username', user)

      return { success: true, words: data.words, message: data.message }
    } catch (error) {
      // 如果是网络错误
      if (error.message === 'Failed to fetch' || error.name === 'TypeError') {
        throw new Error('无法连接到服务器，请确保后端服务器已启动')
      }
      throw error
    }
  }

  // 登出
  const logout = () => {
    username.value = null
    isLoggedIn.value = false
    localStorage.removeItem('vocabulary-username')
    localStorage.removeItem('vocabulary-words')
    localStorage.removeItem('vocabulary-view-mode')
  }

  return {
    username,
    isLoggedIn,
    restoreSession,
    login,
    logout
  }
})

