<template>
  <div class="ingestion-view min-h-screen bg-gradient-to-br from-neutral-950 via-primary-900/10 to-neutral-950">
    <div class="container mx-auto px-6 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
          数据入湖
        </h1>
        <p class="text-lg text-neutral-400">
          上传多模态数据，AI自动提取特征并构建知识图谱
        </p>
      </div>

      <!-- Upload Area -->
      <AppCard variant="elevated" class="mb-8">
        <template #header>
          <h2 class="text-xl font-semibold">上传文件</h2>
        </template>

        <div
          class="border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300"
          :class="isDragging 
            ? 'border-primary-500 bg-primary-500/10' 
            : 'border-neutral-700 hover:border-neutral-600'"
          @dragover.prevent="isDragging = true"
          @dragleave.prevent="isDragging = false"
          @drop.prevent="handleDrop"
        >
          <div class="text-6xl mb-4">📁</div>
          <h3 class="text-xl font-semibold mb-2">拖拽文件到此处</h3>
          <p class="text-neutral-400 mb-6">
            或者 <label class="text-primary-400 hover:text-primary-300 cursor-pointer underline">
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
          <div class="flex items-center justify-center gap-6 text-sm text-neutral-500">
            <span>📄 文档</span>
            <span>🎥 视频</span>
            <span>🖼️ 图片</span>
            <span>🎵 音频</span>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between text-sm">
            <span class="text-neutral-500">支持最大 500MB 的文件</span>
            <AppButton 
              size="sm" 
              variant="ghost"
              @click="uploadAll"
              :disabled="uploadQueue.length === 0"
            >
              上传全部 ({{ uploadQueue.length }})
            </AppButton>
          </div>
        </template>
      </AppCard>

      <!-- Upload Queue -->
      <div v-if="uploadQueue.length > 0" class="mb-8">
        <h2 class="text-2xl font-bold mb-6">上传队列</h2>
        <div class="space-y-4">
          <AppCard
            v-for="item in uploadQueue"
            :key="item.id"
            variant="outlined"
          >
            <div class="flex items-center gap-4">
              <div class="text-4xl">{{ item.thumbnail }}</div>
              <div class="flex-1 min-w-0">
                <h3 class="font-semibold truncate">{{ item.name }}</h3>
                <p class="text-sm text-neutral-500">{{ formatSize(item.size) }}</p>
                
                <!-- Progress Bar -->
                <div v-if="item.status === 'processing'" class="mt-2">
                  <div class="flex items-center justify-between text-xs text-neutral-400 mb-1">
                    <span>处理中...</span>
                    <span>{{ item.progress }}%</span>
                  </div>
                  <div class="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      class="h-full bg-gradient-to-r from-primary-500 to-secondary-500 transition-all duration-300"
                      :style="{ width: item.progress + '%' }"
                    />
                  </div>
                </div>

                <!-- Tags -->
                <div v-if="item.status === 'completed' && item.tags.length > 0" class="flex gap-2 mt-2">
                  <AppBadge v-for="tag in item.tags" :key="tag" size="sm" variant="info">
                    {{ tag }}
                  </AppBadge>
                </div>
              </div>
              
              <!-- Status -->
              <div>
                <AppBadge
                  :variant="item.status === 'completed' ? 'success' : item.status === 'failed' ? 'error' : 'warning'"
                >
                  {{ getStatusText(item.status) }}
                </AppBadge>
              </div>
            </div>
          </AppCard>
        </div>
      </div>

      <!-- Recent Assets -->
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
                <p class="text-xs text-neutral-500 mb-2">
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import { mockAPI } from '@/api/mock/mockAPI'
import type { Asset } from '@/api/mock/mockData'

const isDragging = ref(false)
const uploadQueue = ref<Asset[]>([])
const recentAssets = ref<Asset[]>([])

onMounted(async () => {
  // 加载近期资产
  const assets = await mockAPI.getAssets()
  recentAssets.value = assets.slice(0, 6)
})

const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  const files = Array.from(event.dataTransfer?.files || [])
  addFilesToQueue(files)
}

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  addFilesToQueue(files)
}

const addFilesToQueue = async (files: File[]) => {
  for (const file of files) {
    const asset = await mockAPI.uploadFile(file)
    uploadQueue.value.push(asset)
    
    // 模拟处理进度
    mockAPI.subscribeToProgress(asset.id, (progress) => {
      const item = uploadQueue.value.find(a => a.id === asset.id)
      if (item) {
        item.progress = progress
        if (progress === 100) {
          item.status = 'completed'
          // 添加模拟标签
          item.tags = ['AI处理', '已索引', '可搜索']
        }
      }
    })
  }
}

const uploadAll = () => {
  // 所有文件都会自动处理
  console.log('Uploading all files...')
}

const formatSize = (bytes: number): string => {
  const mb = bytes / 1024 / 1024
  return mb.toFixed(1) + ' MB'
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

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    processing: '处理中',
    completed: '已完成',
    failed: '失败'
  }
  return statusMap[status] || status
}
</script>
