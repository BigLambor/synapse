import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Domain } from '@/types/models'
import { DataSourceType, DataSourceStatus, SyncSchedule, UploadMethod } from '@/types/enums'

export const useDataSourceStore = defineStore('dataSource', () => {
  // ============================================
  // State
  // ============================================
  
  const dataSources = ref<Domain.DataSource[]>([])
  const uploadTasks = ref<Domain.UploadTask[]>([])
  const urlImportTasks = ref<Domain.URLImportTask[]>([])
  const syncTasks = ref<Domain.SyncTask[]>([])
  const batchOperations = ref<Domain.BatchOperation[]>([])
  
  const uploadConfig = ref<Domain.UploadConfig>({
    chunkSize: 5 * 1024 * 1024, // 5MB
    maxFileSize: 10 * 1024 * 1024 * 1024, // 10GB
    maxConcurrentUploads: 3,
    enableResume: true,
    resumeTimeout: 30000, // 30秒
    allowedMimeTypes: [
      'video/*',
      'image/*',
      'audio/*',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/*'
    ],
    allowedExtensions: [
      '.mp4', '.avi', '.mov', '.mkv',
      '.jpg', '.jpeg', '.png', '.gif', '.webp',
      '.mp3', '.wav', '.m4a',
      '.pdf', '.doc', '.docx', '.txt', '.md'
    ],
    autoProcess: true
  })

  // ============================================
  // Computed
  // ============================================
  
  const activeDataSources = computed(() => 
    dataSources.value.filter(ds => ds.enabled && ds.status === DataSourceStatus.CONNECTED)
  )
  
  const activeUploads = computed(() => 
    uploadTasks.value.filter(t => t.status === 'uploading' || t.status === 'pending')
  )
  
  const totalUploadProgress = computed(() => {
    if (activeUploads.value.length === 0) return 0
    const total = activeUploads.value.reduce((sum, task) => sum + task.progress.percentage, 0)
    return total / activeUploads.value.length
  })

  // ============================================
  // 数据源管理
  // ============================================
  
  /**
   * 获取所有数据源
   */
  async function fetchDataSources() {
    // Mock数据 - 实际应该调用API
    await new Promise(resolve => setTimeout(resolve, 500))
    
    dataSources.value = [
      {
        id: 'ds_001',
        name: '企业对象存储',
        type: DataSourceType.S3,
        status: DataSourceStatus.CONNECTED,
        description: '公司主对象存储，存放所有用户反馈和设计资产',
        config: {
          type: DataSourceType.S3,
          endpoint: 'https://s3.company.com',
          region: 'cn-north-1',
          bucket: 'ai-training-data',
          accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
          secretAccessKey: '***',
          useSSL: true,
          pathPrefix: 'synapse/'
        } as Domain.S3Config,
        syncSettings: {
          schedule: SyncSchedule.EVERY_4_HOURS,
          autoImport: true,
          rules: [
            {
              pathPattern: '/user-feedbacks/**/*.mp4',
              category: '用户反馈',
              tags: ['视频', '语音交互'],
              autoProcess: true,
              priority: 1
            },
            {
              pathPattern: '/competitor-screenshots/**/*.png',
              category: '竞品分析',
              tags: ['UI设计', '截图'],
              autoProcess: true,
              priority: 2
            }
          ],
          filters: {
            allowedExtensions: ['.mp4', '.png', '.jpg', '.pdf'],
            minSize: 1024, // 1KB
            maxSize: 5 * 1024 * 1024 * 1024 // 5GB
          },
          maxConcurrentFiles: 5,
          batchSize: 50
        },
        statistics: {
          totalFiles: 1247,
          totalSize: 156.8 * 1024 * 1024 * 1024, // 156.8GB
          syncedFiles: 1247,
          syncedSize: 156.8 * 1024 * 1024 * 1024,
          failedFiles: 3,
          lastSyncDuration: 3600000, // 1小时
          avgSyncSpeed: 43.6 * 1024 * 1024 // 43.6 MB/s
        },
        createdBy: 'user_王五',
        createdAt: '2024-10-01T10:00:00Z',
        updatedAt: '2024-10-14T08:30:00Z',
        lastSyncAt: '2024-10-14T08:30:00Z',
        tags: ['生产环境', '主存储'],
        enabled: true
      },
      {
        id: 'ds_002',
        name: 'MinIO开发环境',
        type: DataSourceType.MINIO,
        status: DataSourceStatus.CONNECTED,
        description: '开发测试用MinIO存储',
        config: {
          type: DataSourceType.MINIO,
          endpoint: 'minio.dev.company.com',
          port: 9000,
          bucket: 'synapse-dev',
          accessKey: 'minioadmin',
          secretKey: '***',
          useSSL: false,
          pathPrefix: 'test-data/'
        } as Domain.MinIOConfig,
        syncSettings: {
          schedule: SyncSchedule.MANUAL,
          autoImport: false,
          rules: [],
          filters: {},
          maxConcurrentFiles: 3,
          batchSize: 20
        },
        statistics: {
          totalFiles: 85,
          totalSize: 2.3 * 1024 * 1024 * 1024, // 2.3GB
          syncedFiles: 85,
          syncedSize: 2.3 * 1024 * 1024 * 1024,
          failedFiles: 0,
          lastSyncDuration: 120000, // 2分钟
          avgSyncSpeed: 19.5 * 1024 * 1024 // 19.5 MB/s
        },
        createdBy: 'user_李四',
        createdAt: '2024-10-05T14:20:00Z',
        updatedAt: '2024-10-13T16:45:00Z',
        lastSyncAt: '2024-10-13T16:45:00Z',
        tags: ['开发环境', '测试'],
        enabled: true
      }
    ]
  }

  /**
   * 创建数据源
   */
  async function createDataSource(config: Omit<Domain.DataSource, 'id' | 'createdAt' | 'updatedAt' | 'statistics'>) {
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newDataSource: Domain.DataSource = {
      ...config,
      id: `ds_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statistics: {
        totalFiles: 0,
        totalSize: 0,
        syncedFiles: 0,
        syncedSize: 0,
        failedFiles: 0
      }
    }
    
    dataSources.value.push(newDataSource)
    return newDataSource
  }

  /**
   * 测试数据源连接
   */
  async function testConnection(config: Domain.DataSourceConfig): Promise<{ success: boolean; message: string }> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Mock测试结果
    const success = Math.random() > 0.2 // 80%成功率
    
    return {
      success,
      message: success 
        ? '连接成功！已成功访问存储桶。' 
        : '连接失败：无法访问存储桶，请检查配置信息。'
    }
  }

  /**
   * 触发同步
   */
  async function triggerSync(dataSourceId: string) {
    const dataSource = dataSources.value.find(ds => ds.id === dataSourceId)
    if (!dataSource) throw new Error('数据源不存在')
    
    dataSource.status = DataSourceStatus.SYNCING
    
    const syncTask: Domain.SyncTask = {
      id: `sync_${Date.now()}`,
      dataSourceId,
      status: 'running',
      startedAt: new Date().toISOString(),
      progress: {
        total: 100,
        processed: 0,
        failed: 0,
        percentage: 0
      },
      results: {
        newFiles: 0,
        updatedFiles: 0,
        skippedFiles: 0,
        errors: []
      }
    }
    
    syncTasks.value.push(syncTask)
    
    // 模拟同步进度
    const interval = setInterval(() => {
      if (syncTask.progress.processed < syncTask.progress.total) {
        syncTask.progress.processed += Math.floor(Math.random() * 10) + 1
        syncTask.progress.percentage = Math.min(
          Math.floor((syncTask.progress.processed / syncTask.progress.total) * 100),
          100
        )
      } else {
        clearInterval(interval)
        syncTask.status = 'completed'
        syncTask.completedAt = new Date().toISOString()
        syncTask.results.newFiles = 15
        syncTask.results.updatedFiles = 3
        syncTask.results.skippedFiles = 82
        
        dataSource.status = DataSourceStatus.CONNECTED
        dataSource.lastSyncAt = new Date().toISOString()
      }
    }, 200)
    
    return syncTask
  }

  // ============================================
  // Web上传（增强版）
  // ============================================
  
  /**
   * 创建上传任务
   */
  function createUploadTask(file: File, options?: {
    category?: string
    tags?: string[]
    method?: UploadMethod
  }): Domain.UploadTask {
    const task: Domain.UploadTask = {
      id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      file,
      method: options?.method || UploadMethod.FILE_SELECT,
      status: 'pending',
      progress: {
        uploadedBytes: 0,
        totalBytes: file.size,
        percentage: 0,
        speed: 0,
        remainingTime: 0
      },
      category: options?.category,
      tags: options?.tags,
      createdAt: new Date().toISOString()
    }
    
    // 如果是大文件，计算分片信息
    if (file.size > uploadConfig.value.chunkSize) {
      task.chunks = {
        total: Math.ceil(file.size / uploadConfig.value.chunkSize),
        uploaded: 0,
        failed: []
      }
    }
    
    uploadTasks.value.push(task)
    return task
  }

  /**
   * 开始上传
   */
  async function startUpload(taskId: string) {
    const task = uploadTasks.value.find(t => t.id === taskId)
    if (!task) throw new Error('上传任务不存在')
    
    task.status = 'uploading'
    task.startedAt = new Date().toISOString()
    
    if (task.chunks) {
      // 大文件分片上传
      await uploadFileInChunks(task)
    } else {
      // 小文件直接上传
      await uploadFileDirectly(task)
    }
  }

  /**
   * 分片上传大文件
   */
  async function uploadFileInChunks(task: Domain.UploadTask) {
    const { file, chunks } = task
    if (!chunks) return
    
    const chunkSize = uploadConfig.value.chunkSize
    const startTime = Date.now()
    
    for (let i = 0; i < chunks.total; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      
      try {
        // 模拟上传分片
        await uploadChunk(chunk, i, task.id)
        
        chunks.uploaded++
        task.progress.uploadedBytes = end
        task.progress.percentage = Math.floor((end / file.size) * 100)
        
        // 计算速度和剩余时间
        const elapsed = (Date.now() - startTime) / 1000
        task.progress.speed = task.progress.uploadedBytes / elapsed
        task.progress.remainingTime = Math.ceil(
          (file.size - task.progress.uploadedBytes) / task.progress.speed
        )
      } catch (error) {
        chunks.failed.push(i)
        task.status = 'failed'
        task.error = `分片${i}上传失败`
        throw error
      }
    }
    
    // 上传完成，开始处理
    task.status = 'processing'
    await processUploadedFile(task)
  }

  /**
   * 直接上传小文件
   */
  async function uploadFileDirectly(task: Domain.UploadTask) {
    const startTime = Date.now()
    const { file } = task
    
    // 模拟上传进度
    const totalSteps = 10
    for (let i = 0; i <= totalSteps; i++) {
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200))
      
      task.progress.uploadedBytes = Math.floor((file.size / totalSteps) * i)
      task.progress.percentage = Math.floor((i / totalSteps) * 100)
      
      const elapsed = (Date.now() - startTime) / 1000
      task.progress.speed = task.progress.uploadedBytes / elapsed
      task.progress.remainingTime = Math.ceil(
        (file.size - task.progress.uploadedBytes) / task.progress.speed
      )
    }
    
    task.status = 'processing'
    await processUploadedFile(task)
  }

  /**
   * 上传单个分片
   */
  async function uploadChunk(chunk: Blob, index: number, taskId: string) {
    // Mock API调用
    await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 300))
    
    // 实际实现应该调用:
    // const formData = new FormData()
    // formData.append('chunk', chunk)
    // formData.append('index', index.toString())
    // formData.append('taskId', taskId)
    // await fetch('/api/upload/chunk', { method: 'POST', body: formData })
  }

  /**
   * 处理已上传的文件
   */
  async function processUploadedFile(task: Domain.UploadTask) {
    // 模拟AI处理
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    task.status = 'completed'
    task.completedAt = new Date().toISOString()
    task.assetId = `asset_${Date.now()}`
  }

  /**
   * 暂停上传
   */
  function pauseUpload(taskId: string) {
    const task = uploadTasks.value.find(t => t.id === taskId)
    if (task && task.status === 'uploading') {
      task.status = 'paused'
    }
  }

  /**
   * 恢复上传
   */
  async function resumeUpload(taskId: string) {
    const task = uploadTasks.value.find(t => t.id === taskId)
    if (task && task.status === 'paused') {
      await startUpload(taskId)
    }
  }

  /**
   * 取消上传
   */
  function cancelUpload(taskId: string) {
    const index = uploadTasks.value.findIndex(t => t.id === taskId)
    if (index !== -1) {
      uploadTasks.value.splice(index, 1)
    }
  }

  /**
   * 批量上传
   */
  async function uploadFiles(files: File[], options?: {
    category?: string
    tags?: string[]
    method?: UploadMethod
  }) {
    const tasks = files.map(file => createUploadTask(file, options))
    
    // 创建批量操作
    const batchOp: Domain.BatchOperation = {
      id: `batch_${Date.now()}`,
      type: 'upload',
      status: 'running',
      items: tasks,
      progress: {
        total: tasks.length,
        completed: 0,
        failed: 0,
        percentage: 0
      },
      createdAt: new Date().toISOString(),
      startedAt: new Date().toISOString()
    }
    
    batchOperations.value.push(batchOp)
    
    // 并发控制上传
    const maxConcurrent = uploadConfig.value.maxConcurrentUploads
    const queue = [...tasks]
    const executing: Promise<void>[] = []
    
    while (queue.length > 0 || executing.length > 0) {
      while (executing.length < maxConcurrent && queue.length > 0) {
        const task = queue.shift()!
        const promise = startUpload(task.id)
          .then(() => {
            batchOp.progress.completed++
          })
          .catch(() => {
            batchOp.progress.failed++
          })
          .finally(() => {
            const index = executing.indexOf(promise)
            if (index !== -1) executing.splice(index, 1)
            
            batchOp.progress.percentage = Math.floor(
              ((batchOp.progress.completed + batchOp.progress.failed) / batchOp.progress.total) * 100
            )
          })
        
        executing.push(promise)
      }
      
      if (executing.length > 0) {
        await Promise.race(executing)
      }
    }
    
    batchOp.status = 'completed'
    batchOp.completedAt = new Date().toISOString()
    
    return batchOp
  }

  // ============================================
  // URL导入
  // ============================================
  
  /**
   * 从URL导入文件
   */
  async function importFromURL(url: string, options?: {
    category?: string
    tags?: string[]
  }): Promise<Domain.URLImportTask> {
    const task: Domain.URLImportTask = {
      id: `url_import_${Date.now()}`,
      url,
      status: 'pending',
      progress: {
        downloadedBytes: 0,
        totalBytes: 0,
        percentage: 0
      },
      category: options?.category,
      tags: options?.tags,
      createdAt: new Date().toISOString()
    }
    
    urlImportTasks.value.push(task)
    
    // 开始下载
    task.status = 'downloading'
    
    // 模拟下载进度
    await new Promise<void>((resolve) => {
      let downloaded = 0
      const totalSize = Math.floor(Math.random() * 100) * 1024 * 1024 // 随机大小
      task.progress.totalBytes = totalSize
      
      const interval = setInterval(() => {
        downloaded += Math.floor(Math.random() * 10) * 1024 * 1024
        
        if (downloaded >= totalSize) {
          downloaded = totalSize
          clearInterval(interval)
          resolve()
        }
        
        task.progress.downloadedBytes = downloaded
        task.progress.percentage = Math.floor((downloaded / totalSize) * 100)
      }, 300)
    })
    
    // 开始处理
    task.status = 'processing'
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // 完成
    task.status = 'completed'
    task.completedAt = new Date().toISOString()
    task.assetId = `asset_${Date.now()}`
    task.fileName = url.split('/').pop() || 'imported-file'
    
    return task
  }

  /**
   * 批量URL导入
   */
  async function importFromURLs(urls: string[], options?: {
    category?: string
    tags?: string[]
  }) {
    const tasks = await Promise.all(
      urls.map(url => importFromURL(url, options))
    )
    
    return tasks
  }

  // ============================================
  // 工具函数
  // ============================================
  
  /**
   * 清理已完成的任务
   */
  function clearCompletedTasks() {
    uploadTasks.value = uploadTasks.value.filter(t => 
      t.status !== 'completed' && t.status !== 'failed'
    )
    urlImportTasks.value = urlImportTasks.value.filter(t => 
      t.status !== 'completed' && t.status !== 'failed'
    )
  }

  /**
   * 获取数据源统计
   */
  const dataSourceStats = computed(() => {
    const total = dataSources.value.length
    const connected = dataSources.value.filter(ds => ds.status === DataSourceStatus.CONNECTED).length
    const syncing = dataSources.value.filter(ds => ds.status === DataSourceStatus.SYNCING).length
    const totalFiles = dataSources.value.reduce((sum, ds) => sum + ds.statistics.totalFiles, 0)
    const totalSize = dataSources.value.reduce((sum, ds) => sum + ds.statistics.totalSize, 0)
    
    return {
      total,
      connected,
      syncing,
      totalFiles,
      totalSize
    }
  })

  return {
    // State
    dataSources,
    uploadTasks,
    urlImportTasks,
    syncTasks,
    batchOperations,
    uploadConfig,
    
    // Computed
    activeDataSources,
    activeUploads,
    totalUploadProgress,
    dataSourceStats,
    
    // 数据源管理
    fetchDataSources,
    createDataSource,
    testConnection,
    triggerSync,
    
    // Web上传
    createUploadTask,
    startUpload,
    pauseUpload,
    resumeUpload,
    cancelUpload,
    uploadFiles,
    
    // URL导入
    importFromURL,
    importFromURLs,
    
    // 工具函数
    clearCompletedTasks
  }
})
