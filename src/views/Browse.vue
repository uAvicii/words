<template>
  <div class="space-y-6">
    <!-- 页面标题和模式切换 -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">单词浏览</h1>
      <div class="flex space-x-2">
        <button 
          @click="setViewMode('card')"
          class="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          :class="viewMode === 'card' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        >
          📄 <span class="hidden sm:inline">卡片模式</span><span class="sm:hidden">卡片</span>
        </button>
        <button 
          @click="setViewMode('list')"
          class="flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
          :class="viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        >
          📋 <span class="hidden sm:inline">列表模式</span><span class="sm:hidden">列表</span>
        </button>
      </div>
    </div>

    <!-- 分类筛选 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">筛选分类</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="(category, key) in categoryFilters" 
          :key="key"
          @click="toggleCategoryFilter(key)"
          class="px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
          :class="categoryFilters[key] ? getCategoryClass(key) : 'bg-gray-200 text-gray-700'"
        >
          <span class="hidden sm:inline">{{ getCategoryName(key) }} ({{ wordsByCategory[key].length }})</span>
          <span class="sm:hidden">{{ getCategoryName(key).slice(0, 2) }} ({{ wordsByCategory[key].length }})</span>
        </button>
      </div>
    </div>

    <!-- 单词展示区域 -->
    <div v-if="filteredWords.length === 0" class="card text-center py-12">
      <div class="text-gray-500 text-lg">没有找到符合条件的单词</div>
    </div>

    <!-- 卡片模式 -->
    <div v-else-if="viewMode === 'card'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      <div 
        v-for="word in filteredWords" 
        :key="word.id"
        class="card hover:shadow-lg transition-shadow"
      >
        <div class="text-center mb-4">
          <div class="text-xl sm:text-2xl font-bold text-gray-900 mb-2">{{ word.word }}</div>
          <div class="text-base sm:text-lg text-gray-600">{{ word.meaning }}</div>
        </div>
        
        <div class="space-y-2">
          <div class="text-xs sm:text-sm text-gray-500 mb-3">
            当前分类: <span :class="getCategoryClass(word.category) + ' px-2 py-1 rounded text-xs'">
              {{ getCategoryName(word.category) }}
            </span>
          </div>
          
          <div class="grid grid-cols-2 gap-1 sm:gap-2">
            <button 
              @click="updateWordCategory(word.id, 'familiar-simple')"
              class="btn-secondary text-xs py-1 sm:py-2"
              :class="{ 'bg-familiar-simple text-white': word.category === 'familiar-simple' }"
            >
              <span class="hidden sm:inline">熟悉-简单</span>
              <span class="sm:hidden">简单</span>
            </button>
            <button 
              @click="updateWordCategory(word.id, 'familiar-forget')"
              class="btn-secondary text-xs py-1 sm:py-2"
              :class="{ 'bg-familiar-forget text-white': word.category === 'familiar-forget' }"
            >
              <span class="hidden sm:inline">熟悉-可能忘记</span>
              <span class="sm:hidden">忘记</span>
            </button>
            <button 
              @click="updateWordCategory(word.id, 'new-word')"
              class="btn-secondary text-xs py-1 sm:py-2"
              :class="{ 'bg-new-word text-white': word.category === 'new-word' }"
            >
              生词
            </button>
            <button 
              @click="updateWordCategory(word.id, 'confused')"
              class="btn-secondary text-xs py-1 sm:py-2"
              :class="{ 'bg-confused text-white': word.category === 'confused' }"
            >
              易混淆
            </button>
            <button 
              @click="updateWordCategory(word.id, 'mastered')"
              class="btn-secondary text-xs py-1 sm:py-2 col-span-2"
              :class="{ 'bg-mastered text-white': word.category === 'mastered' }"
            >
              已掌握
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 列表模式 -->
    <div v-else class="space-y-4">
      <div 
        v-for="word in filteredWords" 
        :key="word.id"
        class="card hover:shadow-md transition-shadow"
      >
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <div class="text-xl font-semibold text-gray-900">{{ word.word }}</div>
            <div class="text-gray-600">{{ word.meaning }}</div>
          </div>
          
          <div class="flex items-center space-x-2">
            <span 
              :class="getCategoryClass(word.category) + ' px-3 py-1 rounded-full text-sm'"
            >
              {{ getCategoryName(word.category) }}
            </span>
            
            <div class="flex space-x-1">
              <button 
                @click="updateWordCategory(word.id, 'familiar-simple')"
                class="w-8 h-8 rounded-full bg-familiar-simple text-white text-xs hover:opacity-80"
                :class="{ 'ring-2 ring-familiar-simple ring-offset-2': word.category === 'familiar-simple' }"
                title="熟悉-简单"
              >
                S
              </button>
              <button 
                @click="updateWordCategory(word.id, 'familiar-forget')"
                class="w-8 h-8 rounded-full bg-familiar-forget text-white text-xs hover:opacity-80"
                :class="{ 'ring-2 ring-familiar-forget ring-offset-2': word.category === 'familiar-forget' }"
                title="熟悉-可能忘记"
              >
                F
              </button>
              <button 
                @click="updateWordCategory(word.id, 'new-word')"
                class="w-8 h-8 rounded-full bg-new-word text-white text-xs hover:opacity-80"
                :class="{ 'ring-2 ring-new-word ring-offset-2': word.category === 'new-word' }"
                title="生词"
              >
                N
              </button>
              <button 
                @click="updateWordCategory(word.id, 'confused')"
                class="w-8 h-8 rounded-full bg-confused text-white text-xs hover:opacity-80"
                :class="{ 'ring-2 ring-confused ring-offset-2': word.category === 'confused' }"
                title="易混淆"
              >
                C
              </button>
              <button 
                @click="updateWordCategory(word.id, 'mastered')"
                class="w-8 h-8 rounded-full bg-mastered text-white text-xs hover:opacity-80"
                :class="{ 'ring-2 ring-mastered ring-offset-2': word.category === 'mastered' }"
                title="已掌握"
              >
                M
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">分类统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div 
          v-for="(category, key) in wordsByCategory" 
          :key="key"
          class="text-center"
        >
          <div 
            :class="getCategoryClass(key) + ' w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold'"
          >
            {{ category.length }}
          </div>
          <div class="text-sm text-gray-600">{{ getCategoryName(key) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWordStore } from '../stores/wordStore'

const wordStore = useWordStore()
const { words, wordsByCategory, viewMode, updateWordCategory, setViewMode, loadViewMode } = wordStore

// 分类筛选状态
const categoryFilters = ref({
  'familiar-simple': true,
  'familiar-forget': true,
  'new-word': true,
  'confused': true,
  'mastered': false
})

// 筛选后的单词
const filteredWords = computed(() => {
  return words.filter(word => categoryFilters.value[word.category])
})

// 切换分类筛选
const toggleCategoryFilter = (category) => {
  categoryFilters.value[category] = !categoryFilters.value[category]
}

// 获取分类名称
const getCategoryName = (category) => {
  const names = {
    'familiar-simple': '熟悉-简单',
    'familiar-forget': '熟悉-可能忘记',
    'new-word': '生词',
    'confused': '易混淆',
    'mastered': '已掌握'
  }
  return names[category] || category
}

// 获取分类样式类
const getCategoryClass = (category) => {
  const classes = {
    'familiar-simple': 'category-familiar-simple',
    'familiar-forget': 'category-familiar-forget',
    'new-word': 'category-new-word',
    'confused': 'category-confused',
    'mastered': 'category-mastered'
  }
  return classes[category] || 'bg-gray-500'
}

onMounted(() => {
  loadViewMode()
})
</script>
