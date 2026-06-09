<template>
  <AppCard variant="elevated">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold mb-1">🧬 多模态特征提取</h2>
          <p class="text-2xs text-cursor-fg-muted">不同数据类型的AI特征提取方法</p>
        </div>
        <div class="flex gap-2">
          <AppButton
            v-for="type in dataTypes"
            :key="type.id"
            size="sm"
            :variant="selectedType === type.id ? 'primary' : 'ghost'"
            @click="selectedType = type.id"
          >
            {{ type.icon }} {{ type.label }}
          </AppButton>
        </div>
      </div>
    </template>

    <div class="space-y-6">
      <!-- 数据类型展示 -->
      <div class="grid grid-cols-2 gap-6">
        <!-- 左侧：输入示例 -->
        <div>
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>📥</span>
            <span>输入数据</span>
          </h3>
          <div class="bg-cursor-panel rounded-cursor p-4 border border-cursor-border">
            <div v-if="selectedType === 'document'" class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="text-2xl">📄</div>
                <div class="flex-1">
                  <div class="font-medium text-sm mb-2">产品需求文档.pdf</div>
                  <div class="text-xs text-cursor-fg-muted leading-relaxed">
                    "本产品旨在通过AI技术实现多模态数据的智能检索和分析。主要功能包括：
                    1. 支持文档、图片、视频、音频等多种格式
                    2. 自动提取特征向量并建立索引
                    3. 基于语义的相似度搜索..."
                  </div>
                  <div class="mt-3 flex gap-2">
                    <AppBadge size="sm" variant="info">PDF格式</AppBadge>
                    <AppBadge size="sm" variant="info">15页</AppBadge>
                    <AppBadge size="sm" variant="info">2.3MB</AppBadge>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="selectedType === 'image'" class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="text-2xl">🖼️</div>
                <div class="flex-1">
                  <div class="font-medium text-sm mb-2">产品架构图.png</div>
                  <div class="w-full h-32 bg-cursor-accent-muted rounded border border-cursor-border flex items-center justify-center text-xs text-cursor-fg-muted">
                    [架构图预览]<br/>包含：前端层、API层、处理层、存储层
                  </div>
                  <div class="mt-3 flex gap-2">
                    <AppBadge size="sm" variant="info">PNG格式</AppBadge>
                    <AppBadge size="sm" variant="info">1920x1080</AppBadge>
                    <AppBadge size="sm" variant="info">850KB</AppBadge>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="selectedType === 'audio'" class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="text-2xl">🎵</div>
                <div class="flex-1">
                  <div class="font-medium text-sm mb-2">产品会议录音.mp3</div>
                  <div class="w-full p-3 bg-cursor-surface rounded border border-cursor-border">
                    <div class="flex items-center gap-3 mb-2">
                      <div class="w-8 h-8 rounded-full bg-cursor-accent-muted flex items-center justify-center text-cursor-accent">▶</div>
                      <div class="flex-1 h-1 bg-cursor-border rounded-full overflow-hidden">
                        <div class="h-full w-1/3 bg-primary-500"></div>
                      </div>
                      <span class="text-xs text-cursor-fg-muted">05:32</span>
                    </div>
                    <div class="text-xs text-cursor-fg-muted">
                      "大家好，今天我们讨论一下新版本的核心功能..."
                    </div>
                  </div>
                  <div class="mt-3 flex gap-2">
                    <AppBadge size="sm" variant="info">MP3格式</AppBadge>
                    <AppBadge size="sm" variant="info">15:32</AppBadge>
                    <AppBadge size="sm" variant="info">5.2MB</AppBadge>
                  </div>
                </div>
              </div>
            </div>

            <div v-else-if="selectedType === 'video'" class="space-y-3">
              <div class="flex items-start gap-3">
                <div class="text-2xl">🎬</div>
                <div class="flex-1">
                  <div class="font-medium text-sm mb-2">产品演示视频.mp4</div>
                  <div class="w-full h-32 bg-cursor-accent-muted rounded border border-cursor-border flex items-center justify-center">
                    <div class="text-center">
                      <div class="text-3xl mb-2">▶️</div>
                      <div class="text-xs text-cursor-fg-muted">视频预览</div>
                    </div>
                  </div>
                  <div class="mt-3 flex gap-2">
                    <AppBadge size="sm" variant="info">MP4格式</AppBadge>
                    <AppBadge size="sm" variant="info">1080p</AppBadge>
                    <AppBadge size="sm" variant="info">8:45</AppBadge>
                    <AppBadge size="sm" variant="info">125MB</AppBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 右侧：提取的特征 -->
        <div>
          <h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>📊</span>
            <span>提取特征</span>
          </h3>
          <div class="bg-cursor-panel rounded-cursor p-4 border border-cursor-border space-y-4">
            <!-- 特征向量 -->
            <div>
              <div class="text-xs font-medium text-cursor-fg-muted mb-2">特征向量 (768维)</div>
              <div class="bg-cursor-surface rounded p-3 font-mono text-xs text-cursor-fg max-h-24 overflow-y-auto">
                [{{ currentFeatures.vector.slice(0, 8).map(v => v.toFixed(4)).join(', ') }}, ..., 
                {{ currentFeatures.vector.slice(-4).map(v => v.toFixed(4)).join(', ') }}]
              </div>
              <div class="mt-2 text-xs text-cursor-fg-muted">
                使用 {{ currentFeatures.model }} 模型提取
              </div>
            </div>

            <!-- 语义标签 -->
            <div>
              <div class="text-xs font-medium text-cursor-fg-muted mb-2">语义标签</div>
              <div class="flex flex-wrap gap-2">
                <AppBadge
                  v-for="tag in currentFeatures.tags"
                  :key="tag"
                  size="sm"
                  variant="success"
                >
                  {{ tag }}
                </AppBadge>
              </div>
            </div>

            <!-- 关键实体 -->
            <div>
              <div class="text-xs font-medium text-cursor-fg-muted mb-2">关键实体</div>
              <div class="space-y-2">
                <div
                  v-for="entity in currentFeatures.entities"
                  :key="entity.name"
                  class="flex items-center justify-between text-xs"
                >
                  <span class="text-cursor-fg">{{ entity.name }}</span>
                  <AppBadge size="sm">{{ entity.type }}</AppBadge>
                </div>
              </div>
            </div>

            <!-- 置信度 -->
            <div>
              <div class="text-xs font-medium text-cursor-fg-muted mb-2">提取置信度</div>
              <div class="flex items-center gap-2">
                <AppProgress
                  :value="currentFeatures.confidence"
                  size="sm"
                  variant="success"
                  :show-label="false"
                />
                <span class="text-sm font-semibold text-green-400">
                  {{ currentFeatures.confidence }}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术说明 -->
      <div class="bg-cursor-surface rounded-cursor p-4 border border-cursor-accent/20">
        <div class="flex items-start gap-3">
          <div class="text-2xl">💡</div>
          <div class="flex-1 space-y-2">
            <h4 class="font-semibold text-sm">{{ currentFeatures.technique.title }}</h4>
            <p class="text-xs text-cursor-fg leading-relaxed">
              {{ currentFeatures.technique.description }}
            </p>
            <div class="flex gap-2">
              <AppBadge
                v-for="tech in currentFeatures.technique.tech"
                :key="tech"
                size="sm"
                variant="info"
              >
                {{ tech }}
              </AppBadge>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppProgress from '@/components/atoms/AppProgress.vue'

const dataTypes = [
  { id: 'document', label: '文档', icon: '📄' },
  { id: 'image', label: '图片', icon: '🖼️' },
  { id: 'audio', label: '音频', icon: '🎵' },
  { id: 'video', label: '视频', icon: '🎬' }
]

const selectedType = ref<string>('document')

// 模拟不同类型的特征数据
const featuresMap = {
  document: {
    vector: Array.from({ length: 768 }, () => Math.random() * 2 - 1),
    model: 'BERT-base-chinese',
    tags: ['产品文档', 'AI技术', '多模态', '需求分析', '功能设计'],
    entities: [
      { name: 'AI技术', type: '技术' },
      { name: '多模态数据', type: '概念' },
      { name: '语义搜索', type: '功能' },
      { name: '向量索引', type: '技术' }
    ],
    confidence: 96.8,
    technique: {
      title: '文档特征提取技术',
      description: '使用BERT预训练模型对文本进行编码，生成768维的语义向量表示。通过Transformer架构捕捉上下文关系，实现深层语义理解。同时使用NER模型识别关键实体，提取结构化信息。',
      tech: ['BERT', 'Transformer', 'NER', 'Word2Vec']
    }
  },
  image: {
    vector: Array.from({ length: 768 }, () => Math.random() * 2 - 1),
    model: 'ResNet-50 + CLIP',
    tags: ['架构图', '技术文档', '系统设计', '分层架构', '可视化'],
    entities: [
      { name: '前端层', type: '模块' },
      { name: 'API层', type: '模块' },
      { name: '处理层', type: '模块' },
      { name: '存储层', type: '模块' }
    ],
    confidence: 94.2,
    technique: {
      title: '图像特征提取技术',
      description: '使用ResNet-50提取视觉特征，CLIP模型实现图文联合编码。通过卷积神经网络捕捉图像的层次化特征，从边缘到纹理再到语义对象。OCR技术识别图中文字，目标检测识别关键元素。',
      tech: ['ResNet-50', 'CLIP', 'CNN', 'OCR', 'YOLO']
    }
  },
  audio: {
    vector: Array.from({ length: 768 }, () => Math.random() * 2 - 1),
    model: 'Whisper + Wav2Vec2',
    tags: ['会议录音', '产品讨论', '需求评审', '团队协作', '语音转文本'],
    entities: [
      { name: '新版本', type: '版本' },
      { name: '核心功能', type: '功能' },
      { name: '产品经理', type: '角色' },
      { name: '技术方案', type: '文档' }
    ],
    confidence: 92.5,
    technique: {
      title: '音频特征提取技术',
      description: '首先使用Whisper模型进行高精度语音转文本(ASR)，然后对转录文本使用BERT提取语义特征。Wav2Vec2直接从音频波形学习表示，捕捉说话人特征、情感、语调等副语言信息。',
      tech: ['Whisper', 'Wav2Vec2', 'ASR', 'MFCC', 'Speaker Embedding']
    }
  },
  video: {
    vector: Array.from({ length: 768 }, () => Math.random() * 2 - 1),
    model: 'VideoMAE + CLIP',
    tags: ['产品演示', '功能展示', '用户界面', '交互流程', '视觉设计'],
    entities: [
      { name: '登录界面', type: '界面' },
      { name: '数据看板', type: '功能' },
      { name: '搜索功能', type: '功能' },
      { name: '可视化图表', type: '组件' }
    ],
    confidence: 89.7,
    technique: {
      title: '视频特征提取技术',
      description: '采用多模态融合策略：VideoMAE提取时序视觉特征，CLIP进行视频-文本联合编码。关键帧提取算法识别重要场景，目标跟踪算法追踪主要对象。音频轨道使用ASR转录，与视觉特征融合。',
      tech: ['VideoMAE', 'CLIP', 'I3D', '关键帧提取', 'Multi-modal Fusion']
    }
  }
}

const currentFeatures = computed(() => featuresMap[selectedType.value as keyof typeof featuresMap])
</script>

