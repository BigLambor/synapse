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
            class="relative w-full max-w-3xl bg-cursor-panel rounded-cursor  border border-cursor-border overflow-hidden"
            @click.stop
          >
            <!-- 头部 -->
            <div class="px-8 py-6 border-b border-cursor-border bg-cursor-panel">
              <div class="flex items-center justify-between">
                <div>
                  <h2 class="text-2xl font-semibold text-cursor-fg mb-1">
                    ☁️ 配置数据源
                  </h2>
                  <p class="text-cursor-fg-muted text-sm">
                    连接对象存储，自动同步数据到Synapse
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
                <!-- 数据源类型选择 -->
                <div class="mb-6">
                  <label class="block text-sm font-medium text-cursor-fg mb-3">
                    数据源类型 <span class="text-red-500">*</span>
                  </label>
                  <div class="grid grid-cols-3 gap-3">
                    <label
                      v-for="type in dataSourceTypes"
                      :key="type.value"
                      :class="[
                        'flex flex-col items-center gap-2 p-4 border rounded-cursor cursor-pointer transition-all',
                        formData.type === type.value
                          ? 'bg-cursor-accent-muted border-cursor-accent text-cursor-accent'
                          : 'bg-cursor-surface border-cursor-border text-cursor-fg hover:border-cursor-border'
                      ]"
                    >
                      <input
                        v-model="formData.type"
                        type="radio"
                        :value="type.value"
                        class="hidden"
                      />
                      <span class="text-2xl">{{ type.icon }}</span>
                      <span class="font-medium text-sm">{{ type.label }}</span>
                    </label>
                  </div>
                </div>

                <!-- 基本信息 -->
                <div class="space-y-4 mb-6">
                  <h3 class="text-lg font-semibold text-cursor-fg flex items-center gap-2">
                    <span>📝</span> 基本信息
                  </h3>

                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      数据源名称 <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="formData.name"
                      type="text"
                      placeholder="例如: 企业主对象存储"
                      class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                      required
                    />
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      描述
                    </label>
                    <textarea
                      v-model="formData.description"
                      rows="2"
                      placeholder="描述这个数据源的用途..."
                      class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50 resize-none"
                    ></textarea>
                  </div>
                </div>

                <!-- S3配置 -->
                <div v-if="formData.type === 's3' || formData.type === 'minio'" class="space-y-4 mb-6">
                  <h3 class="text-lg font-semibold text-cursor-fg flex items-center gap-2">
                    <span>⚙️</span> {{ formData.type === 's3' ? 'S3' : 'MinIO' }} 配置
                  </h3>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Endpoint <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="s3Config.endpoint"
                        type="text"
                        :placeholder="formData.type === 's3' ? 's3.amazonaws.com' : 'minio.example.com'"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                        required
                      />
                    </div>

                    <div v-if="formData.type === 's3'">
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Region
                      </label>
                      <input
                        v-model="s3Config.region"
                        type="text"
                        placeholder="us-east-1"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                      />
                    </div>

                    <div v-if="formData.type === 'minio'">
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Port
                      </label>
                      <input
                        v-model.number="minioConfig.port"
                        type="number"
                        placeholder="9000"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      Bucket <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="s3Config.bucket"
                      type="text"
                      placeholder="ai-training-data"
                      class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                      required
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Access Key ID <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="s3Config.accessKeyId"
                        type="text"
                        placeholder="AKIAIOSFODNN7EXAMPLE"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Secret Access Key <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="s3Config.secretAccessKey"
                        type="password"
                        placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                        required
                      />
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Path Prefix（可选）
                      </label>
                      <input
                        v-model="s3Config.pathPrefix"
                        type="text"
                        placeholder="synapse/"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                      />
                    </div>

                    <div class="flex items-end">
                      <label class="flex items-center gap-2 px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor cursor-pointer hover:border-cursor-border w-full">
                        <input
                          v-model="s3Config.useSSL"
                          type="checkbox"
                          class="w-5 h-5 rounded border-cursor-border text-primary-600 focus:ring-primary-500 focus:ring-offset-0 bg-cursor-panel"
                        />
                        <span class="text-white font-medium">使用 SSL</span>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- OSS配置 -->
                <div v-if="formData.type === 'oss'" class="space-y-4 mb-6">
                  <h3 class="text-lg font-semibold text-cursor-fg flex items-center gap-2">
                    <span>⚙️</span> 阿里云OSS配置
                  </h3>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Endpoint <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="ossConfig.endpoint"
                        type="text"
                        placeholder="oss-cn-beijing.aliyuncs.com"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Region <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="ossConfig.region"
                        type="text"
                        placeholder="oss-cn-beijing"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      Bucket <span class="text-red-500">*</span>
                    </label>
                    <input
                      v-model="ossConfig.bucket"
                      type="text"
                      placeholder="my-bucket"
                      class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                      required
                    />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Access Key ID <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="ossConfig.accessKeyId"
                        type="text"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                        required
                      />
                    </div>

                    <div>
                      <label class="block text-sm font-medium text-cursor-fg mb-2">
                        Access Key Secret <span class="text-red-500">*</span>
                      </label>
                      <input
                        v-model="ossConfig.accessKeySecret"
                        type="password"
                        class="w-full px-4 py-2 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg placeholder-cursor-fg-subtle focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                        required
                      />
                    </div>
                  </div>
                </div>

                <!-- 同步设置 -->
                <div class="space-y-4 mb-6">
                  <h3 class="text-lg font-semibold text-cursor-fg flex items-center gap-2">
                    <span>🔄</span> 同步设置
                  </h3>

                  <div>
                    <label class="block text-sm font-medium text-cursor-fg mb-2">
                      同步频率
                    </label>
                    <select
                      v-model="syncSettings.schedule"
                      class="w-full px-4 py-3 bg-cursor-surface border border-cursor-border rounded-cursor text-cursor-fg focus:outline-none focus:ring-2 focus:ring-cursor-accent/50"
                    >
                      <option value="manual">手动触发</option>
                      <option value="realtime">实时同步</option>
                      <option value="hourly">每小时</option>
                      <option value="every_4_hours">每4小时</option>
                      <option value="daily">每天</option>
                      <option value="weekly">每周</option>
                    </select>
                  </div>

                  <label class="flex items-center gap-3 p-4 bg-cursor-surface border border-cursor-border rounded-cursor cursor-pointer hover:border-cursor-border">
                    <input
                      v-model="syncSettings.autoImport"
                      type="checkbox"
                      class="w-5 h-5 rounded border-cursor-border text-primary-600 focus:ring-primary-500 focus:ring-offset-0 bg-cursor-panel"
                    />
                    <div>
                      <div class="text-white font-medium">自动导入新文件</div>
                      <div class="text-xs text-cursor-fg-muted">检测到新文件时自动导入到Synapse</div>
                    </div>
                  </label>
                </div>

                <!-- 测试连接结果 -->
                <div v-if="testResult" class="mb-6">
                  <div
                    :class="[
                      'p-4 rounded-cursor border',
                      testResult.success
                        ? 'bg-green-500/10 border-green-500/50 text-green-400'
                        : 'bg-red-500/10 border-red-500/50 text-red-400'
                    ]"
                  >
                    <div class="flex items-center gap-2">
                      <span class="text-xl">{{ testResult.success ? '✅' : '❌' }}</span>
                      <span>{{ testResult.message }}</span>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <!-- 底部操作栏 -->
            <div class="px-8 py-6 border-t border-cursor-border bg-cursor-panel flex items-center justify-between">
              <AppButton
                variant="ghost"
                @click="handleTestConnection"
                :disabled="isTesting || !canTest"
              >
                {{ isTesting ? '测试中...' : '🔍 测试连接' }}
              </AppButton>

              <div class="flex items-center gap-3">
                <AppButton variant="ghost" @click="handleCancel">
                  取消
                </AppButton>
                <AppButton
                  @click="handleSubmit"
                  :disabled="isCreating || !canCreate"
                >
                  {{ isCreating ? '创建中...' : '✅ 创建数据源' }}
                </AppButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useDataSourceStore } from '@/stores/dataSource'
import { useUserStore } from '@/stores/user'
import AppButton from '@/components/atoms/AppButton.vue'
import { DataSourceType, DataSourceStatus, SyncSchedule } from '@/types/enums'
import type { Domain } from '@/types/models'

// Props
const props = defineProps<{
  show: boolean
  sourceType?: string
}>()

// Emits
const emit = defineEmits<{
  close: []
  created: [dataSourceId: string]
}>()

// Stores
const dataSourceStore = useDataSourceStore()
const userStore = useUserStore()

// 数据源类型选项
const dataSourceTypes = [
  { value: DataSourceType.S3, label: 'Amazon S3', icon: '☁️' },
  { value: DataSourceType.OSS, label: '阿里云OSS', icon: '☁️' },
  { value: DataSourceType.MINIO, label: 'MinIO', icon: '🗄️' }
]

// 表单数据
const formData = ref({
  name: '',
  description: '',
  type: (props.sourceType as DataSourceType) || DataSourceType.S3
})

// S3/MinIO配置
const s3Config = ref<Partial<Domain.S3Config>>({
  type: DataSourceType.S3,
  endpoint: '',
  region: '',
  bucket: '',
  accessKeyId: '',
  secretAccessKey: '',
  useSSL: true,
  pathPrefix: ''
})

// MinIO配置
const minioConfig = ref<Partial<Domain.MinIOConfig>>({
  type: DataSourceType.MINIO,
  endpoint: '',
  port: 9000,
  bucket: '',
  accessKey: '',
  secretKey: '',
  useSSL: false,
  pathPrefix: ''
})

// OSS配置
const ossConfig = ref<Partial<Domain.OSSConfig>>({
  type: DataSourceType.OSS,
  endpoint: '',
  region: '',
  bucket: '',
  accessKeyId: '',
  accessKeySecret: '',
  pathPrefix: ''
})

// 同步设置
const syncSettings = ref<Partial<Domain.SyncSettings>>({
  schedule: SyncSchedule.MANUAL,
  autoImport: false,
  rules: [],
  filters: {},
  maxConcurrentFiles: 5,
  batchSize: 50
})

// 状态
const isTesting = ref(false)
const isCreating = ref(false)
const testResult = ref<{ success: boolean; message: string } | null>(null)

// 计算属性
const canTest = computed(() => {
  if (!formData.value.name) return false
  
  if (formData.value.type === DataSourceType.S3 || formData.value.type === DataSourceType.MINIO) {
    return !!(s3Config.value.endpoint && s3Config.value.bucket && s3Config.value.accessKeyId && s3Config.value.secretAccessKey)
  }
  
  if (formData.value.type === DataSourceType.OSS) {
    return !!(ossConfig.value.endpoint && ossConfig.value.bucket && ossConfig.value.accessKeyId && ossConfig.value.accessKeySecret)
  }
  
  return false
})

const canCreate = computed(() => {
  return canTest.value && testResult.value?.success
})

// 测试连接
const handleTestConnection = async () => {
  isTesting.value = true
  testResult.value = null
  
  try {
    let config: Domain.DataSourceConfig
    
    if (formData.value.type === DataSourceType.S3) {
      config = {
        ...s3Config.value,
        type: DataSourceType.S3
      } as Domain.S3Config
    } else if (formData.value.type === DataSourceType.MINIO) {
      config = {
        type: DataSourceType.MINIO,
        endpoint: minioConfig.value.endpoint!,
        port: minioConfig.value.port!,
        bucket: minioConfig.value.bucket!,
        accessKey: minioConfig.value.accessKey!,
        secretKey: minioConfig.value.secretKey!,
        useSSL: minioConfig.value.useSSL!,
        pathPrefix: minioConfig.value.pathPrefix
      } as Domain.MinIOConfig
    } else {
      config = {
        ...ossConfig.value,
        type: DataSourceType.OSS
      } as Domain.OSSConfig
    }
    
    testResult.value = await dataSourceStore.testConnection(config)
  } finally {
    isTesting.value = false
  }
}

// 提交创建
const handleSubmit = async () => {
  if (!canCreate.value || isCreating.value) return
  
  isCreating.value = true
  
  try {
    let config: Domain.DataSourceConfig
    
    if (formData.value.type === DataSourceType.S3) {
      config = {
        ...s3Config.value,
        type: DataSourceType.S3
      } as Domain.S3Config
    } else if (formData.value.type === DataSourceType.MINIO) {
      config = {
        type: DataSourceType.MINIO,
        endpoint: minioConfig.value.endpoint!,
        port: minioConfig.value.port!,
        bucket: minioConfig.value.bucket!,
        accessKey: minioConfig.value.accessKey!,
        secretKey: minioConfig.value.secretKey!,
        useSSL: minioConfig.value.useSSL!,
        pathPrefix: minioConfig.value.pathPrefix
      } as Domain.MinIOConfig
    } else {
      config = {
        ...ossConfig.value,
        type: DataSourceType.OSS
      } as Domain.OSSConfig
    }
    
    const dataSource = await dataSourceStore.createDataSource({
      name: formData.value.name,
      type: formData.value.type,
      status: DataSourceStatus.CONNECTED,
      description: formData.value.description,
      config,
      syncSettings: syncSettings.value as Domain.SyncSettings,
      createdBy: userStore.currentUser?.id || 'user_unknown',
      tags: [],
      enabled: true
    })
    
    emit('created', dataSource.id)
    emit('close')
  } catch (error) {
    console.error('创建数据源失败:', error)
    alert('❌ 创建数据源失败，请重试')
  } finally {
    isCreating.value = false
  }
}

// 取消
const handleCancel = () => {
  emit('close')
}
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

