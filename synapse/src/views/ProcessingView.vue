<template>
  <div class="processing-view page-shell">
    <div class="page-container">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="page-title mb-2">
          数据处理中心
        </h1>
        <p class="page-subtitle mb-6">
          实时监控AI数据处理流程 - 特征提取、向量化、知识图谱构建
        </p>
        
        <!-- 导航标签 -->
        <div class="flex gap-3 flex-wrap">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-2 rounded-cursor text-sm font-medium transition-all"
            :class="activeTab === tab.id 
              ? 'bg-cursor-accent text-white ' 
              : 'bg-cursor-surface text-cursor-fg hover:bg-cursor-border/50'"
          >
            {{ tab.icon }} {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Tab: 实时监控 -->
      <div v-if="activeTab === 'monitor'" class="space-y-8">
        <!-- Processing Queue -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Processing Stages -->
          <div class="lg:col-span-2">
            <AppCard variant="elevated">
              <template #header>
                <div class="flex items-center justify-between">
                  <h2 class="text-xl font-semibold">处理流程</h2>
                  <AppBadge variant="info">{{ activeProcessing }}/{{ totalAssets }} 处理中</AppBadge>
                </div>
              </template>

              <div class="space-y-6">
                <div
                  v-for="stage in processingStages"
                  :key="stage.id"
                  class="relative"
                >
                  <div class="flex items-center gap-4 mb-2">
                    <div
                      class="w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300"
                      :class="stage.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : stage.status === 'processing' 
                        ? 'bg-cursor-accent-muted text-cursor-accent animate-pulse' 
                        : 'bg-cursor-border text-cursor-fg-muted'"
                    >
                      {{ stage.icon }}
                    </div>
                    <div class="flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <h3 class="font-semibold">{{ stage.label }}</h3>
                        <span class="text-2xs text-cursor-fg-muted">{{ stage.duration }}</span>
                      </div>
                      <AppProgress
                        :value="stage.progress"
                        :animated="stage.status === 'processing'"
                        :variant="stage.status === 'completed' ? 'success' : 'primary'"
                        :show-label="false"
                      />
                    </div>
                  </div>
                  
                  <!-- Stage Details -->
                  <div v-if="stage.status === 'processing'" class="ml-14 mt-2 text-2xs text-cursor-fg-muted">
                    <p>{{ stage.details }}</p>
                  </div>
                </div>
              </div>
            </AppCard>
          </div>

          <!-- Processing Stats -->
          <div class="space-y-6">
            <AppCard variant="elevated">
              <template #header>
                <h3 class="font-semibold">实时统计</h3>
              </template>
              
              <div class="space-y-4">
                <div>
                  <div class="text-3xl font-bold text-cursor-accent mb-1">{{ stats.processed }}</div>
                  <div class="text-2xs text-cursor-fg-muted">已处理资产</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-secondary-400 mb-1">{{ stats.speed }}</div>
                  <div class="text-2xs text-cursor-fg-muted">处理速度（个/分钟）</div>
                </div>
                <div>
                  <div class="text-3xl font-bold text-accent-400 mb-1">{{ stats.accuracy }}%</div>
                  <div class="text-2xs text-cursor-fg-muted">特征提取准确率</div>
                </div>
              </div>
            </AppCard>

            <AppCard variant="elevated">
              <template #header>
                <h3 class="font-semibold">系统状态</h3>
              </template>
              
              <div class="space-y-3">
                <div class="flex items-center justify-between">
                  <span class="text-sm">CPU使用率</span>
                  <span class="text-sm font-medium">{{ systemStatus.cpu.toFixed(2) }}%</span>
                </div>
                <AppProgress :value="systemStatus.cpu" :show-label="false" />
                
                <div class="flex items-center justify-between">
                  <span class="text-sm">内存使用率</span>
                  <span class="text-sm font-medium">{{ systemStatus.memory.toFixed(2) }}%</span>
                </div>
                <AppProgress :value="systemStatus.memory" :show-label="false" variant="warning" />
                
                <div class="flex items-center justify-between">
                  <span class="text-sm">GPU利用率</span>
                  <span class="text-sm font-medium">{{ systemStatus.gpu.toFixed(2) }}%</span>
                </div>
                <AppProgress :value="systemStatus.gpu" :show-label="false" variant="success" />
              </div>
            </AppCard>
          </div>
        </div>

        <!-- Knowledge Graph -->
        <AppCard variant="elevated">
          <template #header>
            <div>
              <h2 class="text-xl font-semibold mb-1">知识图谱构建</h2>
              <p class="text-2xs text-cursor-fg-muted">自动识别实体和关系，构建知识网络</p>
            </div>
          </template>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-6 rounded-cursor bg-cursor-panel border border-cursor-border">
              <div class="text-4xl mb-3">🏷️</div>
              <div class="text-3xl font-bold text-cursor-accent mb-2">{{ knowledgeGraph.entities }}</div>
              <div class="text-2xs text-cursor-fg-muted">识别实体</div>
              <div class="mt-3 text-xs text-cursor-fg-muted">
                产品、功能、人物、品牌等
              </div>
            </div>

            <div class="p-6 rounded-cursor bg-cursor-panel border border-cursor-border">
              <div class="text-4xl mb-3">🔗</div>
              <div class="text-3xl font-bold text-secondary-400 mb-2">{{ knowledgeGraph.relations }}</div>
              <div class="text-2xs text-cursor-fg-muted">关系连接</div>
              <div class="mt-3 text-xs text-cursor-fg-muted">
                依赖、对比、因果等关系
              </div>
            </div>

            <div class="p-6 rounded-cursor bg-cursor-panel border border-cursor-border">
              <div class="text-4xl mb-3">💡</div>
              <div class="text-3xl font-bold text-accent-400 mb-2">{{ knowledgeGraph.insights }}</div>
              <div class="text-2xs text-cursor-fg-muted">洞察生成</div>
              <div class="mt-3 text-xs text-cursor-fg-muted">
                自动发现的关键洞察
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between">
              <span class="text-2xs text-cursor-fg-muted">最后更新: 刚刚</span>
              <AppButton size="sm" variant="outline" @click="showKnowledgeGraph = true">
                查看完整图谱 →
              </AppButton>
            </div>
          </template>
        </AppCard>
      </div>

      <!-- Tab: 技术架构 -->
      <div v-if="activeTab === 'architecture'" class="space-y-8">
        <TechArchitecture />
      </div>

      <!-- Tab: 特征提取 -->
      <div v-if="activeTab === 'extraction'" class="space-y-8">
        <FeatureExtractionDemo />
      </div>

      <!-- Tab: Ray实现 -->
      <div v-if="activeTab === 'ray'" class="space-y-8">
        <RayCodeDemo />
      </div>

      <!-- Tab: 向量空间 -->
      <div v-if="activeTab === 'vector'" class="space-y-8">
        <VectorVisualization />
      </div>

      <!-- Tab: 数据存储 -->
      <div v-if="activeTab === 'storage'" class="space-y-8">
        <VectorDatabaseDemo />
      </div>
    </div>

    <!-- Knowledge Graph Modal -->
    <KnowledgeGraphModal
      v-model="showKnowledgeGraph"
      :graph-data="mockKnowledgeGraph"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppProgress from '@/components/atoms/AppProgress.vue'
import TechArchitecture from '@/components/organisms/TechArchitecture.vue'
import FeatureExtractionDemo from '@/components/organisms/FeatureExtractionDemo.vue'
import RayCodeDemo from '@/components/organisms/RayCodeDemo.vue'
import VectorVisualization from '@/components/organisms/VectorVisualization.vue'
import VectorDatabaseDemo from '@/components/organisms/VectorDatabaseDemo.vue'
import KnowledgeGraphModal from '@/components/organisms/KnowledgeGraphModal.vue'
import { mockKnowledgeGraph } from '@/api/mock/mockData'

interface ProcessingStage {
  id: string
  label: string
  icon: string
  progress: number
  status: 'pending' | 'processing' | 'completed'
  duration: string
  details?: string
}

// 标签页配置
const tabs = [
  { id: 'monitor', label: '实时监控', icon: '📊' },
  { id: 'architecture', label: '技术架构', icon: '🏗️' },
  { id: 'extraction', label: '特征提取', icon: '🧬' },
  { id: 'ray', label: 'Ray实现', icon: '⚡' },
  { id: 'vector', label: '向量空间', icon: '🌌' },
  { id: 'storage', label: '数据存储', icon: '🗄️' }
]

const activeTab = ref('monitor')
const showKnowledgeGraph = ref(false)

const processingStages = ref<ProcessingStage[]>([
  {
    id: '1',
    label: '文件上传',
    icon: '📤',
    progress: 100,
    status: 'completed',
    duration: '2.3s'
  },
  {
    id: '2',
    label: '内容提取',
    icon: '📝',
    progress: 100,
    status: 'completed',
    duration: '8.7s'
  },
  {
    id: '3',
    label: '特征提取',
    icon: '🧬',
    progress: 75,
    status: 'processing',
    duration: '进行中',
    details: '正在使用BERT模型提取语义特征...'
  },
  {
    id: '4',
    label: '向量化',
    icon: '🎯',
    progress: 45,
    status: 'processing',
    duration: '等待中',
    details: '生成768维度的特征向量...'
  },
  {
    id: '5',
    label: '索引构建',
    icon: '🗂️',
    progress: 0,
    status: 'pending',
    duration: '等待中'
  }
])

const stats = ref({
  processed: 1347,
  speed: 12.54,
  accuracy: 98.7
})

const systemStatus = ref({
  cpu: 67,
  memory: 82,
  gpu: 94
})

const knowledgeGraph = ref({
  entities: 1892,
  relations: 3456,
  insights: 127
})

const activeProcessing = computed(() => {
  return processingStages.value.filter(s => s.status === 'processing').length
})

const totalAssets = ref(5)

let interval: number

onMounted(() => {
  // 模拟实时更新
  interval = window.setInterval(() => {
    // 更新进度
    processingStages.value.forEach(stage => {
      if (stage.status === 'processing' && stage.progress < 100) {
        stage.progress = Math.min(100, stage.progress + Math.random() * 10)
        if (stage.progress === 100) {
          stage.status = 'completed'
        }
      }
    })

    // 更新统计数据
    stats.value.processed += Math.floor(Math.random() * 2)
    stats.value.speed = Number((12 + Math.random() * 2).toFixed(2))

    // 更新系统状态
    systemStatus.value.cpu = Math.min(100, Math.max(50, systemStatus.value.cpu + (Math.random() - 0.5) * 10))
    systemStatus.value.memory = Math.min(100, Math.max(60, systemStatus.value.memory + (Math.random() - 0.5) * 5))
    systemStatus.value.gpu = Math.min(100, Math.max(70, systemStatus.value.gpu + (Math.random() - 0.5) * 8))
  }, 2000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>
