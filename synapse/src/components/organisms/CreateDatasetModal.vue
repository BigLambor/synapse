<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 overflow-y-auto"
        @click.self="handleCancel"
      >
        <!-- 背景遮罩 -->
        <div class="fixed inset-0 bg-black/60 "></div>

        <!-- Modal内容 -->
        <div class="flex min-h-screen items-center justify-center p-4">
          <div
            class="relative w-full max-w-4xl bg-cursor-panel rounded-cursor  border border-cursor-border overflow-hidden"
            @click.stop
          >
            <!-- 头部 -->
            <div class="px-8 py-6 border-b border-cursor-border bg-cursor-panel">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-semibold text-cursor-fg mb-1">
                    🎯 创建训练数据集
                  </h2>
                  <p class="text-cursor-fg-muted text-sm">
                    为AI训练平台准备高质量、标准化的数据集
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
            </div>

            <!-- 表单内容 -->
            <div class="px-8 py-6 max-h-[70vh] overflow-y-auto">
              <form @submit.prevent="handleSubmit">
                <!-- 步骤指示器 -->
                <div class="mb-8">
                  <div class="flex items-center justify-between">
                    <div
                      v-for="(step, index) in steps"
                      :key="index"
                      class="flex items-center"
                      :class="{ 'flex-1': index < steps.length - 1 }"
                    >
                      <div class="flex flex-col items-center">
                        <div
                          :class="[
                            'w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all',
                            currentStep >= index
                              ? 'bg-cursor-accent text-white '
                              : 'bg-cursor-panel text-cursor-fg-muted'
                          ]"
                        >
                          {{ index + 1 }}
                        </div>
                        <span
                          :class="[
                            'text-xs mt-2 font-medium',
                            currentStep >= index ? 'text-cursor-accent' : 'text-cursor-fg-muted'
                          ]"
                        >
                          {{ step }}
                        </span>
                      </div>
                      <div
                        v-if="index < steps.length - 1"
                        :class="[
                          'flex-1 h-0.5 mx-4 transition-all',
                          currentStep > index ? 'bg-primary-600' : 'bg-cursor-border'
                        ]"
                      ></div>
                    </div>
                  </div>
                </div>

                <!-- 步骤1: 基本信息 -->
                <div v-show="currentStep === 0" class="space-y-6">
                  <h3 class="text-lg font-semibold text-cursor-fg mb-4 flex items-center gap-2">
                    <span>📝</span> 基本信息
                  </h3>

                  <!-- 数据集名称 -->
                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      数据集名称 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.name"
                      type="text"
                      placeholder="例如: 智能座舱用户反馈数据集"
                      class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50 transition-all"
                      required
                    />
                  </div>

                  <!-- 数据集描述 -->
                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      数据集描述 <span class="text-red-500">*</span>
                    </label>
                    <textarea
                      v-model="formData.description"
                      rows="4"
                      placeholder="描述数据集的用途、包含的数据类型、适用场景等..."
                      class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50 transition-all resize-none"
                      required
                    ></textarea>
                  </div>

                  <!-- 分类和标签 -->
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        数据集分类 <span class="text-red-500">*</span>
                      </label>
                      <select
                        v-model="formData.category"
                        class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                        required
                      >
                        <option value="">选择分类</option>
                        <option value="用户反馈分析">用户反馈分析</option>
                        <option value="设计资产">设计资产</option>
                        <option value="文档分析">文档分析</option>
                        <option value="语音处理">语音处理</option>
                        <option value="文本分析">文本分析</option>
                        <option value="图像识别">图像识别</option>
                        <option value="视频分析">视频分析</option>
                        <option value="其他">其他</option>
                      </select>
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        版本号
                      </label>
                      <input
                        v-model="formData.version"
                        type="text"
                        placeholder="1.0.0"
                        class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                      />
                    </div>
                  </div>

                  <!-- 标签输入 -->
                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      标签（按Enter添加）
                    </label>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <span
                        v-for="(tag, index) in formData.tags"
                        :key="index"
                        class="px-3 py-1 bg-cursor-accent-muted text-cursor-accent rounded-full text-sm flex items-center gap-2"
                      >
                        {{ tag }}
                        <button
                          type="button"
                          class="hover:text-cursor-accent-hover"
                          @click="removeTag(index)"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                    <input
                      v-model="tagInput"
                      type="text"
                      placeholder="输入标签并按Enter"
                      class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                      @keyup.enter="addTag"
                    />
                  </div>

                  <!-- 创建者信息 -->
                  <div class="mt-6 p-4 bg-cursor-surface border border-cursor-border rounded-cursor">
                    <div class="flex items-center gap-3">
                      <div class="w-12 h-12 rounded-full bg-cursor-panel border border-cursor-border flex items-center justify-center text-2xl">
                        {{ creatorAvatar }}
                      </div>
                      <div>
                        <div class="text-2xs text-cursor-fg-muted">创建者</div>
                        <div class="text-cursor-fg font-medium">{{ creatorName }}</div>
                        <div class="text-xs text-cursor-fg-muted">{{ creatorRole }}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 步骤2: 数据配置 -->
                <div v-show="currentStep === 1" class="space-y-6">
                  <h3 class="text-lg font-semibold text-cursor-fg mb-4 flex items-center gap-2">
                    <span>⚙️</span> 数据配置
                  </h3>

                  <!-- 数据划分比例 -->
                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-4">
                      数据划分比例
                    </label>
                    <div class="grid grid-cols-3 gap-4">
                      <div class="bg-cursor-surface border border-cursor-border rounded-cursor p-4">
                        <div class="text-xs text-cursor-fg-muted mb-2">训练集</div>
                        <div class="flex items-baseline gap-2">
                          <input
                            v-model.number="formData.splitRatio.train"
                            type="number"
                            min="0"
                            max="100"
                            class="w-20 px-3 py-2 bg-cursor-panel border border-cursor-border rounded-cursor text-cursor-fg text-2xl font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                          />
                          <span class="text-cursor-fg-muted text-lg font-medium">%</span>
                        </div>
                        <div class="text-xs text-cursor-fg-muted mt-2">
                          {{ Math.floor(selectedAssetCount * (formData.splitRatio.train / 100)) }} 个资产
                        </div>
                      </div>

                      <div class="bg-cursor-surface border border-cursor-border rounded-cursor p-4">
                        <div class="text-xs text-cursor-fg-muted mb-2">验证集</div>
                        <div class="flex items-baseline gap-2">
                          <input
                            v-model.number="formData.splitRatio.validation"
                            type="number"
                            min="0"
                            max="100"
                            class="w-20 px-3 py-2 bg-cursor-panel border border-cursor-border rounded-cursor text-cursor-fg text-2xl font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                          />
                          <span class="text-cursor-fg-muted text-lg font-medium">%</span>
                        </div>
                        <div class="text-xs text-cursor-fg-muted mt-2">
                          {{ Math.floor(selectedAssetCount * (formData.splitRatio.validation / 100)) }} 个资产
                        </div>
                      </div>

                      <div class="bg-cursor-surface border border-cursor-border rounded-cursor p-4">
                        <div class="text-xs text-cursor-fg-muted mb-2">测试集</div>
                        <div class="flex items-baseline gap-2">
                          <input
                            v-model.number="formData.splitRatio.test"
                            type="number"
                            min="0"
                            max="100"
                            class="w-20 px-3 py-2 bg-cursor-panel border border-cursor-border rounded-cursor text-cursor-fg text-2xl font-semibold tabular-nums focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                          />
                          <span class="text-cursor-fg-muted text-lg font-medium">%</span>
                        </div>
                        <div class="text-xs text-cursor-fg-muted mt-2">
                          {{ Math.floor(selectedAssetCount * (formData.splitRatio.test / 100)) }} 个资产
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="splitRatioSum !== 100"
                      class="mt-2 text-sm text-yellow-500 flex items-center gap-2"
                    >
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                      </svg>
                      总和必须等于100%（当前：{{ splitRatioSum }}%）
                    </div>
                  </div>

                  <!-- 标注配置 -->
                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-3">
                      标注类型 <span class="text-red-500">*</span>
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <label
                        v-for="type in annotationTypes"
                        :key="type.value"
                        :class="[
                          'flex items-center gap-3 p-4 border rounded-cursor cursor-pointer transition-all',
                          formData.annotationConfig.types.includes(type.value)
                            ? 'bg-cursor-accent-muted border-cursor-accent text-cursor-accent'
                            : 'bg-cursor-surface border-cursor-border text-cursor-fg hover:border-cursor-border'
                        ]"
                      >
                        <input
                          v-model="formData.annotationConfig.types"
                          type="checkbox"
                          :value="type.value"
                          class="w-5 h-5 rounded border-cursor-border text-primary-600 focus:ring-primary-500 focus:ring-offset-0 bg-cursor-panel"
                        />
                        <div class="flex-1">
                          <div class="font-medium">{{ type.label }}</div>
                          <div class="text-xs text-cursor-fg-muted">{{ type.description }}</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <!-- 标注标签 -->
                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      标注标签（按Enter添加）
                    </label>
                    <div class="flex flex-wrap gap-2 mb-2">
                      <span
                        v-for="(label, index) in formData.annotationConfig.labels"
                        :key="index"
                        class="px-3 py-1 bg-cursor-border/50 text-cursor-fg rounded-full text-sm flex items-center gap-2"
                      >
                        {{ label }}
                        <button
                          type="button"
                          class="hover:text-cursor-fg"
                          @click="removeLabel(index)"
                        >
                          ×
                        </button>
                      </span>
                    </div>
                    <input
                      v-model="labelInput"
                      type="text"
                      placeholder="输入标签并按Enter，例如: 语音唤醒失败"
                      class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                      @keyup.enter="addLabel"
                    />
                  </div>

                  <!-- 质量控制 -->
                  <div class="grid grid-cols-2 gap-4">
                    <label class="flex items-center gap-3 p-4 bg-cursor-surface border border-cursor-border rounded-cursor cursor-pointer hover:border-cursor-border transition-all">
                      <input
                        v-model="formData.annotationConfig.requireReview"
                        type="checkbox"
                        class="w-5 h-5 rounded border-cursor-border text-primary-600 focus:ring-primary-500 focus:ring-offset-0 bg-cursor-panel"
                      />
                      <div>
                        <div class="text-cursor-fg font-medium">需要人工复核</div>
                        <div class="text-xs text-cursor-fg-muted">AI标注后需要人工审核</div>
                      </div>
                    </label>

                    <div class="p-4 bg-cursor-surface border border-cursor-border rounded-cursor">
                      <label class="text-cursor-fg font-medium mb-2 block">每资产最少标注人数</label>
                      <input
                        v-model.number="formData.annotationConfig.minAnnotatorsPerAsset"
                        type="number"
                        min="1"
                        max="5"
                        class="w-full px-3 py-2 bg-cursor-panel border border-cursor-border rounded-cursor text-cursor-fg focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 focus:border-cursor-accent/50"
                      />
                    </div>
                  </div>
                </div>

                <!-- 步骤3: 选择资产 -->
                <div v-show="currentStep === 2" class="space-y-6">
                  <h3 class="text-lg font-semibold text-cursor-fg mb-4 flex items-center gap-2">
                    <span>📦</span> 选择资产
                  </h3>

                  <div class="bg-cursor-surface border border-cursor-accent/30 rounded-cursor p-6">
                    <div class="text-center">
                      <div class="text-6xl mb-4">🗂️</div>
                      <h4 class="text-xl font-semibold text-cursor-fg mb-2">从数据湖选择资产</h4>
                      <p class="text-cursor-fg-muted mb-4">
                        选择已经处理完成的多模态资产添加到数据集
                      </p>
                      <div class="flex items-center justify-center gap-6 text-sm">
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span class="text-cursor-fg">已选: {{ selectedAssetCount }}</span>
                        </div>
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span class="text-cursor-fg">可用: 1,247</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 快速选择预设 -->
                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-3">
                      快速选择（演示用）
                    </label>
                    <div class="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        class="p-4 bg-cursor-surface border border-cursor-border rounded-cursor hover:border-cursor-accent hover:bg-cursor-accent-muted transition-all text-left"
                        @click="selectPreset('small')"
                      >
                        <div class="font-medium text-cursor-fg">小型数据集</div>
                        <div class="text-2xs text-cursor-fg-muted">100个资产 · 适合快速验证</div>
                      </button>
                      <button
                        type="button"
                        class="p-4 bg-cursor-surface border border-cursor-border rounded-cursor hover:border-cursor-accent hover:bg-cursor-accent-muted transition-all text-left"
                        @click="selectPreset('medium')"
                      >
                        <div class="font-medium text-cursor-fg">中型数据集</div>
                        <div class="text-2xs text-cursor-fg-muted">500个资产 · 平衡性能和效果</div>
                      </button>
                      <button
                        type="button"
                        class="p-4 bg-cursor-surface border border-cursor-border rounded-cursor hover:border-cursor-accent hover:bg-cursor-accent-muted transition-all text-left"
                        @click="selectPreset('large')"
                      >
                        <div class="font-medium text-cursor-fg">大型数据集</div>
                        <div class="text-2xs text-cursor-fg-muted">1000个资产 · 生产级训练</div>
                      </button>
                      <button
                        type="button"
                        class="p-4 bg-cursor-surface border border-cursor-border rounded-cursor hover:border-cursor-accent hover:bg-cursor-accent-muted transition-all text-left"
                        @click="selectPreset('custom')"
                      >
                        <div class="font-medium text-cursor-fg">自定义选择</div>
                        <div class="text-2xs text-cursor-fg-muted">手动从数据湖选择</div>
                      </button>
                    </div>
                  </div>

                  <!-- 选中资产统计 -->
                  <div v-if="selectedAssetCount > 0" class="space-y-4">
                    <!-- 数据划分统计 -->
                    <div class="grid grid-cols-3 gap-4">
                      <div class="bg-cursor-surface border border-cursor-border rounded-cursor p-4">
                        <div class="text-cursor-fg-muted text-sm mb-1">训练集</div>
                        <div class="text-cursor-accent text-2xl font-bold tabular-nums">
                          {{ Math.floor(selectedAssetCount * (formData.splitRatio.train / 100)) }}
                        </div>
                      </div>
                      <div class="bg-cursor-surface border border-cursor-border rounded-cursor p-4">
                        <div class="text-cursor-fg-muted text-sm mb-1">验证集</div>
                        <div class="text-cursor-accent text-2xl font-bold tabular-nums">
                          {{ Math.floor(selectedAssetCount * (formData.splitRatio.validation / 100)) }}
                        </div>
                      </div>
                      <div class="bg-cursor-surface border border-cursor-border rounded-cursor p-4">
                        <div class="text-cursor-fg-muted text-sm mb-1">测试集</div>
                        <div class="text-cursor-accent text-2xl font-bold tabular-nums">
                          {{ Math.floor(selectedAssetCount * (formData.splitRatio.test / 100)) }}
                        </div>
                      </div>
                    </div>

                    <!-- 资产类型分布（如果是自定义选择） -->
                    <div v-if="selectedAssetsData.length > 0" class="bg-cursor-surface border border-cursor-accent/20 rounded-cursor p-4">
                      <h5 class="text-sm font-medium text-cursor-fg mb-3">已选资产类型分布</h5>
                      <div class="grid grid-cols-4 gap-3">
                        <div v-for="(count, type) in assetTypeDistribution" :key="type" class="text-center">
                          <div class="text-2xl mb-1">{{ getTypeIcon(type) }}</div>
                          <div class="text-cursor-fg font-semibold">{{ count }}</div>
                          <div class="text-xs text-cursor-fg-muted">{{ getTypeName(type) }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- 底部操作栏 -->
            <div class="px-8 py-6 border-t border-cursor-border bg-cursor-panel flex items-center justify-between">
              <button
                v-if="currentStep > 0"
                type="button"
                class="px-6 py-3 text-cursor-fg hover:text-cursor-fg hover:bg-cursor-panel rounded-cursor transition-all"
                @click="previousStep"
              >
                ← 上一步
              </button>
              <div v-else></div>

              <div class="flex items-center gap-3">
                <button
                  type="button"
                  class="px-6 py-3 text-cursor-fg hover:text-cursor-fg hover:bg-cursor-panel rounded-cursor transition-all"
                  @click="handleCancel"
                >
                  取消
                </button>
                <button
                  v-if="currentStep < steps.length - 1"
                  type="button"
                  class="px-6 py-3 bg-cursor-accent text-white rounded-cursor hover:bg-primary-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="!canProceed"
                  @click="nextStep"
                >
                  下一步 →
                </button>
                <button
                  v-else
                  type="button"
                  class="px-8 py-3 bg-cursor-accent text-white rounded-cursor  transition-all  disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  :disabled="!canCreate || isCreating"
                  @click="handleSubmit"
                >
                  <svg v-if="isCreating" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ isCreating ? '创建中...' : '🎯 创建数据集' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 资产选择器Modal -->
    <AssetSelectorModal
      :show="showAssetSelector"
      :initial-selection="formData.assetIds"
      @close="handleAssetSelectionCancel"
      @confirm="handleAssetSelectionConfirm"
    />
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useDatasetStore } from '@/stores/dataset'
import { useUserStore } from '@/stores/user'
import { AnnotationType } from '@/types/enums'
import AssetSelectorModal from './AssetSelectorModal.vue'
import type { Asset } from '@/api/mock/mockData'

// Props
const props = defineProps<{
  show: boolean
}>()

// Emits
const emit = defineEmits<{
  close: []
  created: [datasetId: string]
}>()

// Stores
const datasetStore = useDatasetStore()
const userStore = useUserStore()

// 步骤
const steps = ['基本信息', '数据配置', '选择资产']
const currentStep = ref(0)

// 表单数据
const formData = ref({
  name: '',
  description: '',
  category: '',
  version: '1.0.0',
  tags: [] as string[],
  splitRatio: {
    train: 80,
    validation: 10,
    test: 10
  },
  annotationConfig: {
    types: [] as AnnotationType[],
    labels: [] as string[],
    requireReview: true,
    minAnnotatorsPerAsset: 1
  },
  assetIds: [] as string[]
})

// 标签输入
const tagInput = ref('')
const labelInput = ref('')

// 资产选择
const selectedAssetCount = ref(0)
const showAssetSelector = ref(false)
const selectedAssetsData = ref<Asset[]>([]) // 存储选中的资产详细信息

// 创建状态
const isCreating = ref(false)

// 标注类型选项
const annotationTypes = [
  {
    value: AnnotationType.CLASSIFICATION,
    label: '分类标注',
    description: '为资产分配类别标签'
  },
  {
    value: AnnotationType.DETECTION,
    label: '目标检测',
    description: '标注边界框和目标类别'
  },
  {
    value: AnnotationType.SEGMENTATION,
    label: '图像分割',
    description: '像素级分割标注'
  },
  {
    value: AnnotationType.NER,
    label: '命名实体识别',
    description: '文本实体标注'
  },
  {
    value: AnnotationType.TRANSCRIPTION,
    label: '转录标注',
    description: '音视频转文字'
  },
  {
    value: AnnotationType.QA,
    label: '问答对',
    description: '问题和答案配对'
  }
]

// 创建者信息
const creatorName = computed(() => userStore.currentUser?.name || '张三')
const creatorRole = computed(() => {
  const roleMap: Record<string, string> = {
    'Market Analyst': '数据工程师',
    'AI Engineer': 'AI工程师',
    'Director': '技术总监'
  }
  return roleMap[userStore.currentUser?.role || 'Market Analyst'] || '数据工程师'
})
const creatorAvatar = computed(() => {
  const avatarMap: Record<string, string> = {
    'user_张三': '👩',
    'user_李四': '👨',
    'user_王五': '👩‍💼'
  }
  return avatarMap[userStore.currentUser?.id || 'user_张三'] || '👩'
})

// 数据划分总和
const splitRatioSum = computed(() => {
  return formData.value.splitRatio.train + formData.value.splitRatio.validation + formData.value.splitRatio.test
})

// 是否可以进行下一步
const canProceed = computed(() => {
  if (currentStep.value === 0) {
    return formData.value.name && formData.value.description && formData.value.category
  }
  if (currentStep.value === 1) {
    return (
      splitRatioSum.value === 100 &&
      formData.value.annotationConfig.types.length > 0 &&
      formData.value.annotationConfig.labels.length > 0
    )
  }
  return true
})

// 是否可以创建
const canCreate = computed(() => {
  return canProceed.value && selectedAssetCount.value > 0
})

// 添加标签
const addTag = () => {
  const tag = tagInput.value.trim()
  if (tag && !formData.value.tags.includes(tag)) {
    formData.value.tags.push(tag)
    tagInput.value = ''
  }
}

const removeTag = (index: number) => {
  formData.value.tags.splice(index, 1)
}

// 添加标注标签
const addLabel = () => {
  const label = labelInput.value.trim()
  if (label && !formData.value.annotationConfig.labels.includes(label)) {
    formData.value.annotationConfig.labels.push(label)
    labelInput.value = ''
  }
}

const removeLabel = (index: number) => {
  formData.value.annotationConfig.labels.splice(index, 1)
}

// 选择预设
const selectPreset = (size: 'small' | 'medium' | 'large' | 'custom') => {
  const countMap = {
    small: 100,
    medium: 500,
    large: 1000,
    custom: 0
  }
  
  if (size === 'custom') {
    // 打开资产选择器
    showAssetSelector.value = true
  } else {
    selectedAssetCount.value = countMap[size]
    // 生成模拟的资产ID
    formData.value.assetIds = Array.from({ length: countMap[size] }, (_, i) => `asset_${i + 1}`)
    // 清空详细资产数据（因为是预设）
    selectedAssetsData.value = []
  }
}

// 处理资产选择确认
const handleAssetSelectionConfirm = (assetIds: string[], assets: Asset[]) => {
  formData.value.assetIds = assetIds
  selectedAssetCount.value = assetIds.length
  selectedAssetsData.value = assets
  showAssetSelector.value = false
}

// 处理资产选择取消
const handleAssetSelectionCancel = () => {
  showAssetSelector.value = false
}

// 步骤导航
const nextStep = () => {
  if (canProceed.value && currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

// 提交创建
const handleSubmit = async () => {
  if (!canCreate.value || isCreating.value) return

  isCreating.value = true
  
  try {
    const dataset = await datasetStore.createDataset({
      name: formData.value.name,
      description: formData.value.description,
      category: formData.value.category,
      tags: formData.value.tags,
      assetIds: formData.value.assetIds,
      splitRatio: formData.value.splitRatio,
      annotationConfig: formData.value.annotationConfig
    })

    // 成功提示
    alert(`✅ 数据集创建成功！\n\n数据集名称：${dataset.name}\n创建者：${creatorName.value}\n资产数量：${dataset.totalAssets}\n\n数据集ID：${dataset.id}`)
    
    emit('created', dataset.id)
    emit('close')
    
    // 重置表单
    resetForm()
  } catch (error) {
    console.error('创建数据集失败:', error)
    alert('❌ 创建数据集失败，请重试')
  } finally {
    isCreating.value = false
  }
}

// 取消
const handleCancel = () => {
  if (confirm('确定要取消创建数据集吗？已填写的信息将丢失。')) {
    emit('close')
    resetForm()
  }
}

// 资产类型分布统计
const assetTypeDistribution = computed(() => {
  if (selectedAssetsData.value.length === 0) return {}
  
  const distribution: Record<string, number> = {}
  selectedAssetsData.value.forEach(asset => {
    distribution[asset.type] = (distribution[asset.type] || 0) + 1
  })
  return distribution
})

const getTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    video: '🎥',
    document: '📄',
    image: '🖼️',
    audio: '🎵'
  }
  return icons[type] || '📁'
}

const getTypeName = (type: string): string => {
  const names: Record<string, string> = {
    video: '视频',
    document: '文档',
    image: '图片',
    audio: '音频'
  }
  return names[type] || type
}

// 重置表单
const resetForm = () => {
  currentStep.value = 0
  formData.value = {
    name: '',
    description: '',
    category: '',
    version: '1.0.0',
    tags: [],
    splitRatio: { train: 80, validation: 10, test: 10 },
    annotationConfig: {
      types: [],
      labels: [],
      requireReview: true,
      minAnnotatorsPerAsset: 1
    },
    assetIds: []
  }
  selectedAssetCount.value = 0
  selectedAssetsData.value = []
  tagInput.value = ''
  labelInput.value = ''
}

// 监听显示状态
watch(() => props.show, (newVal) => {
  if (!newVal) {
    resetForm()
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
  transform: scale(0.9);
  opacity: 0;
}
</style>

