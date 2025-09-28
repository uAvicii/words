<template>
  <div class="space-y-8">
    <!-- 欢迎标题 -->
    <div class="text-center">
      <h1 class="text-4xl font-bold text-gray-900 mb-4">
        📚 专属背单词
      </h1>
      <p class="text-xl text-gray-600">
        快速浏览 + 分类记忆 + 多轮高频复习
      </p>
    </div>

    <!-- 今日统计 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="card text-center">
        <div class="text-3xl font-bold text-blue-600 mb-2">
          {{ todayStats.total }}
        </div>
        <div class="text-gray-600">总单词数</div>
      </div>
      
      <div class="card text-center">
        <div class="text-3xl font-bold text-green-600 mb-2">
          {{ todayStats.mastered }}
        </div>
        <div class="text-gray-600">已掌握</div>
      </div>
      
      <div class="card text-center">
        <div class="text-3xl font-bold text-orange-600 mb-2">
          {{ todayStats.toReview }}
        </div>
        <div class="text-gray-600">今日需复习</div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">学习进度</h3>
      <div class="w-full bg-gray-200 rounded-full h-4">
        <div 
          class="bg-blue-600 h-4 rounded-full transition-all duration-300"
          :style="{ width: `${todayStats.progress}%` }"
        ></div>
      </div>
      <div class="text-sm text-gray-600 mt-2">
        已掌握 {{ todayStats.mastered }} / {{ todayStats.total }} 个单词 ({{ todayStats.progress }}%)
      </div>
    </div>

    <!-- 分类统计 -->
    <div class="card">
      <h3 class="text-lg font-semibold mb-4">单词分类统计</h3>
      <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div class="text-center">
          <div class="w-12 h-12 bg-familiar-simple rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {{ wordsByCategory['familiar-simple'].length }}
          </div>
          <div class="text-sm text-gray-600">熟悉-简单</div>
        </div>
        
        <div class="text-center">
          <div class="w-12 h-12 bg-familiar-forget rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {{ wordsByCategory['familiar-forget'].length }}
          </div>
          <div class="text-sm text-gray-600">熟悉-可能忘记</div>
        </div>
        
        <div class="text-center">
          <div class="w-12 h-12 bg-new-word rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {{ wordsByCategory['new-word'].length }}
          </div>
          <div class="text-sm text-gray-600">生词</div>
        </div>
        
        <div class="text-center">
          <div class="w-12 h-12 bg-confused rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {{ wordsByCategory['confused'].length }}
          </div>
          <div class="text-sm text-gray-600">易混淆</div>
        </div>
        
        <div class="text-center">
          <div class="w-12 h-12 bg-mastered rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold">
            {{ wordsByCategory['mastered'].length }}
          </div>
          <div class="text-sm text-gray-600">已掌握</div>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">快速开始</h3>
        <div class="space-y-3">
          <router-link 
            to="/browse" 
            class="block w-full btn-primary text-center"
          >
            📖 浏览单词
          </router-link>
          
          <router-link 
            to="/review" 
            class="block w-full btn-secondary text-center"
            :class="{ 'opacity-50 pointer-events-none': todayStats.toReview === 0 }"
          >
            🔄 开始复习 ({{ todayStats.toReview }})
          </router-link>
        </div>
      </div>
      
      <div class="card">
        <h3 class="text-lg font-semibold mb-4">学习建议</h3>
        <div class="space-y-2 text-sm text-gray-600">
          <div v-if="todayStats.toReview > 0">
            💡 今日有 {{ todayStats.toReview }} 个单词需要复习
          </div>
          <div v-else>
            🎉 太棒了！今日复习任务已完成
          </div>
          <div v-if="wordsByCategory['new-word'].length > 0">
            📝 还有 {{ wordsByCategory['new-word'].length }} 个生词待分类
          </div>
          <div v-if="wordsByCategory['confused'].length > 0">
            ⚠️ 有 {{ wordsByCategory['confused'].length }} 个易混淆词需要特别练习
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useWordStore } from '../stores/wordStore'

const wordStore = useWordStore()
const { todayStats, wordsByCategory } = wordStore
</script>