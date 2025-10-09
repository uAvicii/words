import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useUserStore } from './userStore'

const API_BASE = 'http://localhost:3000/api'

export const useWordStore = defineStore('word', () => {
  // 状态
  const words = ref([])
  const currentWordIndex = ref(0)
  const viewMode = ref('card') // 'card' 或 'list'

  // 示例单词数据
  const sampleWords = [
    { id: 1, word: 'abandon', meaning: '放弃，抛弃', category: 'new-word', lastReviewed: null, reviewCount: 0 },
    { id: 2, word: 'ability', meaning: '能力，才能', category: 'new-word', lastReviewed: null, reviewCount: 0 },
    { id: 3, word: 'absolute', meaning: '绝对的，完全的', category: 'new-word', lastReviewed: null, reviewCount: 0 },
    { id: 4, word: 'accept', meaning: '接受，承认', category: 'familiar-simple', lastReviewed: null, reviewCount: 0 },
    { id: 5, word: 'access', meaning: '接近，进入', category: 'familiar-forget', lastReviewed: null, reviewCount: 0 },
    { id: 6, word: 'accident', meaning: '事故，意外', category: 'familiar-simple', lastReviewed: null, reviewCount: 0 },
    { id: 7, word: 'accompany', meaning: '陪伴，伴随', category: 'new-word', lastReviewed: null, reviewCount: 0 },
    { id: 8, word: 'accomplish', meaning: '完成，实现', category: 'new-word', lastReviewed: null, reviewCount: 0 },
    { id: 9, word: 'account', meaning: '账户，解释', category: 'confused', lastReviewed: null, reviewCount: 0 },
    { id: 10, word: 'accurate', meaning: '准确的，精确的', category: 'new-word', lastReviewed: null, reviewCount: 0 }
  ]

  // 计算属性
  const wordsByCategory = computed(() => {
    const categories = {
      'familiar-simple': words.value.filter(w => w.category === 'familiar-simple'),
      'familiar-forget': words.value.filter(w => w.category === 'familiar-forget'),
      'new-word': words.value.filter(w => w.category === 'new-word'),
      'confused': words.value.filter(w => w.category === 'confused'),
      'mastered': words.value.filter(w => w.category === 'mastered')
    }
    return categories
  })

  const todayReviewWords = computed(() => {
    const today = new Date().toDateString()
    return words.value.filter(word => {
      if (word.category === 'mastered') return false

      const lastReviewed = word.lastReviewed ? new Date(word.lastReviewed).toDateString() : null

      // 根据分类确定复习间隔
      const intervals = {
        'new-word': [0, 1, 3, 7, 15, 30], // 0、1、3、7、15、30天
        'familiar-forget': [0, 1, 2, 4, 7, 15], // 0、1、2、4、7、15天
        'familiar-simple': [0, 1], // 0、1天
        'confused': [0, 1, 3, 7] // 0、1、3、7天
      }

      if (!lastReviewed) return true // 从未复习过

      const daysSinceReview = Math.floor((new Date() - new Date(word.lastReviewed)) / (1000 * 60 * 60 * 24))
      const wordIntervals = intervals[word.category] || [0, 1, 3, 7]

      return wordIntervals.includes(daysSinceReview)
    })
  })

  const todayStats = computed(() => {
    const total = words.value.length
    const mastered = wordsByCategory.value.mastered.length
    const toReview = todayReviewWords.value.length

    return {
      total,
      mastered,
      toReview,
      progress: total > 0 ? Math.round((mastered / total) * 100) : 0
    }
  })

  // 方法
  const initializeData = () => {
    const savedWords = localStorage.getItem('vocabulary-words')
    if (savedWords) {
      words.value = JSON.parse(savedWords)
    } else {
      words.value = [...sampleWords]
      saveToLocalStorage()
    }
  }

  const saveToLocalStorage = () => {
    localStorage.setItem('vocabulary-words', JSON.stringify(words.value))
  }

  // 保存到后端
  const saveToServer = async () => {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn || !userStore.username) return

    try {
      const response = await fetch(`${API_BASE}/words/${userStore.username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ words: words.value })
      })

      if (!response.ok) {
        console.error('保存到服务器失败')
      }
    } catch (error) {
      console.error('保存到服务器错误:', error)
    }
  }

  // 从后端加载
  const loadFromServer = async () => {
    const userStore = useUserStore()
    if (!userStore.isLoggedIn || !userStore.username) return

    try {
      const response = await fetch(`${API_BASE}/words/${userStore.username}`)
      const data = await response.json()

      if (data.words && data.words.length > 0) {
        words.value = data.words
        saveToLocalStorage()
      }
    } catch (error) {
      console.error('从服务器加载错误:', error)
    }
  }

  const updateWordCategory = (wordId, category) => {
    const word = words.value.find(w => w.id === wordId)
    if (word) {
      word.category = category
      word.lastReviewed = new Date().toISOString()
      saveToLocalStorage()
      saveToServer()
    }
  }

  const markWordAsReviewed = (wordId, correct) => {
    const word = words.value.find(w => w.id === wordId)
    if (word) {
      word.reviewCount += 1
      word.lastReviewed = new Date().toISOString()

      // 如果连续答对2-3次，自动转为已掌握
      if (correct && word.reviewCount >= 2) {
        word.category = 'mastered'
      }

      saveToLocalStorage()
      saveToServer()
    }
  }

  const setViewMode = (mode) => {
    viewMode.value = mode
    localStorage.setItem('vocabulary-view-mode', mode)
  }

  const loadViewMode = () => {
    const savedMode = localStorage.getItem('vocabulary-view-mode')
    if (savedMode) {
      viewMode.value = savedMode
    }
  }

  const addWord = (word, meaning) => {
    const newWord = {
      id: Date.now(),
      word: word.trim(),
      meaning: meaning.trim(),
      category: 'new-word',
      lastReviewed: null,
      reviewCount: 0
    }
    words.value.push(newWord)
    saveToLocalStorage()
    saveToServer()
  }

  const deleteWord = (wordId) => {
    const index = words.value.findIndex(w => w.id === wordId)
    if (index > -1) {
      words.value.splice(index, 1)
      saveToLocalStorage()
      saveToServer()
    }
  }

  const exportWords = () => {
    const dataStr = JSON.stringify(words.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'vocabulary-words.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const importWords = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedWords = JSON.parse(e.target.result)
          words.value = importedWords
          saveToLocalStorage()
          saveToServer()
          resolve()
        } catch (error) {
          reject(error)
        }
      }
      reader.readAsText(file)
    })
  }

  // 设置单词（用于登录后加载）
  const setWords = (newWords) => {
    words.value = newWords
    saveToLocalStorage()
  }

  return {
    // 状态
    words,
    currentWordIndex,
    viewMode,

    // 计算属性
    wordsByCategory,
    todayReviewWords,
    todayStats,

    // 方法
    initializeData,
    updateWordCategory,
    markWordAsReviewed,
    setViewMode,
    loadViewMode,
    addWord,
    deleteWord,
    exportWords,
    importWords,
    setWords,
    loadFromServer,
    saveToServer
  }
})
