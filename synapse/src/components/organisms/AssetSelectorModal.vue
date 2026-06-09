<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[60] overflow-y-auto"
        @click.self="handleCancel"
      >
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black/60 "></div>

        <!-- Modal内容 -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            class="relative w-full max-w-7xl bg-cursor-panel rounded-cursor  border border-cursor-border overflow-hidden flex flex-col max-h-[90vh]"
            @click.stop
          >
            <!-- 头部 -->
            <div class="px-8 py-6 border-b border-cursor-border bg-cursor-panel flex-shrink-0">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-semibold text-cursor-fg mb-1">
                    🗂️ 从数据湖选择资产
                  </h2>
                  <p class="text-cursor-fg-muted text-sm">
                    选择已经处理完成的多模态资产添加到数据集
                  </p>
                </div>
                <button
                  class="text-cursor-fg-muted hover:text-cursor-fg transition-colors p-2 hover:bg-cursor-panel rounded-cursor"
                  @click="handleCancel"
                >
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- 统计信息 -->
              <div class="mt-4 flex items-center gap-6 text-sm">
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span class="text-cursor-fg font-semibold">已选: {{ selectedAssets.length }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span class="text-cursor-fg">可用: {{ availableAssets.length }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
                  <span class="text-cursor-fg">
                    总大小: {{ formatSize(selectedTotalSize) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 筛选和搜索栏 -->
            <div class="px-8 py-4 border-b border-cursor-border bg-cursor-panel flex-shrink-0">
              <div class="flex flex-col md:flex-row gap-3">
                <!-- 搜索框 -->
                <div class="flex-1 relative">
                  <input
                    v-model="searchQuery"
                    type="text"
                    placeholder="搜索资产名称、标签..."
                    class="w-full px-4 py-2.5 pl-10 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 text-sm"
                  />
                  <svg
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cursor-fg-muted"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>

                <!-- 类型筛选 -->
                <select
                  v-model="typeFilter"
                  class="px-4 py-2.5 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 text-sm min-w-[140px]"
                >
                  <option value="">所有类型</option>
                  <option value="video">🎥 视频</option>
                  <option value="document">📄 文档</option>
                  <option value="image">🖼️ 图片</option>
                  <option value="audio">🎵 音频</option>
                </select>

                <!-- 状态筛选 -->
                <select
                  v-model="statusFilter"
                  class="px-4 py-2.5 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 text-sm min-w-[140px]"
                >
                  <option value="">所有状态</option>
                  <option value="completed">✅ 已完成</option>
                  <option value="processing">⏳ 处理中</option>
                </select>

                <!-- 排序 -->
                <select
                  v-model="sortBy"
                  class="px-4 py-2.5 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 text-sm min-w-[140px]"
                >
                  <option value="uploadDate">最新上传</option>
                  <option value="name">名称</option>
                  <option value="size">大小</option>
                </select>
              </div>

              <!-- 快速操作 -->
              <div class="mt-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <button
                    class="px-3 py-1.5 text-xs bg-cursor-panel hover:bg-cursor-border text-cursor-fg hover:text-cursor-fg rounded-cursor transition-all"
                    @click="selectAll"
                  >
                    全选当前页
                  </button>
                  <button
                    class="px-3 py-1.5 text-xs bg-cursor-panel hover:bg-cursor-border text-cursor-fg hover:text-cursor-fg rounded-cursor transition-all"
                    @click="clearSelection"
                    :disabled="selectedAssets.length === 0"
                  >
                    清除选择
                  </button>
                  <button
                    class="px-3 py-1.5 text-xs bg-cursor-panel hover:bg-cursor-border text-cursor-fg hover:text-cursor-fg rounded-cursor transition-all"
                    @click="invertSelection"
                  >
                    反选
                  </button>
                </div>
                <div class="text-xs text-cursor-fg-muted">
                  显示 {{ filteredAssets.length }} / {{ allAssets.length }} 个资产
                </div>
              </div>
            </div>

            <!-- 资产列表 -->
            <div class="flex-1 overflow-y-auto px-8 py-6">
              <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-cursor-accent"></div>
              </div>

              <div v-else-if="filteredAssets.length === 0" class="text-center py-20">
                <div class="text-6xl mb-4">🔍</div>
                <h3 class="text-xl font-semibold text-cursor-fg mb-2">未找到匹配的资产</h3>
                <p class="text-cursor-fg-muted">尝试调整筛选条件或搜索关键词</p>
              </div>

              <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div
                  v-for="asset in paginatedAssets"
                  :key="asset.id"
                  :class="[
                    'relative bg-cursor-surface rounded-cursor border-2 transition-all duration-200 cursor-pointer overflow-hidden group',
                    isSelected(asset.id)
                      ? 'border-cursor-accent bg-cursor-accent-muted '
                      : 'border-cursor-border hover:border-cursor-border'
                  ]"
                  @click="toggleAsset(asset)"
                >
                  <!-- 选中标记 -->
                  <div
                    v-if="isSelected(asset.id)"
                    class="absolute top-2 right-2 z-10 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center "
                  >
                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                    </svg>
                  </div>

                  <!-- 资产缩略图/图标 -->
                  <div class="aspect-video bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center text-5xl">
                    {{ asset.thumbnail }}
                  </div>

                  <!-- 资产信息 -->
                  <div class="p-3">
                    <h4 class="text-sm font-medium text-cursor-fg truncate mb-1 group-hover:text-cursor-accent transition-colors">
                      {{ asset.name }}
                    </h4>
                    
                    <div class="flex items-center justify-between text-xs text-cursor-fg-muted mb-2">
                      <span>{{ formatSize(asset.size) }}</span>
                      <span>{{ formatDate(asset.uploadDate) }}</span>
                    </div>

                    <!-- 状态标记 -->
                    <div class="flex items-center gap-1.5">
                      <span
                        :class="[
                          'px-2 py-0.5 rounded text-xs font-medium',
                          asset.status === 'completed'
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-yellow-500/20 text-yellow-400'
                        ]"
                      >
                        {{ asset.status === 'completed' ? '已完成' : '处理中' }}
                      </span>
                      <span
                        v-if="asset.progress < 100"
                        class="text-xs text-cursor-fg-muted"
                      >
                        {{ asset.progress }}%
                      </span>
                    </div>

                    <!-- 标签 -->
                    <div v-if="asset.tags.length > 0" class="mt-2 flex flex-wrap gap-1">
                      <span
                        v-for="tag in asset.tags.slice(0, 2)"
                        :key="tag"
                        class="px-1.5 py-0.5 bg-cursor-border/50 text-cursor-fg-muted text-xs rounded"
                      >
                        {{ tag }}
                      </span>
                      <span
                        v-if="asset.tags.length > 2"
                        class="px-1.5 py-0.5 bg-cursor-border/50 text-cursor-fg-muted text-xs rounded"
                      >
                        +{{ asset.tags.length - 2 }}
                      </span>
                    </div>
                  </div>

                  <!-- 选择遮罩 -->
                  <div
                    v-if="isSelected(asset.id)"
                    class="absolute inset-0 bg-primary-500/5 pointer-events-none"
                  ></div>
                </div>
              </div>

              <!-- 分页 -->
              <div v-if="totalPages > 1" class="mt-6 flex items-center justify-center gap-2">
                <button
                  class="px-3 py-2 bg-cursor-panel hover:bg-cursor-border text-white rounded-cursor transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="currentPage === 1"
                  @click="currentPage--"
                >
                  ← 上一页
                </button>
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    :class="[
                      'px-3 py-2 rounded-cursor transition-all',
                      page === currentPage
                        ? 'bg-cursor-accent text-white'
                        : 'bg-cursor-panel hover:bg-cursor-border text-cursor-fg'
                    ]"
                    @click="currentPage = page"
                  >
                    {{ page }}
                  </button>
                </div>
                <button
                  class="px-3 py-2 bg-cursor-panel hover:bg-cursor-border text-white rounded-cursor transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="currentPage === totalPages"
                  @click="currentPage++"
                >
                  下一页 →
                </button>
              </div>
            </div>

            <!-- 底部操作栏 -->
            <div class="px-8 py-6 border-t border-cursor-border bg-cursor-panel flex items-center justify-between flex-shrink-0">
              <div class="text-2xs text-cursor-fg-muted">
                已选择 <span class="text-cursor-fg font-semibold">{{ selectedAssets.length }}</span> 个资产
                <span v-if="selectedAssets.length > 0">
                  · 共 <span class="text-cursor-fg font-semibold">{{ formatSize(selectedTotalSize) }}</span>
                </span>
              </div>

              <div class="flex items-center gap-3">
                <button
                  class="px-6 py-3 text-cursor-fg hover:text-cursor-fg hover:bg-cursor-panel rounded-cursor transition-all"
                  @click="handleCancel"
                >
                  取消
                </button>
                <button
                  class="px-8 py-3 bg-cursor-accent text-white rounded-cursor  transition-all  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  :disabled="selectedAssets.length === 0"
                  @click="handleConfirm"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  确认选择 ({{ selectedAssets.length }})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { mockAPI } from '@/api/mock/mockAPI'
import type { Asset } from '@/api/mock/mockData'

// Props
const props = defineProps<{
  show: boolean
  initialSelection?: string[] // 初始选中的资产ID
}>()

// Emits
const emit = defineEmits<{
  close: []
  confirm: [assetIds: string[], assets: Asset[]]
}>()

// 响应式状态
const allAssets = ref<Asset[]>([])
const selectedAssets = ref<string[]>([])
const isLoading = ref(false)

// 筛选和搜索
const searchQuery = ref('')
const typeFilter = ref('')
const statusFilter = ref('completed') // 默认只显示已完成的
const sortBy = ref<'uploadDate' | 'name' | 'size'>('uploadDate')

// 分页
const currentPage = ref(1)
const itemsPerPage = 16

// 可用的资产（只显示已完成处理的）
const availableAssets = computed(() => {
  return allAssets.value.filter(asset => asset.status === 'completed')
})

// 过滤后的资产
const filteredAssets = computed(() => {
  let result = [...allAssets.value]

  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(asset => asset.status === statusFilter.value)
  }

  // 类型筛选
  if (typeFilter.value) {
    result = result.filter(asset => asset.type === typeFilter.value)
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(asset =>
      asset.name.toLowerCase().includes(query) ||
      asset.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }

  // 排序
  result.sort((a, b) => {
    switch (sortBy.value) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'size':
        return b.size - a.size
      case 'uploadDate':
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    }
  })

  return result
})

// 分页相关
const totalPages = computed(() => Math.ceil(filteredAssets.value.length / itemsPerPage))

const paginatedAssets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredAssets.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, currentPage.value - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages.value, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// 选中的资产总大小
const selectedTotalSize = computed(() => {
  return selectedAssets.value.reduce((total, assetId) => {
    const asset = allAssets.value.find(a => a.id === assetId)
    return total + (asset?.size || 0)
  }, 0)
})

// 方法
const isSelected = (assetId: string) => {
  return selectedAssets.value.includes(assetId)
}

const toggleAsset = (asset: Asset) => {
  // 只允许选择已完成的资产
  if (asset.status !== 'completed') {
    alert('⚠️ 只能选择已完成处理的资产')
    return
  }

  const index = selectedAssets.value.indexOf(asset.id)
  if (index > -1) {
    selectedAssets.value.splice(index, 1)
  } else {
    selectedAssets.value.push(asset.id)
  }
}

const selectAll = () => {
  const pageAssetIds = paginatedAssets.value
    .filter(asset => asset.status === 'completed')
    .map(asset => asset.id)
  
  pageAssetIds.forEach(id => {
    if (!selectedAssets.value.includes(id)) {
      selectedAssets.value.push(id)
    }
  })
}

const clearSelection = () => {
  selectedAssets.value = []
}

const invertSelection = () => {
  const pageAssetIds = paginatedAssets.value
    .filter(asset => asset.status === 'completed')
    .map(asset => asset.id)
  
  const newSelection = pageAssetIds.filter(id => !selectedAssets.value.includes(id))
  const keptSelection = selectedAssets.value.filter(id => !pageAssetIds.includes(id))
  
  selectedAssets.value = [...keptSelection, ...newSelection]
}

const handleConfirm = () => {
  const selectedAssetObjects = allAssets.value.filter(asset =>
    selectedAssets.value.includes(asset.id)
  )
  emit('confirm', selectedAssets.value, selectedAssetObjects)
  emit('close')
}

const handleCancel = () => {
  if (selectedAssets.value.length > 0) {
    if (confirm('确定要取消吗？已选择的资产将被清空。')) {
      emit('close')
    }
  } else {
    emit('close')
  }
}

// 格式化函数
const formatSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  
  if (hours < 1) return '刚刚'
  if (hours < 24) return `${hours}小时前`
  return `${Math.floor(hours / 24)}天前`
}

// 加载资产
const loadAssets = async () => {
  isLoading.value = true
  try {
    allAssets.value = await mockAPI.getAssets()
    
    // 如果有初始选择，应用它
    if (props.initialSelection && props.initialSelection.length > 0) {
      selectedAssets.value = [...props.initialSelection]
    }
  } catch (error) {
    console.error('加载资产失败:', error)
    alert('❌ 加载资产失败，请重试')
  } finally {
    isLoading.value = false
  }
}

// 监听显示状态
watch(() => props.show, (newVal) => {
  if (newVal) {
    loadAssets()
    currentPage.value = 1
    searchQuery.value = ''
    typeFilter.value = ''
    statusFilter.value = 'completed'
    sortBy.value = 'uploadDate'
  } else {
    // 关闭时清空选择（如果需要保留，可以注释掉这行）
    // selectedAssets.value = []
  }
})

// 重置到第一页当筛选条件改变时
watch([searchQuery, typeFilter, statusFilter, sortBy], () => {
  currentPage.value = 1
})

// 初始加载
onMounted(() => {
  if (props.show) {
    loadAssets()
  }
})
</script>

<style scoped>
/* Modal动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>

