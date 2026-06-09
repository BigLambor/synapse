<template>
  <div class="ingestion-view page-shell">
    <div class="page-container">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="page-title mb-2">
          数据入湖
        </h1>
        <p class="page-subtitle">
          多种数据源接入方式，AI自动处理并构建知识图谱
        </p>
      </div>

      <!-- 数据源方式选择 -->
      <div class="mb-8">
        <div class="flex items-center gap-4 overflow-x-auto pb-2">
          <button
            v-for="source in dataSources"
            :key="source.type"
            @click="currentSource = source.type"
            :class="[
              'flex items-center gap-3 px-6 py-4 rounded-cursor transition-all whitespace-nowrap',
              currentSource === source.type
                ? 'bg-cursor-accent text-white '
                : 'bg-cursor-surface text-cursor-fg-muted hover:bg-cursor-panel hover:text-cursor-fg'
            ]"
          >
            <span class="text-2xl">{{ source.icon }}</span>
            <div class="text-left">
              <div class="font-semibold">{{ source.name }}</div>
              <div class="text-xs opacity-75">{{ source.description }}</div>
            </div>
          </button>
        </div>
      </div>

      <!-- Web上传 -->
      <div v-show="currentSource === 'web_upload'">
        <AppCard variant="elevated" class="mb-8">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">📤 本地文件上传</h2>
              <div class="text-2xs text-cursor-fg-muted">
                支持大文件、断点续传、批量上传
              </div>
            </div>
          </template>

          <div
            class="border-2 border-dashed rounded-cursor p-12 text-center transition-all duration-300"
            :class="isDragging 
              ? 'border-cursor-accent bg-cursor-accent-muted scale-[1.02]' 
              : 'border-cursor-border hover:border-cursor-border'"
            @dragover.prevent="isDragging = true"
            @dragleave.prevent="isDragging = false"
            @drop.prevent="handleDrop"
          >
            <div class="text-6xl mb-4">📁</div>
            <h3 class="text-xl font-semibold mb-2">拖拽文件到此处</h3>
            <p class="text-cursor-fg-muted mb-6">
              或者 <label class="text-cursor-accent hover:text-cursor-accent-hover cursor-pointer underline">
                <input
                  type="file"
                  multiple
                  class="hidden"
                  @change="handleFileSelect"
                  accept=".pdf,.doc,.docx,.txt,.mp4,.avi,.mov,.jpg,.jpeg,.png,.mp3,.wav"
                />
                点击选择文件
              </label>
            </p>
            <div class="flex items-center justify-center gap-6 text-2xs text-cursor-fg-muted">
              <span>📄 文档</span>
              <span>🎥 视频</span>
              <span>🖼️ 图片</span>
              <span>🎵 音频</span>
            </div>
            <div class="mt-6 text-2xs text-cursor-fg-muted">
              支持最大 {{ formatSize(uploadConfig.maxFileSize) }} 的文件 • 自动分片上传大文件
            </div>
          </div>

          <template #footer v-if="activeUploads.length > 0">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-4">
                <span class="text-2xs text-cursor-fg-muted">
                  上传中: {{ activeUploads.length }} 个文件
                </span>
                <div class="w-48 h-2 bg-cursor-border rounded-full overflow-hidden">
                  <div
                    class="h-full bg-gradient-to-r from-cursor-accent to-cursor-accent-hover transition-all"
                    :style="{ width: totalUploadProgress + '%' }"
                  />
                </div>
                <span class="text-2xs text-cursor-fg-muted">{{ Math.floor(totalUploadProgress) }}%</span>
              </div>
              <AppButton size="sm" variant="ghost" @click="dataSourceStore.clearCompletedTasks()">
                清理已完成
              </AppButton>
            </div>
          </template>
        </AppCard>
      </div>

      <!-- URL导入 -->
      <div v-show="currentSource === 'url_import'">
        <AppCard variant="elevated" class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">🔗 URL导入</h2>
          </template>

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-cursor-fg mb-2">
                输入文件URL（支持批量，每行一个）
              </label>
              <textarea
                v-model="urlInput"
                rows="5"
                placeholder="https://example.com/video.mp4&#10;https://example.com/document.pdf&#10;https://example.com/image.png"
                class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 resize-none"
              />
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-cursor-fg mb-2">分类</label>
                <input
                  v-model="urlCategory"
                  type="text"
                  placeholder="例如: 用户反馈"
                  class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-cursor-fg mb-2">标签（逗号分隔）</label>
                <input
                  v-model="urlTags"
                  type="text"
                  placeholder="例如: 视频, 语音"
                  class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                />
              </div>
            </div>

            <AppButton @click="handleURLImport" :disabled="!urlInput.trim()" class="w-full">
              🚀 开始导入
            </AppButton>
          </div>
        </AppCard>
      </div>

      <!-- 对象存储集成 -->
      <div v-show="currentSource === 's3' || currentSource === 'oss' || currentSource === 'minio'">
        <AppCard variant="elevated" class="mb-8">
          <template #header>
            <h2 class="text-xl font-semibold">☁️ 对象存储集成</h2>
          </template>

          <div class="space-y-6">
            <!-- 已配置的数据源 -->
            <div v-if="activeDataSources.length > 0">
              <h3 class="text-sm font-medium text-cursor-fg mb-3">已配置的数据源</h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  v-for="ds in activeDataSources"
                  :key="ds.id"
                  class="p-4 bg-cursor-surface border border-cursor-border rounded-cursor hover:border-cursor-accent/50 transition-all"
                >
                  <div class="flex items-start justify-between mb-3">
                    <div>
                      <h4 class="font-semibold text-cursor-fg">{{ ds.name }}</h4>
                      <p class="text-xs text-cursor-fg-muted mt-1">{{ ds.description }}</p>
                    </div>
                    <AppBadge
                      :variant="ds.status === 'connected' ? 'success' : 'warning'"
                      size="sm"
                    >
                      {{ getStatusText(ds.status) }}
                    </AppBadge>
                  </div>

                  <div class="grid grid-cols-2 gap-3 mb-3 text-sm">
                    <div>
                      <div class="text-cursor-fg-muted">文件数</div>
                      <div class="text-cursor-fg font-semibold">{{ ds.statistics.syncedFiles.toLocaleString() }}</div>
                    </div>
                    <div>
                      <div class="text-cursor-fg-muted">总大小</div>
                      <div class="text-cursor-fg font-semibold">{{ formatSize(ds.statistics.syncedSize) }}</div>
                    </div>
                  </div>

                  <div class="flex items-center justify-between">
                    <span class="text-xs text-cursor-fg-muted">
                      最后同步: {{ formatRelativeTime(ds.lastSyncAt) }}
                    </span>
                    <AppButton
                      size="sm"
                      variant="ghost"
                      @click="handleSync(ds.id)"
                      :disabled="ds.status === 'syncing'"
                    >
                      {{ ds.status === 'syncing' ? '同步中...' : '立即同步' }}
                    </AppButton>
                  </div>
                </div>
              </div>
            </div>

            <!-- 添加新数据源 -->
            <div>
              <AppButton @click="showDataSourceModal = true" class="w-full">
                ➕ 配置新的对象存储
              </AppButton>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- 上传队列 -->
      <div v-if="allTasks.length > 0" class="mb-8">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">处理队列</h2>
          <div class="flex items-center gap-2">
            <AppBadge variant="info">{{ allTasks.length }} 个任务</AppBadge>
            <AppButton size="sm" variant="ghost" @click="dataSourceStore.clearCompletedTasks()">
              清理已完成
            </AppButton>
          </div>
        </div>

        <div class="space-y-4">
          <AppCard
            v-for="task in allTasks"
            :key="task.id"
            variant="outlined"
          >
            <div class="flex items-center gap-4">
              <div class="text-4xl">{{ getTaskIcon(task) }}</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold truncate">{{ getTaskName(task) }}</h3>
                <p class="text-2xs text-cursor-fg-muted">{{ getTaskSize(task) }}</p>
                
                <!-- 进度条 -->
                <div v-if="isTaskActive(task)" class="mt-2">
                  <div class="flex items-center justify-between text-xs text-cursor-fg-muted mb-1">
                    <span>{{ getTaskStatusText(task) }}</span>
                    <div class="flex items-center gap-3">
                      <span v-if="'speed' in task.progress && task.progress.speed">
                        {{ formatSpeed(task.progress.speed) }}
                      </span>
                      <span>{{ task.progress.percentage }}%</span>
                    </div>
                  </div>
                  <div class="w-full h-2 bg-cursor-border rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-cursor-accent to-cursor-accent-hover transition-all duration-300"
                      :style="{ width: task.progress.percentage + '%' }"
                    />
                  </div>
                </div>
              </div>
              
              <!-- 状态和操作 -->
              <div class="flex items-center gap-2">
                <AppBadge
                  :variant="getTaskBadgeVariant(task)"
                >
                  {{ getTaskStatusText(task) }}
                </AppBadge>
                
                <!-- 操作按钮 -->
                <button
                  v-if="canPauseTask(task)"
                  @click="handlePauseTask(task)"
                  class="p-2 text-cursor-fg-muted hover:text-cursor-fg hover:bg-cursor-panel rounded-cursor transition-all"
                  title="暂停"
                >
                  ⏸
                </button>
                <button
                  v-if="canResumeTask(task)"
                  @click="handleResumeTask(task)"
                  class="p-2 text-cursor-fg-muted hover:text-cursor-fg hover:bg-cursor-panel rounded-cursor transition-all"
                  title="继续"
                >
                  ▶️
                </button>
                <button
                  v-if="canCancelTask(task)"
                  @click="handleCancelTask(task)"
                  class="p-2 text-cursor-fg-muted hover:text-red-400 hover:bg-cursor-panel rounded-cursor transition-all"
                  title="取消"
                >
                  ✕
                </button>
              </div>
            </div>
          </AppCard>
        </div>
      </div>

      <!-- 近期资产 -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">近期资产</h2>
          <AppButton variant="ghost" size="sm">查看全部 →</AppButton>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AppCard
            v-for="asset in recentAssets"
            :key="asset.id"
            variant="outlined"
            :hoverable="true"
          >
            <div class="flex items-start gap-4">
              <div class="text-4xl">{{ asset.thumbnail }}</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold text-sm mb-1 truncate">{{ asset.name }}</h3>
                <p class="text-xs text-cursor-fg-muted mb-2">
                  {{ formatDate(asset.uploadDate) }}
                </p>
                <div class="flex flex-wrap gap-1">
                  <AppBadge
                    v-for="tag in asset.tags.slice(0, 2)"
                    :key="tag"
                    size="sm"
                  >
                    {{ tag }}
                  </AppBadge>
                  <AppBadge v-if="asset.tags.length > 2" size="sm" variant="default">
                    +{{ asset.tags.length - 2 }}
                  </AppBadge>
                </div>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>

    <!-- 数据源配置Modal -->
    <DataSourceConfigModal
      v-if="showDataSourceModal"
      :show="showDataSourceModal"
      :source-type="currentSource"
      @close="showDataSourceModal = false"
      @created="handleDataSourceCreated"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useDataSourceStore } from '@/stores/dataSource'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import DataSourceConfigModal from '@/components/organisms/DataSourceConfigModal.vue'
import { mockAPI } from '@/api/mock/mockAPI'
import type { Asset } from '@/api/mock/mockData'
import { DataSourceType, DataSourceStatus, UploadMethod } from '@/types/enums'
import type { Domain } from '@/types/models'

const dataSourceStore = useDataSourceStore()

// ============================================
// 数据源选择
// ============================================

const dataSources = [
  {
    type: 'web_upload',
    name: 'Web上传',
    icon: '📤',
    description: '本地文件拖拽或选择'
  },
  {
    type: 'url_import',
    name: 'URL导入',
    icon: '🔗',
    description: '从URL下载导入'
  },
  {
    type: 's3',
    name: 'S3存储',
    icon: '☁️',
    description: 'AWS S3或兼容存储'
  },
  {
    type: 'oss',
    name: '阿里云OSS',
    icon: '☁️',
    description: '阿里云对象存储'
  },
  {
    type: 'minio',
    name: 'MinIO',
    icon: '🗄️',
    description: '私有化对象存储'
  }
]

const currentSource = ref<string>('web_upload')

// ============================================
// Web上传
// ============================================

const isDragging = ref(false)
const { uploadConfig, activeUploads, totalUploadProgress } = dataSourceStore

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  uploadFiles(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  uploadFiles(files)
}

const uploadFiles = async (files: File[]) => {
  await dataSourceStore.uploadFiles(files, {
    method: UploadMethod.DRAG_DROP,
    tags: ['Web上传']
  })
}

// ============================================
// URL导入
// ============================================

const urlInput = ref('')
const urlCategory = ref('')
const urlTags = ref('')

const handleURLImport = async () => {
  const urls = urlInput.value.split('\n').filter(u => u.trim())
  const tags = urlTags.value.split(',').map(t => t.trim()).filter(t => t)
  
  await dataSourceStore.importFromURLs(urls, {
    category: urlCategory.value || undefined,
    tags: tags.length > 0 ? tags : undefined
  })
  
  // 清空输入
  urlInput.value = ''
  urlCategory.value = ''
  urlTags.value = ''
}

// ============================================
// 对象存储
// ============================================

const showDataSourceModal = ref(false)
const { activeDataSources } = dataSourceStore

const handleSync = async (dataSourceId: string) => {
  await dataSourceStore.triggerSync(dataSourceId)
}

const handleDataSourceCreated = () => {
  showDataSourceModal.value = false
  dataSourceStore.fetchDataSources()
}

// ============================================
// 任务管理
// ============================================

const allTasks = computed(() => {
  return [
    ...dataSourceStore.uploadTasks,
    ...dataSourceStore.urlImportTasks
  ].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
})

const isTaskActive = (task: Domain.UploadTask | Domain.URLImportTask) => {
  return task.status === 'uploading' || task.status === 'downloading' || task.status === 'processing'
}

const canPauseTask = (task: Domain.UploadTask | Domain.URLImportTask) => {
  return 'method' in task && task.status === 'uploading'
}

const canResumeTask = (task: Domain.UploadTask | Domain.URLImportTask) => {
  return 'method' in task && task.status === 'paused'
}

const canCancelTask = (task: Domain.UploadTask | Domain.URLImportTask) => {
  return task.status === 'pending' || task.status === 'paused'
}

const handlePauseTask = (task: Domain.UploadTask | Domain.URLImportTask) => {
  if ('method' in task) {
    dataSourceStore.pauseUpload(task.id)
  }
}

const handleResumeTask = (task: Domain.UploadTask | Domain.URLImportTask) => {
  if ('method' in task) {
    dataSourceStore.resumeUpload(task.id)
  }
}

const handleCancelTask = (task: Domain.UploadTask | Domain.URLImportTask) => {
  if ('method' in task) {
    dataSourceStore.cancelUpload(task.id)
  }
}

const getTaskIcon = (task: Domain.UploadTask | Domain.URLImportTask) => {
  if ('file' in task) {
    const file = task.file
    if (file.type.startsWith('video/')) return '🎥'
    if (file.type.startsWith('image/')) return '🖼️'
    if (file.type.startsWith('audio/')) return '🎵'
    if (file.type.includes('pdf')) return '📄'
    return '📁'
  }
  return '🔗'
}

const getTaskName = (task: Domain.UploadTask | Domain.URLImportTask) => {
  if ('file' in task) {
    return task.file.name
  }
  return task.fileName || task.url.split('/').pop() || '未知文件'
}

const getTaskSize = (task: Domain.UploadTask | Domain.URLImportTask) => {
  if ('file' in task) {
    return formatSize(task.file.size)
  }
  return task.progress.totalBytes > 0 ? formatSize(task.progress.totalBytes) : '未知大小'
}

const getTaskStatusText = (task: Domain.UploadTask | Domain.URLImportTask) => {
  const statusMap: Record<string, string> = {
    pending: '等待中',
    uploading: '上传中',
    downloading: '下载中',
    processing: '处理中',
    completed: '已完成',
    failed: '失败',
    paused: '已暂停'
  }
  return statusMap[task.status] || task.status
}

const getTaskBadgeVariant = (task: Domain.UploadTask | Domain.URLImportTask) => {
  if (task.status === 'completed') return 'success'
  if (task.status === 'failed') return 'error'
  if (task.status === 'paused') return 'warning'
  return 'info'
}

// ============================================
// 近期资产
// ============================================

const recentAssets = ref<Asset[]>([])

onMounted(async () => {
  const assets = await mockAPI.getAssets()
  recentAssets.value = assets.slice(0, 6)
  await dataSourceStore.fetchDataSources()
})

// ============================================
// 工具函数
// ============================================

const formatSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB'
}

const formatSpeed = (bytesPerSec: number): string => {
  return formatSize(bytesPerSec) + '/s'
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

const formatRelativeTime = (dateStr?: string): string => {
  if (!dateStr) return '从未'
  return formatDate(dateStr)
}

const getStatusText = (status: DataSourceStatus): string => {
  const statusMap: Record<DataSourceStatus, string> = {
    [DataSourceStatus.CONNECTED]: '已连接',
    [DataSourceStatus.DISCONNECTED]: '未连接',
    [DataSourceStatus.SYNCING]: '同步中',
    [DataSourceStatus.ERROR]: '错误',
    [DataSourceStatus.CONFIGURING]: '配置中'
  }
  return statusMap[status] || status
}
</script>
