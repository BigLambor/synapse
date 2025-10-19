<template>
  <div class="dataset-view min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900">
    <!-- 页面头部 -->
    <div class="border-b border-neutral-700/50 bg-neutral-900/80 backdrop-blur-sm sticky top-0 z-10">
      <div class="container mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-white mb-2">
              🎯 训练数据集管理
            </h1>
            <p class="text-neutral-400">
              为AI训练平台提供高质量、标准化的数据集 - 数据湖的核心价值输出
            </p>
          </div>
          
          <div class="flex gap-3">
            <button
              class="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-blue-500/50 flex items-center gap-2"
              @click="goToPublishDemo"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              发布流程演示
            </button>
            <button
              class="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 text-white rounded-lg hover:from-primary-700 hover:to-primary-600 transition-all duration-200 shadow-lg hover:shadow-primary-500/50 flex items-center gap-2"
              @click="showCreateModal = true"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              创建新数据集
            </button>
          </div>
        </div>
        
        <!-- 统计卡片 -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div
            v-for="stat in statsCards"
            :key="stat.label"
            class="bg-neutral-800/50 backdrop-blur-sm rounded-lg p-4 border border-neutral-700/30"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-neutral-400 text-sm">{{ stat.label }}</span>
              <span class="text-2xl">{{ stat.icon }}</span>
            </div>
            <div class="text-2xl font-bold text-white">{{ stat.value }}</div>
            <div v-if="stat.subtext" class="text-xs text-neutral-500 mt-1">
              {{ stat.subtext }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div class="container mx-auto px-6 py-8">
      <!-- 过滤和搜索栏 -->
      <div class="flex flex-col md:flex-row gap-4 mb-6">
        <!-- 搜索框 -->
        <div class="flex-1 relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索数据集名称、描述或标签..."
            class="w-full px-4 py-3 pl-12 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50"
          />
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- 状态过滤 -->
        <select
          v-model="statusFilter"
          class="px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <option value="">所有状态</option>
          <option value="published">已发布</option>
          <option value="ready">就绪</option>
          <option value="processing">处理中</option>
          <option value="draft">草稿</option>
        </select>

        <!-- 分类过滤 -->
        <select
          v-model="categoryFilter"
          class="px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <option value="">所有分类</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>

        <!-- 排序 -->
        <select
          v-model="sortBy"
          class="px-4 py-3 bg-neutral-800/50 border border-neutral-700/50 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
        >
          <option value="updatedAt">最近更新</option>
          <option value="createdAt">创建时间</option>
          <option value="name">名称</option>
          <option value="totalAssets">资产数量</option>
        </select>
      </div>

      <!-- 数据集列表 -->
      <div v-if="isLoading" class="flex justify-center items-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>

      <div v-else-if="filteredDatasets.length === 0" class="text-center py-20">
        <div class="text-6xl mb-4">📦</div>
        <h3 class="text-xl font-semibold text-neutral-300 mb-2">暂无数据集</h3>
        <p class="text-neutral-500 mb-6">开始创建您的第一个训练数据集</p>
        <button
          class="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          @click="showCreateModal = true"
        >
          创建数据集
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="dataset in filteredDatasets"
          :key="dataset.id"
          class="bg-neutral-800/30 backdrop-blur-sm rounded-xl border border-neutral-700/30 overflow-hidden hover:border-primary-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer group"
          @click="selectDataset(dataset)"
        >
          <!-- 数据集头部 -->
          <div class="p-6 border-b border-neutral-700/30">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1">
                <h3 class="text-lg font-semibold text-white mb-1 group-hover:text-primary-400 transition-colors">
                  {{ dataset.name }}
                </h3>
                <p class="text-sm text-neutral-400 line-clamp-2">
                  {{ dataset.description }}
                </p>
              </div>
              
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium ml-3 flex-shrink-0',
                  getStatusClass(dataset.status)
                ]"
              >
                {{ getStatusText(dataset.status) }}
              </span>
            </div>

            <!-- 标签 -->
            <div class="flex flex-wrap gap-2 mb-3">
              <span
                v-for="tag in dataset.tags.slice(0, 3)"
                :key="tag"
                class="px-2 py-1 bg-neutral-700/50 text-neutral-300 text-xs rounded-md"
              >
                {{ tag }}
              </span>
              <span
                v-if="dataset.tags.length > 3"
                class="px-2 py-1 bg-neutral-700/50 text-neutral-400 text-xs rounded-md"
              >
                +{{ dataset.tags.length - 3 }}
              </span>
            </div>
          </div>

          <!-- 数据集统计 -->
          <div class="p-6 grid grid-cols-2 gap-4">
            <div>
              <div class="text-neutral-500 text-xs mb-1">总资产</div>
              <div class="text-white font-semibold">{{ dataset.totalAssets }}</div>
            </div>
            <div>
              <div class="text-neutral-500 text-xs mb-1">数据大小</div>
              <div class="text-white font-semibold">{{ formatSize(dataset.statistics.totalSize) }}</div>
            </div>
            <div>
              <div class="text-neutral-500 text-xs mb-1">质量分数</div>
              <div class="flex items-center gap-2">
                <div class="text-white font-semibold">{{ (dataset.quality.accuracy * 100).toFixed(0) }}%</div>
                <div
                  :class="[
                    'w-2 h-2 rounded-full',
                    dataset.quality.accuracy >= 0.9 ? 'bg-green-500' : dataset.quality.accuracy >= 0.7 ? 'bg-yellow-500' : 'bg-red-500'
                  ]"
                ></div>
              </div>
            </div>
            <div>
              <div class="text-neutral-500 text-xs mb-1">导出次数</div>
              <div class="text-white font-semibold">{{ dataset.exports.length }}</div>
            </div>
          </div>

          <!-- 数据集操作 -->
          <div class="px-6 py-4 bg-neutral-900/50 border-t border-neutral-700/30 flex items-center justify-between">
            <div class="text-xs text-neutral-500">
              v{{ dataset.version }} · {{ formatDate(dataset.updatedAt) }}
            </div>
            <button
              class="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
              @click.stop="selectDataset(dataset)"
            >
              查看详情 →
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 数据集详情Modal（后续实现） -->
    <!-- <DatasetDetailModal v-if="selectedDataset" ... /> -->
    
    <!-- 创建数据集Modal -->
    <CreateDatasetModal
      :show="showCreateModal"
      @close="showCreateModal = false"
      @created="handleDatasetCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useDatasetStore } from '@/stores/dataset'
import { DatasetStatus } from '@/types/enums'
import type { Domain } from '@/types/models'
import CreateDatasetModal from '@/components/organisms/CreateDatasetModal.vue'

// Router
const router = useRouter()

// Store
const datasetStore = useDatasetStore()

// 响应式状态
const searchQuery = ref('')
const statusFilter = ref('')
const categoryFilter = ref('')
const sortBy = ref<'updatedAt' | 'createdAt' | 'name' | 'totalAssets'>('updatedAt')
const showCreateModal = ref(false)
const selectedDataset = ref<Domain.Dataset | null>(null)

// 计算属性
const isLoading = computed(() => datasetStore.isLoading)
const statistics = computed(() => datasetStore.statistics)
const categories = computed(() => datasetStore.categories)

// 统计卡片
const statsCards = computed(() => [
  {
    label: '数据集总数',
    value: statistics.value.total,
    icon: '📊',
    subtext: `${statistics.value.published} 个已发布`
  },
  {
    label: '总资产数',
    value: statistics.value.totalAssets.toLocaleString(),
    icon: '🗂️',
    subtext: '跨所有数据集'
  },
  {
    label: '导出次数',
    value: statistics.value.totalExports,
    icon: '📦',
    subtext: '为训练平台服务'
  },
  {
    label: '平均质量',
    value: `${(statistics.value.avgQuality * 100).toFixed(0)}%`,
    icon: '✨',
    subtext: '数据集质量评分'
  }
])

// 过滤后的数据集
const filteredDatasets = computed(() => {
  datasetStore.setFilters({
    status: statusFilter.value ? (statusFilter.value as DatasetStatus) : null,
    category: categoryFilter.value || null,
    searchQuery: searchQuery.value
  })
  datasetStore.setSorting(sortBy.value, 'desc')
  return datasetStore.filteredDatasets
})

// 方法
const goToPublishDemo = () => {
  router.push('/dataset/publish-demo')
}

const selectDataset = (dataset: Domain.Dataset) => {
  selectedDataset.value = dataset
  // TODO: 打开详情Modal
  console.log('Selected dataset:', dataset)
}

const handleDatasetCreated = async (datasetId: string) => {
  console.log('Dataset created:', datasetId)
  // 重新加载数据集列表
  await datasetStore.fetchDatasets()
  
  // 滚动到顶部显示新创建的数据集
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const getStatusClass = (status: DatasetStatus) => {
  const classMap = {
    [DatasetStatus.PUBLISHED]: 'bg-green-500/20 text-green-400',
    [DatasetStatus.READY]: 'bg-blue-500/20 text-blue-400',
    [DatasetStatus.PROCESSING]: 'bg-yellow-500/20 text-yellow-400',
    [DatasetStatus.DRAFT]: 'bg-neutral-500/20 text-neutral-400',
    [DatasetStatus.ARCHIVED]: 'bg-red-500/20 text-red-400'
  }
  return classMap[status] || 'bg-neutral-500/20 text-neutral-400'
}

const getStatusText = (status: DatasetStatus) => {
  const textMap = {
    [DatasetStatus.PUBLISHED]: '已发布',
    [DatasetStatus.READY]: '就绪',
    [DatasetStatus.PROCESSING]: '处理中',
    [DatasetStatus.DRAFT]: '草稿',
    [DatasetStatus.ARCHIVED]: '已归档'
  }
  return textMap[status] || status
}

const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays < 7) return `${diffDays}天前`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}周前`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)}个月前`
  return `${Math.floor(diffDays / 365)}年前`
}

// 生命周期
onMounted(async () => {
  await datasetStore.fetchDatasets()
})

// 监听过滤器变化
watch([searchQuery, statusFilter, categoryFilter], () => {
  // 过滤逻辑由 computed 属性处理
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

