<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">单词复习</h1>
      <p class="text-gray-600">通过复习巩固记忆，提高学习效果</p>
    </div>

    <!-- 复习模式选择 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">选择复习模式</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button 
          @click="startReview('new-word')"
          class="p-4 border-2 border-new-word rounded-lg hover:bg-new-word hover:text-white transition-colors"
          :disabled="wordsByCategory['new-word'].length === 0"
        >
          <div class="text-2xl mb-2">📚</div>
          <div class="font-semibold text-sm sm:text-base">生词复习</div>
          <div class="text-xs sm:text-sm opacity-75">{{ wordsByCategory['new-word'].length }} 个单词</div>
        </button>
        
        <button 
          @click="startReview('familiar-forget')"
          class="p-4 border-2 border-familiar-forget rounded-lg hover:bg-familiar-forget hover:text-white transition-colors"
          :disabled="wordsByCategory['familiar-forget'].length === 0"
        >
          <div class="text-2xl mb-2">🔄</div>
          <div class="font-semibold text-sm sm:text-base">熟悉词复习</div>
          <div class="text-xs sm:text-sm opacity-75">{{ wordsByCategory['familiar-forget'].length }} 个单词</div>
        </button>
        
        <button 
          @click="startReview('confused')"
          class="p-4 border-2 border-confused rounded-lg hover:bg-confused hover:text-white transition-colors sm:col-span-2 lg:col-span-1"
          :disabled="wordsByCategory['confused'].length === 0"
        >
          <div class="text-2xl mb-2">⚠️</div>
          <div class="font-semibold text-sm sm:text-base">易混淆词练习</div>
          <div class="text-xs sm:text-sm opacity-75">{{ wordsByCategory['confused'].length }} 个单词</div>
        </button>
      </div>
    </div>

    <!-- 今日复习统计 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">今日复习统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-xl sm:text-2xl font-bold text-blue-600">{{ todayStats.toReview }}</div>
          <div class="text-xs sm:text-sm text-gray-600">待复习</div>
        </div>
        <div class="text-center">
          <div class="text-xl sm:text-2xl font-bold text-green-600">{{ reviewStats.completed }}</div>
          <div class="text-xs sm:text-sm text-gray-600">已完成</div>
        </div>
        <div class="text-center">
          <div class="text-xl sm:text-2xl font-bold text-orange-600">{{ reviewStats.correct }}</div>
          <div class="text-xs sm:text-sm text-gray-600">答对</div>
        </div>
        <div class="text-center">
          <div class="text-xl sm:text-2xl font-bold text-red-600">{{ reviewStats.wrong }}</div>
          <div class="text-xs sm:text-sm text-gray-600">答错</div>
        </div>
      </div>
    </div>

    <!-- 复习进行中 -->
    <div v-if="isReviewing" class="space-y-6">
      <!-- 进度条 -->
      <div class="card">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-gray-700">复习进度</span>
          <span class="text-sm text-gray-500">{{ currentIndex + 1 }} / {{ reviewWords.length }}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div 
            class="bg-blue-600 h-2 rounded-full transition-all duration-300"
            :style="{ width: `${((currentIndex + 1) / reviewWords.length) * 100}%` }"
          ></div>
        </div>
      </div>

      <!-- 单词卡片 -->
      <div class="card max-w-2xl mx-auto">
        <div class="text-center">
          <div class="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            {{ currentWord.word }}
          </div>
          
          <div v-if="showMeaning" class="text-xl sm:text-2xl text-gray-600 mb-6">
            {{ currentWord.meaning }}
          </div>
          
          <div v-else class="mb-6">
            <button 
              @click="showMeaning = true"
              class="btn-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3"
            >
              显示释义
            </button>
          </div>
          
          <div v-if="showMeaning" class="space-y-4">
            <div class="text-base sm:text-lg text-gray-600 mb-6">
              你知道这个单词的意思吗？
            </div>
            
            <div class="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button 
                @click="handleAnswer(true)"
                class="btn-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 bg-green-600 hover:bg-green-700"
              >
                ✅ 知道
              </button>
              <button 
                @click="handleAnswer(false)"
                class="btn-primary text-base sm:text-lg px-6 sm:px-8 py-2 sm:py-3 bg-red-600 hover:bg-red-700"
              >
                ❌ 不知道
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 复习控制 -->
      <div class="flex justify-center space-x-4">
        <button 
          @click="skipWord"
          class="btn-secondary"
        >
          跳过
        </button>
        <button 
          @click="endReview"
          class="btn-primary bg-gray-600 hover:bg-gray-700"
        >
          结束复习
        </button>
      </div>
    </div>

    <!-- 复习完成 -->
    <div v-if="reviewCompleted" class="card text-center max-w-2xl mx-auto">
      <div class="text-6xl mb-4">🎉</div>
      <h2 class="text-2xl font-bold text-gray-900 mb-4">复习完成！</h2>
      
      <div class="space-y-4 mb-6">
        <div class="text-lg">
          本次复习了 <span class="font-bold text-blue-600">{{ reviewStats.completed }}</span> 个单词
        </div>
        <div class="text-lg">
          答对了 <span class="font-bold text-green-600">{{ reviewStats.correct }}</span> 个
        </div>
        <div class="text-lg">
          答错了 <span class="font-bold text-red-600">{{ reviewStats.wrong }}</span> 个
        </div>
        <div class="text-lg">
          准确率: <span class="font-bold text-blue-600">{{ accuracy }}%</span>
        </div>
      </div>
      
      <div class="flex justify-center space-x-4">
        <button 
          @click="resetReview"
          class="btn-primary"
        >
          再次复习
        </button>
        <router-link 
          to="/"
          class="btn-secondary"
        >
          返回首页
        </router-link>
      </div>
    </div>

    <!-- 复习历史 -->
    <div v-if="!isReviewing && !reviewCompleted" class="card">
      <h3 class="text-lg font-semibold mb-4">最近复习记录</h3>
      <div v-if="recentReviews.length === 0" class="text-gray-500 text-center py-4">
        暂无复习记录
      </div>
      <div v-else class="space-y-2">
        <div 
          v-for="review in recentReviews.slice(0, 5)" 
          :key="review.id"
          class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
        >
          <div>
            <span class="font-medium">{{ review.word }}</span>
            <span class="text-gray-500 ml-2">{{ review.meaning }}</span>
          </div>
          <div class="flex items-center space-x-2">
            <span 
              :class="review.correct ? 'text-green-600' : 'text-red-600'"
            >
              {{ review.correct ? '✅' : '❌' }}
            </span>
            <span class="text-sm text-gray-500">
              {{ formatDate(review.date) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWordStore } from '../stores/wordStore'

const wordStore = useWordStore()
const { wordsByCategory, todayStats, markWordAsReviewed } = wordStore

// 复习状态
const isReviewing = ref(false)
const reviewCompleted = ref(false)
const currentIndex = ref(0)
const reviewWords = ref([])
const showMeaning = ref(false)
const reviewMode = ref('')

// 复习统计
const reviewStats = ref({
  completed: 0,
  correct: 0,
  wrong: 0
})

// 复习历史
const recentReviews = ref([])

// 当前单词
const currentWord = computed(() => {
  return reviewWords.value[currentIndex.value] || {}
})

// 准确率
const accuracy = computed(() => {
  if (reviewStats.value.completed === 0) return 0
  return Math.round((reviewStats.value.correct / reviewStats.value.completed) * 100)
})

// 开始复习
const startReview = (mode) => {
  reviewMode.value = mode
  reviewWords.value = [...wordsByCategory[mode]]
  
  if (reviewWords.value.length === 0) {
    alert('该分类下没有单词可复习')
    return
  }
  
  // 打乱单词顺序
  reviewWords.value.sort(() => Math.random() - 0.5)
  
  isReviewing.value = true
  reviewCompleted.value = false
  currentIndex.value = 0
  showMeaning.value = false
  
  // 重置统计
  reviewStats.value = {
    completed: 0,
    correct: 0,
    wrong: 0
  }
}

// 处理答案
const handleAnswer = (correct) => {
  const word = currentWord.value
  if (word) {
    // 记录复习历史
    recentReviews.value.unshift({
      id: Date.now(),
      word: word.word,
      meaning: word.meaning,
      correct,
      date: new Date().toISOString()
    })
    
    // 更新统计
    reviewStats.value.completed++
    if (correct) {
      reviewStats.value.correct++
    } else {
      reviewStats.value.wrong++
    }
    
    // 更新单词状态
    markWordAsReviewed(word.id, correct)
  }
  
  nextWord()
}

// 跳过单词
const skipWord = () => {
  nextWord()
}

// 下一个单词
const nextWord = () => {
  currentIndex.value++
  showMeaning.value = false
  
  if (currentIndex.value >= reviewWords.value.length) {
    endReview()
  }
}

// 结束复习
const endReview = () => {
  isReviewing.value = false
  reviewCompleted.value = true
}

// 重置复习
const resetReview = () => {
  reviewCompleted.value = false
  startReview(reviewMode.value)
}

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  // 加载复习历史
  const saved = localStorage.getItem('vocabulary-review-history')
  if (saved) {
    recentReviews.value = JSON.parse(saved)
  }
  
  // 保存复习历史
  const saveReviewHistory = () => {
    localStorage.setItem('vocabulary-review-history', JSON.stringify(recentReviews.value.slice(0, 50)))
  }
  
  // 监听复习历史变化
  const unwatch = ref(recentReviews.value)
  unwatch.value = recentReviews.value
  saveReviewHistory()
})
</script>
