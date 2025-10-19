<template>
  <div class="dataset-publish-flow">
    <!-- 流程标题 -->
    <div class="mb-8">
      <h2 class="text-2xl font-bold text-white mb-2">数据集发布流程演示</h2>
      <p class="text-gray-400">
        真实模拟从创建到发布的完整过程
      </p>
    </div>

    <!-- 流程进度条 -->
    <div class="progress-timeline mb-8">
      <div
        v-for="(stage, index) in stages"
        :key="stage.status"
        class="stage-item"
        :class="{
          active: currentStageIndex === index,
          completed: currentStageIndex > index,
          pending: currentStageIndex < index
        }"
      >
        <div class="stage-icon">
          <span v-if="currentStageIndex > index" class="text-green-400">✓</span>
          <span v-else-if="currentStageIndex === index" class="text-blue-400">{{ index + 1 }}</span>
          <span v-else class="text-gray-500">{{ index + 1 }}</span>
        </div>
        <div class="stage-info">
          <div class="stage-name">{{ stage.name }}</div>
          <div class="stage-status">{{ stage.status }}</div>
        </div>
        <div v-if="index < stages.length - 1" class="stage-connector"></div>
      </div>
    </div>

    <!-- 当前阶段详情 -->
    <div class="stage-details bg-gray-800/50 rounded-xl p-6 mb-6">
      <div class="flex items-start justify-between mb-4">
        <div>
          <h3 class="text-xl font-bold text-white mb-2">
            {{ currentStage.name }}
          </h3>
          <p class="text-gray-400">{{ currentStage.description }}</p>
        </div>
        <div
          class="status-badge"
          :class="{
            'bg-yellow-500/20 text-yellow-400': currentStage.status === 'draft',
            'bg-blue-500/20 text-blue-400': currentStage.status === 'processing',
            'bg-green-500/20 text-green-400': currentStage.status === 'ready',
            'bg-purple-500/20 text-purple-400': currentStage.status === 'published',
            'bg-gray-500/20 text-gray-400': currentStage.status === 'archived'
          }"
        >
          {{ currentStage.statusLabel }}
        </div>
      </div>

      <!-- 进度条 -->
      <div v-if="isProcessing" class="mb-6">
        <div class="flex justify-between text-sm text-gray-400 mb-2">
          <span>{{ processingMessage }}</span>
          <span>{{ processingProgress }}%</span>
        </div>
        <div class="w-full bg-gray-700 rounded-full h-2">
          <div
            class="bg-blue-500 h-2 rounded-full transition-all duration-300"
            :style="{ width: processingProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- 检查清单 -->
      <div v-if="currentStage.checklist.length > 0" class="mb-6">
        <h4 class="text-sm font-semibold text-gray-300 mb-3">检查清单</h4>
        <div class="space-y-2">
          <div
            v-for="(item, idx) in currentStage.checklist"
            :key="idx"
            class="flex items-start gap-3 p-3 bg-gray-700/50 rounded-lg"
          >
            <div
              class="mt-0.5 flex-shrink-0"
              :class="item.checked ? 'text-green-400' : 'text-gray-500'"
            >
              <span v-if="item.checked">✓</span>
              <span v-else>○</span>
            </div>
            <div class="flex-1">
              <div class="text-white text-sm">{{ item.text }}</div>
              <div v-if="item.detail" class="text-xs text-gray-400 mt-1">
                {{ item.detail }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 质量评估结果 -->
      <div v-if="qualityReport && currentStageIndex >= 2" class="mb-6">
        <h4 class="text-sm font-semibold text-gray-300 mb-3">质量评估结果</h4>
        <div class="bg-gray-700/50 rounded-lg p-4">
          <div class="flex items-center justify-between mb-4">
            <span class="text-gray-400">总体质量分数</span>
            <span class="text-2xl font-bold text-white">
              {{ qualityReport.overallScore }}<span class="text-sm text-gray-400">/100</span>
            </span>
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div v-for="(value, key) in qualityReport.metrics" :key="key" class="metric-item">
              <div class="text-xs text-gray-400 mb-1">{{ metricLabels[key] }}</div>
              <div class="flex items-center gap-2">
                <div class="flex-1 bg-gray-600 rounded-full h-1.5">
                  <div
                    class="h-1.5 rounded-full transition-all"
                    :class="value >= 0.9 ? 'bg-green-400' : value >= 0.8 ? 'bg-yellow-400' : 'bg-red-400'"
                    :style="{ width: (value * 100) + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-white font-medium">{{ Math.round(value * 100) }}%</span>
              </div>
            </div>
          </div>

          <!-- 问题列表 -->
          <div v-if="qualityReport.issues.length > 0" class="mb-3">
            <div class="text-xs font-semibold text-gray-300 mb-2">发现的问题</div>
            <div class="space-y-2">
              <div
                v-for="(issue, idx) in qualityReport.issues"
                :key="idx"
                class="flex items-start gap-2 text-xs"
              >
                <span
                  class="px-2 py-0.5 rounded text-xs font-medium"
                  :class="{
                    'bg-red-500/20 text-red-400': issue.severity === 'high',
                    'bg-yellow-500/20 text-yellow-400': issue.severity === 'medium',
                    'bg-blue-500/20 text-blue-400': issue.severity === 'low'
                  }"
                >
                  {{ issue.severity }}
                </span>
                <span class="text-gray-300">{{ issue.description }}</span>
              </div>
            </div>
          </div>

          <!-- 优化建议 -->
          <div v-if="qualityReport.recommendations.length > 0">
            <div class="text-xs font-semibold text-gray-300 mb-2">优化建议</div>
            <ul class="space-y-1">
              <li
                v-for="(rec, idx) in qualityReport.recommendations"
                :key="idx"
                class="text-xs text-gray-400 flex items-start gap-2"
              >
                <span class="text-blue-400">•</span>
                <span>{{ rec }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 数据集统计 -->
      <div v-if="currentDataset" class="grid grid-cols-3 gap-4 mb-6">
        <div class="stat-card">
          <div class="text-gray-400 text-xs mb-1">总资产数</div>
          <div class="text-white text-xl font-bold">{{ currentDataset.totalAssets }}</div>
        </div>
        <div class="stat-card">
          <div class="text-gray-400 text-xs mb-1">数据大小</div>
          <div class="text-white text-xl font-bold">{{ formatBytes(currentDataset.statistics.totalSize) }}</div>
        </div>
        <div class="stat-card">
          <div class="text-gray-400 text-xs mb-1">标注数量</div>
          <div class="text-white text-xl font-bold">{{ currentDataset.statistics.totalAnnotations }}</div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="flex gap-3">
        <button
          v-if="canProceed"
          @click="proceedToNextStage"
          :disabled="isProcessing"
          class="btn-primary"
        >
          <span v-if="isProcessing">处理中...</span>
          <span v-else>{{ currentStage.actionText }}</span>
        </button>

        <button
          v-if="currentStageIndex > 0"
          @click="goToPreviousStage"
          :disabled="isProcessing"
          class="btn-secondary"
        >
          返回上一步
        </button>

        <button
          v-if="currentStageIndex === stages.length - 1"
          @click="reset"
          class="btn-secondary"
        >
          重新开始
        </button>
      </div>
    </div>

    <!-- 日志记录 -->
    <div class="activity-log bg-gray-800/50 rounded-xl p-6">
      <h4 class="text-sm font-semibold text-gray-300 mb-3">活动日志</h4>
      <div class="space-y-2 max-h-60 overflow-y-auto">
        <div
          v-for="(log, idx) in activityLogs"
          :key="idx"
          class="flex items-start gap-3 text-xs"
        >
          <span class="text-gray-500 flex-shrink-0">{{ log.time }}</span>
          <span
            class="px-2 py-0.5 rounded flex-shrink-0"
            :class="{
              'bg-green-500/20 text-green-400': log.type === 'success',
              'bg-blue-500/20 text-blue-400': log.type === 'info',
              'bg-yellow-500/20 text-yellow-400': log.type === 'warning',
              'bg-red-500/20 text-red-400': log.type === 'error'
            }"
          >
            {{ log.type }}
          </span>
          <span class="text-gray-300">{{ log.message }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { Domain } from '@/types/models'
import { DatasetStatus } from '@/types/enums'

// 流程阶段定义
interface Stage {
  name: string
  status: DatasetStatus
  statusLabel: string
  description: string
  actionText: string
  checklist: Array<{
    text: string
    detail?: string
    checked: boolean
  }>
  duration: number // 模拟处理时间（毫秒）
}

const stages = ref<Stage[]>([
  {
    name: '创建草稿',
    status: DatasetStatus.DRAFT,
    statusLabel: '草稿',
    description: '配置数据集基本信息，选择资产并设置标注规则',
    actionText: '开始处理',
    checklist: [
      {
        text: '数据集基本信息已填写',
        detail: '名称: 智能座舱语音指令数据集 | 版本: 1.0.0',
        checked: true
      },
      {
        text: '已选择足够的资产',
        detail: '共选择 850 个资产（视频、音频、文档）',
        checked: true
      },
      {
        text: '标注配置已完成',
        detail: '类型: 分类 + 转录 | 标签: 语音唤醒、触控、UI问题',
        checked: true
      },
      {
        text: '数据划分比例已设置',
        detail: '训练集 80% | 验证集 10% | 测试集 10%',
        checked: true
      },
      {
        text: '标签和分类已配置',
        detail: '分类: 用户反馈分析 | 标签: NLP, 语音交互',
        checked: true
      }
    ],
    duration: 2000
  },
  {
    name: '数据处理',
    status: DatasetStatus.PROCESSING,
    statusLabel: '处理中',
    description: '针对训练任务的专业标注、特征工程和质量初评',
    actionText: '完成处理',
    checklist: [
      {
        text: 'AI任务专属标注完成',
        detail: '针对训练任务的细粒度标注（如边界框、实体位置等）',
        checked: false
      },
      {
        text: '训练特征工程完成',
        detail: '提取针对特定模型的训练特征（区别于入湖时的通用特征）',
        checked: false
      },
      {
        text: '标注质量初评完成',
        detail: '自动评估标注准确性和一致性',
        checked: false
      },
      {
        text: '训练统计信息生成',
        detail: '计算类别分布、样本平衡等训练相关指标',
        checked: false
      }
    ],
    duration: 5000
  },
  {
    name: '质量评估',
    status: DatasetStatus.READY,
    statusLabel: '就绪',
    description: '全面质量评估，生成质量报告并修复问题',
    actionText: '提交审核',
    checklist: [
      {
        text: '六维质量评估完成',
        detail: '完整性、一致性、准确性、标注质量、多样性、平衡度',
        checked: false
      },
      {
        text: '质量问题已修复',
        detail: '处理了类别不平衡和标注缺失问题',
        checked: false
      },
      {
        text: '人工抽检验证',
        detail: '抽检了10%的样本，准确率符合要求',
        checked: false
      },
      {
        text: '质量分数达标',
        detail: '总体质量分数 > 85%',
        checked: false
      }
    ],
    duration: 3000
  },
  {
    name: '审核发布',
    status: DatasetStatus.PUBLISHED,
    statusLabel: '已发布',
    description: '管理员最终审核，发布数据集供AI训练使用',
    actionText: '导出数据集',
    checklist: [
      {
        text: '管理员审核通过',
        detail: '数据质量和标注规范符合标准',
        checked: false
      },
      {
        text: '版本信息确认',
        detail: '版本 v1.0.0 | 发布日期已记录',
        checked: false
      },
      {
        text: '导出配置已设置',
        detail: '格式: COCO, HuggingFace | 平台: PyTorch',
        checked: false
      },
      {
        text: '发布记录已创建',
        detail: '可供AI训练团队下载使用',
        checked: false
      }
    ],
    duration: 2000
  },
  {
    name: '归档管理',
    status: DatasetStatus.ARCHIVED,
    statusLabel: '已归档',
    description: '数据集使用完毕后归档，保留历史记录',
    actionText: '完成',
    checklist: [
      {
        text: '相关训练任务已完成',
        detail: '基于此数据集的模型训练已结束',
        checked: false
      },
      {
        text: '使用统计已记录',
        detail: '导出次数、下载量等数据已保存',
        checked: false
      },
      {
        text: '归档标记已添加',
        detail: '数据集标记为历史版本',
        checked: false
      }
    ],
    duration: 1000
  }
])

// 当前阶段
const currentStageIndex = ref(0)
const currentStage = computed(() => stages.value[currentStageIndex.value])

// 处理状态
const isProcessing = ref(false)
const processingProgress = ref(0)
const processingMessage = ref('')

// 质量报告
const qualityReport = ref<Domain.QualityReport | null>(null)

// 模拟数据集
const currentDataset = ref<Domain.Dataset | null>(null)

// 活动日志
interface ActivityLog {
  time: string
  type: 'success' | 'info' | 'warning' | 'error'
  message: string
}

const activityLogs = ref<ActivityLog[]>([])

// 质量指标标签
const metricLabels: Record<string, string> = {
  completeness: '完整性',
  consistency: '一致性',
  accuracy: '准确性',
  labelQuality: '标注质量',
  diversity: '多样性',
  balance: '平衡度'
}

// 是否可以进行下一步
const canProceed = computed(() => {
  return currentStageIndex.value < stages.value.length - 1
})

// 格式化字节
const formatBytes = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

// 添加日志
const addLog = (type: ActivityLog['type'], message: string) => {
  const now = new Date()
  const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
  activityLogs.value.unshift({ time, type, message })

  // 最多保留50条日志
  if (activityLogs.value.length > 50) {
    activityLogs.value = activityLogs.value.slice(0, 50)
  }
}

// 模拟进度
const simulateProgress = async (duration: number, message: string) => {
  isProcessing.value = true
  processingProgress.value = 0
  processingMessage.value = message

  const steps = 20
  const stepDuration = duration / steps

  for (let i = 0; i <= steps; i++) {
    processingProgress.value = Math.round((i / steps) * 100)
    await new Promise((resolve) => setTimeout(resolve, stepDuration))
  }

  isProcessing.value = false
}

// 进入下一阶段
const proceedToNextStage = async () => {
  if (isProcessing.value || currentStageIndex.value >= stages.value.length - 1) {
    return
  }

  const currentIdx = currentStageIndex.value
  const nextStage = stages.value[currentIdx + 1]

  // 根据当前阶段执行不同的处理
  switch (currentStage.value.status) {
    case DatasetStatus.DRAFT:
      addLog('info', '开始数据处理流程...')
      await simulateProgress(currentStage.value.duration, '正在提交数据集到处理队列...')

      // 更新数据集状态
      if (currentDataset.value) {
        currentDataset.value.status = DatasetStatus.PROCESSING
      }

      addLog('success', '数据集已提交到处理队列')
      break

    case DatasetStatus.PROCESSING:
      addLog('info', '开始AI自动标注和质量评估...')

      // 模拟各个处理步骤
      const processingSteps = currentStage.value.checklist
      for (let i = 0; i < processingSteps.length; i++) {
        processingMessage.value = processingSteps[i].text
        await simulateProgress(
          currentStage.value.duration / processingSteps.length,
          processingSteps[i].text
        )
        processingSteps[i].checked = true
        addLog('info', `${processingSteps[i].text} - 完成`)
      }

      // 生成质量报告
      qualityReport.value = {
        datasetId: currentDataset.value?.id || '',
        generatedAt: new Date().toISOString(),
        overallScore: 94,
        metrics: {
          completeness: 0.95,
          consistency: 0.92,
          accuracy: 0.96,
          labelQuality: 0.93,
          diversity: 0.91,
          balance: 0.88
        },
        issues: [
          {
            severity: 'medium',
            type: 'class_imbalance',
            description: '某些类别（如UI问题）的样本数量较少',
            affectedAssets: [],
            suggestedFix: '建议增加UI问题类别的样本或使用数据增强'
          },
          {
            severity: 'low',
            type: 'annotation_coverage',
            description: '部分资产的标注置信度较低',
            affectedAssets: [],
            suggestedFix: '建议人工复核低置信度的标注'
          }
        ],
        recommendations: [
          '建议增加15%的验证集样本以提高模型泛化能力',
          '对置信度 < 0.8 的标注进行人工复核',
          '考虑添加更多边缘场景的数据提升多样性',
          '建议对少数类别进行数据增强处理'
        ]
      }

      if (currentDataset.value) {
        currentDataset.value.status = DatasetStatus.READY
        currentDataset.value.quality = qualityReport.value.metrics
        currentDataset.value.statistics.totalAnnotations = 2450
      }

      addLog('success', '数据处理完成，质量报告已生成')
      break

    case DatasetStatus.READY:
      addLog('info', '提交审核申请...')

      // 检查质量评估项
      const qualitySteps = currentStage.value.checklist
      for (let i = 0; i < qualitySteps.length; i++) {
        processingMessage.value = qualitySteps[i].text
        await simulateProgress(
          currentStage.value.duration / qualitySteps.length,
          qualitySteps[i].text
        )
        qualitySteps[i].checked = true
        addLog('info', `${qualitySteps[i].text} - 通过`)
      }

      addLog('success', '质量评估通过，已提交管理员审核')
      break

    case DatasetStatus.PUBLISHED:
      addLog('info', '开始审核流程...')

      // 审核步骤
      const reviewSteps = currentStage.value.checklist
      for (let i = 0; i < reviewSteps.length; i++) {
        processingMessage.value = reviewSteps[i].text
        await simulateProgress(
          currentStage.value.duration / reviewSteps.length,
          reviewSteps[i].text
        )
        reviewSteps[i].checked = true
        addLog('success', `${reviewSteps[i].text} - 通过`)
      }

      if (currentDataset.value) {
        currentDataset.value.status = DatasetStatus.PUBLISHED
        currentDataset.value.publishedAt = new Date().toISOString()

        // 添加导出记录
        currentDataset.value.exports = [
          {
            id: `export_${Date.now()}`,
            exportedAt: new Date().toISOString(),
            exportedBy: 'admin',
            format: 'coco' as any,
            platform: 'pytorch' as any,
            fileSize: 13.5 * 1024 * 1024 * 1024, // 13.5GB
            downloadUrl: `/downloads/dataset_${currentDataset.value.id}_coco_v1.0.0.zip`,
            config: {} as any
          }
        ]
      }

      addLog('success', '数据集已发布，可供下载使用')
      break

    case DatasetStatus.ARCHIVED:
      // 最后一步，归档
      const archiveSteps = currentStage.value.checklist
      for (let i = 0; i < archiveSteps.length; i++) {
        processingMessage.value = archiveSteps[i].text
        await simulateProgress(
          currentStage.value.duration / archiveSteps.length,
          archiveSteps[i].text
        )
        archiveSteps[i].checked = true
        addLog('info', `${archiveSteps[i].text}`)
      }

      if (currentDataset.value) {
        currentDataset.value.status = DatasetStatus.ARCHIVED
      }

      addLog('success', '数据集已归档')
      break
  }

  // 进入下一阶段
  currentStageIndex.value++
}

// 返回上一阶段
const goToPreviousStage = () => {
  if (currentStageIndex.value > 0 && !isProcessing.value) {
    currentStageIndex.value--
    // 重置下一阶段的检查清单
    if (currentStageIndex.value < stages.value.length - 1) {
      const nextStage = stages.value[currentStageIndex.value + 1]
      nextStage.checklist.forEach((item) => {
        item.checked = false
      })
    }
    addLog('info', `返回到阶段: ${currentStage.value.name}`)
  }
}

// 重置流程
const reset = () => {
  currentStageIndex.value = 0
  processingProgress.value = 0
  isProcessing.value = false
  qualityReport.value = null

  // 重置所有检查清单（除了第一个阶段）
  stages.value.forEach((stage, index) => {
    if (index > 0) {
      stage.checklist.forEach((item) => {
        item.checked = false
      })
    }
  })

  // 重置数据集
  initMockDataset()

  activityLogs.value = []
  addLog('info', '流程已重置，准备开始新的发布流程')
}

// 初始化Mock数据集
const initMockDataset = () => {
  currentDataset.value = {
    id: `dataset_${Date.now()}`,
    name: '智能座舱语音指令数据集',
    description: '用于训练语音交互模型的高质量数据集，包含用户反馈视频、音频转录等多模态数据',
    version: '1.0.0',
    status: DatasetStatus.DRAFT,
    createdBy: 'admin',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assets: [],
    totalAssets: 850,
    splits: {
      train: { count: 680, percentage: 80 },
      validation: { count: 85, percentage: 10 },
      test: { count: 85, percentage: 10 }
    },
    quality: {
      completeness: 0,
      consistency: 0,
      accuracy: 0,
      labelQuality: 0,
      diversity: 0,
      balance: 0
    },
    statistics: {
      totalSize: 12.8 * 1024 * 1024 * 1024, // 12.8GB
      avgFileSize: 15 * 1024 * 1024, // 15MB
      minFileSize: 100 * 1024, // 100KB
      maxFileSize: 500 * 1024 * 1024, // 500MB
      typeDistribution: {
        video: 450,
        audio: 200,
        document: 200
      },
      labelDistribution: {
        语音唤醒问题: 320,
        触控问题: 280,
        UI问题: 150,
        其他: 100
      },
      totalAnnotations: 0,
      avgAnnotationsPerAsset: 0
    },
    annotationConfig: {
      types: ['classification' as any, 'transcription' as any],
      labels: ['语音唤醒问题', '触控问题', 'UI问题', '其他'],
      requireReview: true,
      minAnnotatorsPerAsset: 1
    },
    exports: [],
    tags: ['NLP', '语音交互', '用户反馈'],
    category: '用户反馈分析'
  }
}

// 初始化
onMounted(() => {
  initMockDataset()
  addLog('info', '数据集发布流程演示已初始化')
  addLog('info', `当前阶段: ${currentStage.value.name}`)
})
</script>

<style scoped>
.dataset-publish-flow {
  @apply max-w-6xl mx-auto;
}

/* 进度时间轴 */
.progress-timeline {
  @apply flex items-start justify-between relative;
}

.stage-item {
  @apply flex flex-col items-center relative flex-1;
}

.stage-icon {
  @apply w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-lg mb-2 transition-all;
}

.stage-item.pending .stage-icon {
  @apply border-gray-600 bg-gray-800 text-gray-500;
}

.stage-item.active .stage-icon {
  @apply border-blue-500 bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-500/50;
}

.stage-item.completed .stage-icon {
  @apply border-green-500 bg-green-500/20 text-green-400;
}

.stage-info {
  @apply text-center;
}

.stage-name {
  @apply text-sm font-semibold text-white mb-1;
}

.stage-status {
  @apply text-xs text-gray-400;
}

.stage-item.active .stage-name {
  @apply text-blue-400;
}

.stage-item.completed .stage-name {
  @apply text-green-400;
}

.stage-connector {
  @apply absolute top-5 left-1/2 w-full h-0.5 bg-gray-700;
  transform: translateY(-50%);
  z-index: -1;
}

.stage-item.completed .stage-connector {
  @apply bg-green-500;
}

/* 状态标签 */
.status-badge {
  @apply px-3 py-1 rounded-full text-xs font-semibold;
}

/* 统计卡片 */
.stat-card {
  @apply bg-gray-700/50 rounded-lg p-4;
}

/* 按钮 */
.btn-primary {
  @apply px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg;
  @apply hover:from-blue-600 hover:to-purple-700 transition-all;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-secondary {
  @apply px-6 py-2.5 bg-gray-700 text-white font-semibold rounded-lg;
  @apply hover:bg-gray-600 transition-all;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
}

/* 活动日志滚动条 */
.activity-log ::-webkit-scrollbar {
  width: 6px;
}

.activity-log ::-webkit-scrollbar-track {
  @apply bg-gray-700 rounded;
}

.activity-log ::-webkit-scrollbar-thumb {
  @apply bg-gray-600 rounded;
}

.activity-log ::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500;
}
</style>

