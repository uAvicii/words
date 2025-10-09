<template>
  <div class="space-y-6">
    <!-- 页面标题 -->
    <div class="text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">设置</h1>
      <p class="text-gray-600">管理你的单词库和学习设置</p>
    </div>

    <!-- 单词管理 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">单词管理</h3>
      
      <!-- 添加新单词 -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3">添加新单词</h4>
        <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <input 
            v-model="newWord.word"
            type="text" 
            placeholder="输入单词"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <input 
            v-model="newWord.meaning"
            type="text" 
            placeholder="输入释义"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button 
            @click="addNewWord"
            class="btn-primary w-full sm:w-auto"
            :disabled="!newWord.word.trim() || !newWord.meaning.trim()"
          >
            添加
          </button>
        </div>
      </div>

      <!-- 单词列表 -->
      <div class="mb-6">
        <h4 class="text-md font-medium mb-3">单词列表 ({{ words.length }} 个)</h4>
        <div class="max-h-64 overflow-y-auto space-y-2">
          <div 
            v-for="word in words" 
            :key="word.id"
            class="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
          >
            <div class="flex-1">
              <div class="font-medium">{{ word.word }}</div>
              <div class="text-sm text-gray-600">{{ word.meaning }}</div>
              <div class="text-xs text-gray-500">
                分类: {{ getCategoryName(word.category) }} | 
                复习次数: {{ word.reviewCount }}
              </div>
            </div>
            <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
              <select 
                :value="word.category"
                @change="updateWordCategory(word.id, $event.target.value)"
                class="text-sm border border-gray-300 rounded px-2 py-1 w-full sm:w-auto"
              >
                <option value="new-word">生词</option>
                <option value="familiar-simple">熟悉-简单</option>
                <option value="familiar-forget">熟悉-可能忘记</option>
                <option value="confused">易混淆</option>
                <option value="mastered">已掌握</option>
              </select>
              <button 
                @click="deleteWord(word.id)"
                class="text-red-600 hover:text-red-800 text-sm w-full sm:w-auto text-center"
              >
                删除
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 导入导出 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 class="text-md font-medium mb-3">导出数据</h4>
          <button 
            @click="exportWords"
            class="btn-secondary w-full"
          >
            📤 导出单词库
          </button>
        </div>
        
        <div>
          <h4 class="text-md font-medium mb-3">导入数据</h4>
          <input 
            ref="fileInput"
            type="file" 
            accept=".json,.txt"
            @change="handleFileImport"
            class="hidden"
          />
          <button 
            @click="$refs.fileInput.click()"
            class="btn-secondary w-full"
          >
            📥 导入单词库 (JSON/TXT)
          </button>
          <p class="text-xs text-gray-500 mt-2">
            支持 JSON 格式或 TXT 格式（每行：单词 释义）
          </p>
        </div>
      </div>
    </div>

    <!-- 学习设置 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">学习设置</h3>
      
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            默认浏览模式
          </label>
          <select 
            :value="viewMode"
            @change="setViewMode($event.target.value)"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="card">卡片模式</option>
            <option value="list">列表模式</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            复习间隔设置
          </label>
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm">生词复习间隔 (天)</span>
              <input 
                v-model="reviewIntervals.newWord"
                type="text" 
                placeholder="0,1,3,7,15,30"
                class="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">熟悉-可能忘记间隔 (天)</span>
              <input 
                v-model="reviewIntervals.familiarForget"
                type="text" 
                placeholder="0,1,2,4,7,15"
                class="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">熟悉-简单间隔 (天)</span>
              <input 
                v-model="reviewIntervals.familiarSimple"
                type="text" 
                placeholder="0,1"
                class="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm">易混淆间隔 (天)</span>
              <input 
                v-model="reviewIntervals.confused"
                type="text" 
                placeholder="0,1,3,7"
                class="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据统计 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">数据统计</h3>
      
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="text-center">
          <div class="text-2xl font-bold text-blue-600">{{ todayStats.total }}</div>
          <div class="text-sm text-gray-600">总单词数</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-green-600">{{ todayStats.mastered }}</div>
          <div class="text-sm text-gray-600">已掌握</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-orange-600">{{ todayStats.toReview }}</div>
          <div class="text-sm text-gray-600">待复习</div>
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-purple-600">{{ todayStats.progress }}%</div>
          <div class="text-sm text-gray-600">掌握率</div>
        </div>
      </div>
    </div>

    <!-- 数据清理 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">数据管理</h3>
      
      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div>
            <div class="font-medium text-yellow-800">重置所有数据</div>
            <div class="text-sm text-yellow-600">这将删除所有单词和设置，无法恢复</div>
          </div>
          <button 
            @click="resetAllData"
            class="btn-primary bg-red-600 hover:bg-red-700"
          >
            重置
          </button>
        </div>
        
        <div class="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div>
            <div class="font-medium text-blue-800">清除复习历史</div>
            <div class="text-sm text-blue-600">清除所有复习记录，保留单词数据</div>
          </div>
          <button 
            @click="clearReviewHistory"
            class="btn-secondary"
          >
            清除
          </button>
        </div>
      </div>
    </div>

    <!-- 关于 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">关于</h3>
      <div class="space-y-2 text-sm text-gray-600">
        <div>版本: 1.0.0</div>
        <div>基于 Vue 3 + TailwindCSS 构建</div>
        <div>数据存储在本地浏览器中</div>
        <div>支持离线使用</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useWordStore } from '../stores/wordStore'

const wordStore = useWordStore()
const { 
  words, 
  viewMode, 
  todayStats, 
  addWord, 
  deleteWord, 
  updateWordCategory, 
  setViewMode, 
  exportWords, 
  importWords 
} = wordStore

// 新单词表单
const newWord = ref({
  word: '',
  meaning: ''
})

// 复习间隔设置
const reviewIntervals = ref({
  newWord: '0,1,3,7,15,30',
  familiarForget: '0,1,2,4,7,15',
  familiarSimple: '0,1',
  confused: '0,1,3,7'
})

// 添加新单词
const addNewWord = () => {
  if (newWord.value.word.trim() && newWord.value.meaning.trim()) {
    addWord(newWord.value.word, newWord.value.meaning)
    newWord.value = { word: '', meaning: '' }
  }
}

// 处理文件导入
const handleFileImport = (event) => {
  const file = event.target.files[0]
  if (file) {
    const fileExtension = file.name.split('.').pop().toLowerCase()
    
    if (fileExtension === 'txt') {
      // 处理 TXT 格式
      importWordsFromTxt(file)
        .then((count) => {
          alert(`导入成功！共导入 ${count} 个单词`)
          event.target.value = '' // 清空文件选择
        })
        .catch((error) => {
          alert('导入失败：' + error.message)
          event.target.value = ''
        })
    } else {
      // 处理 JSON 格式
      importWords(file)
        .then(() => {
          alert('导入成功！')
          event.target.value = ''
        })
        .catch(() => {
          alert('导入失败，请检查文件格式')
          event.target.value = ''
        })
    }
  }
}

// 从 TXT 文件导入单词
const importWordsFromTxt = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target.result
        const lines = text.split('\n').filter(line => line.trim())
        
        let successCount = 0
        let failCount = 0
        
        lines.forEach(line => {
          // 支持多种分隔符：制表符、多个空格、单个空格
          const parts = line.trim().split(/\t|  +| /)
          
          if (parts.length >= 2) {
            const word = parts[0].trim()
            const meaning = parts.slice(1).join(' ').trim()
            
            if (word && meaning) {
              addWord(word, meaning)
              successCount++
            } else {
              failCount++
            }
          } else {
            failCount++
          }
        })
        
        if (successCount === 0) {
          reject(new Error('没有找到有效的单词数据。请确保每行格式为：单词 释义'))
        } else {
          resolve(successCount)
          if (failCount > 0) {
            setTimeout(() => {
              alert(`提示：有 ${failCount} 行数据格式不正确，已跳过`)
            }, 500)
          }
        }
      } catch (error) {
        reject(new Error('文件解析失败：' + error.message))
      }
    }
    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }
    reader.readAsText(file, 'UTF-8')
  })
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

// 重置所有数据
const resetAllData = () => {
  if (confirm('确定要重置所有数据吗？此操作不可恢复！')) {
    localStorage.removeItem('vocabulary-words')
    localStorage.removeItem('vocabulary-view-mode')
    localStorage.removeItem('vocabulary-review-history')
    location.reload()
  }
}

// 清除复习历史
const clearReviewHistory = () => {
  if (confirm('确定要清除复习历史吗？')) {
    localStorage.removeItem('vocabulary-review-history')
    alert('复习历史已清除')
  }
}

onMounted(() => {
  // 加载复习间隔设置
  const savedIntervals = localStorage.getItem('vocabulary-review-intervals')
  if (savedIntervals) {
    reviewIntervals.value = JSON.parse(savedIntervals)
  }
  
  // 保存复习间隔设置
  const saveIntervals = () => {
    localStorage.setItem('vocabulary-review-intervals', JSON.stringify(reviewIntervals.value))
  }
  
  // 监听设置变化
  const unwatch = ref(reviewIntervals.value)
  unwatch.value = reviewIntervals.value
  saveIntervals()
})
</script>
