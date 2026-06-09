<template>
  <div class="exploration-view page-shell">
    <div class="page-container">
      <!-- Header - 优化：静态内容使用 v-once -->
      <div class="mb-12" v-once>
        <h1 class="page-title mb-2">
          智能探索
        </h1>
        <p class="page-subtitle">
          使用AI驱动的语义搜索，跨模态发现隐藏洞察
        </p>
      </div>

      <!-- Search Bar -->
      <AppCard variant="elevated" class="mb-8">
        <div class="flex gap-4">
          <div class="flex-1">
            <AppInput
              v-model="searchQuery"
              placeholder="搜索关键词，如: 语音唤醒问题、用户反馈、竞品分析..."
              @keyup.enter="handleSearch"
            >
              <template #suffix>
                <button
                  @click="handleSearch"
                  class="text-cursor-accent hover:text-cursor-accent-hover transition-colors"
                >
                  🔍
                </button>
              </template>
            </AppInput>
          </div>
          <AppButton @click="handleSearch" :loading="isSearching">
            搜索
          </AppButton>
        </div>

        <template #footer>
          <div class="flex items-center gap-2 flex-wrap" v-once>
            <span class="text-2xs text-cursor-fg-muted">热门搜索:</span>
            <button
              v-for="tag in popularTags"
              :key="tag"
              @click="quickSearch(tag)"
              class="px-3 py-1 rounded-full bg-cursor-panel hover:bg-cursor-border text-xs text-cursor-fg transition-colors duration-200"
            >
              {{ tag }}
            </button>
          </div>
        </template>
      </AppCard>

      <!-- Search Results -->
      <div v-if="hasSearched">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-bold mb-1">搜索结果</h2>
            <p class="text-2xs text-cursor-fg-muted">
              找到 <span class="text-cursor-accent font-semibold">{{ searchResults.length }}</span> 个相关结果
              <span v-if="searchTime" class="ml-2">(耗时 {{ searchTime }}ms)</span>
            </p>
          </div>
          
          <div class="flex gap-2">
            <AppButton
              v-for="filter in filters"
              :key="filter.type"
              size="sm"
              :variant="activeFilter === filter.type ? 'primary' : 'ghost'"
              @click="activeFilter = filter.type"
            >
              {{ filter.icon }} {{ filter.label }}
            </AppButton>
          </div>
        </div>

        <!-- Results Grid -->
        <div v-if="filteredResults.length > 0" class="space-y-4">
          <AppCard
            v-for="result in filteredResults"
            :key="result.id"
            variant="outlined"
            :hoverable="true"
            class="cursor-pointer"
          >
            <div class="flex gap-6">
              <!-- Thumbnail -->
              <div class="flex-shrink-0">
                <div class="w-20 h-20 rounded-cursor bg-cursor-accent-muted flex items-center justify-center text-4xl">
                  {{ result.thumbnail }}
                </div>
              </div>

              <!-- Content -->
              <div class="flex-1 min-w-0">
                <div class="flex items-start justify-between mb-2">
                  <div class="flex-1">
                    <h3 class="text-lg font-semibold mb-1">{{ result.title }}</h3>
                    <div class="flex items-center gap-3 text-xs text-cursor-fg-muted">
                      <AppBadge size="sm" :variant="getTypeVariant(result.type)">
                        {{ getTypeLabel(result.type) }}
                      </AppBadge>
                      <span v-if="result.timestamp">{{ result.timestamp }}</span>
                      <span>相关度: {{ getRelevancePercent(result.relevance) }}%</span>
                    </div>
                  </div>
                  
                  <!-- Relevance Score -->
                  <div class="flex-shrink-0 ml-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-cursor-accent">
                        {{ getRelevancePercent(result.relevance) }}
                      </div>
                      <div class="text-xs text-cursor-fg-muted">匹配度</div>
                    </div>
                  </div>
                </div>

                <p class="text-sm text-cursor-fg line-clamp-2 mb-3">
                  {{ result.snippet }}
                </p>

                <div class="flex items-center justify-between">
                  <div class="flex gap-2">
                    <AppButton size="sm" variant="outline">
                      查看详情
                    </AppButton>
                    <AppButton size="sm" variant="ghost">
                      添加到数据集
                    </AppButton>
                  </div>
                  
                  <div class="text-xs text-cursor-fg-muted">
                    相关标签: AI分析 • 用户洞察
                  </div>
                </div>
              </div>
            </div>
          </AppCard>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="text-6xl mb-4">🔍</div>
          <h3 class="text-xl font-semibold mb-2">没有找到匹配的结果</h3>
          <p class="text-cursor-fg-muted">试试其他关键词或使用热门搜索标签</p>
        </div>
      </div>

      <!-- Empty State (No Search) - 优化：静态内容，移除bounce -->
      <div v-else class="text-center py-16" v-once>
        <div class="text-8xl mb-6">💡</div>
        <h2 class="text-2xl font-bold mb-4">开始你的智能探索之旅</h2>
        <p class="page-subtitle mb-8 max-w-2xl mx-auto">
          输入关键词，AI将为你在海量多模态数据中找到最相关的洞察
        </p>
        <div class="flex items-center justify-center gap-4">
          <div class="text-center">
            <div class="text-3xl mb-2">🎥</div>
            <div class="text-2xs text-cursor-fg-muted">视频内容</div>
          </div>
          <div class="text-cursor-fg-subtle">+</div>
          <div class="text-center">
            <div class="text-3xl mb-2">📄</div>
            <div class="text-2xs text-cursor-fg-muted">文档报告</div>
          </div>
          <div class="text-cursor-fg-subtle">+</div>
          <div class="text-center">
            <div class="text-3xl mb-2">🖼️</div>
            <div class="text-2xs text-cursor-fg-muted">图片设计</div>
          </div>
          <div class="text-cursor-fg-subtle">=</div>
          <div class="text-center">
            <div class="text-3xl mb-2">✨</div>
            <div class="text-2xs text-cursor-fg-muted">跨模态洞察</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppInput from '@/components/atoms/AppInput.vue'
import { mockAPI } from '@/api/mock/mockAPI'
import type { SearchResult } from '@/api/mock/mockData'
import { debounce } from '@/utils/debounce'

const searchQuery = ref('')
const searchResults = ref<SearchResult[]>([])
const isSearching = ref(false)
const hasSearched = ref(false)
const searchTime = ref(0)
const activeFilter = ref<string>('all')

// 防抖搜索 - 优化性能
const debouncedSearch = debounce(async (query: string) => {
  if (!query.trim()) {
    searchResults.value = []
    hasSearched.value = false
    return
  }
  
  isSearching.value = true
  hasSearched.value = true
  const startTime = Date.now()
  
  try {
    searchResults.value = await mockAPI.search(query)
    searchTime.value = Date.now() - startTime
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isSearching.value = false
  }
}, 400)

// 监听搜索查询变化，自动触发防抖搜索
watch(searchQuery, (newQuery) => {
  debouncedSearch(newQuery)
})

const popularTags = ['语音唤醒问题', '竞品分析', '用户反馈', '界面设计', '专利技术']

const filters = [
  { type: 'all', label: '全部', icon: '🔍' },
  { type: 'video', label: '视频', icon: '🎥' },
  { type: 'document', label: '文档', icon: '📄' },
  { type: 'image', label: '图片', icon: '🖼️' }
]

const filteredResults = computed(() => {
  if (activeFilter.value === 'all') {
    return searchResults.value
  }
  return searchResults.value.filter(result => result.type === activeFilter.value)
})

const handleSearch = () => {
  // 立即执行搜索（用于点击按钮或回车）
  if (!searchQuery.value.trim()) return
  debouncedSearch(searchQuery.value)
}

const quickSearch = (tag: string) => {
  searchQuery.value = tag
  // 快速搜索立即触发，不使用防抖
  handleSearch()
}

const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    video: '视频',
    document: '文档',
    image: '图片',
    audio: '音频'
  }
  return labels[type] || type
}

const getTypeVariant = (type: string): 'info' | 'success' | 'warning' => {
  const variants: Record<string, 'info' | 'success' | 'warning'> = {
    video: 'info',
    document: 'success',
    image: 'warning'
  }
  return variants[type] || 'info'
}

const getRelevancePercent = (relevance: number): string => {
  return (relevance * 100).toFixed(0)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
