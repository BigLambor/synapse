// 数据模型类型定义
import {
  AssetType,
  ProcessingStage,
  SearchType,
  TaskStatus,
  UserRole,
  DatasetStatus,
  AnnotationType,
  AnnotationStatus,
  ExportFormat,
  TrainingPlatform,
  DataSourceType,
  DataSourceStatus,
  SyncSchedule,
  UploadMethod
} from './enums'

// 领域模型命名空间
export namespace Domain {
  // 数据资产领域
  export interface Asset {
    id: string
    type: AssetType
    title: string
    source?: string
    uploadedAt: string
    metadata: AssetMetadata
    features: FeatureVeDirectorr
    processingStatus: ProcessingStatus
  }

  export interface AssetMetadata {
    duration?: number
    resolution?: string
    transcription?: string
    keyMoments?: KeyMoment[]
    [key: string]: any
  }

  export interface KeyMoment {
    timestamp: number
    label: string
    sentiment: 'positive' | 'negative' | 'neutral'
  }

  export interface FeatureVeDirectorr {
    embedding: number[]
    tags: string[]
    entities: Entity[]
  }

  export interface Entity {
    type: string
    name: string
    mentions: number
  }

  export interface ProcessingStatus {
    stage: ProcessingStage
    progress: number
    startedAt?: string
    completedAt?: string
    error?: string
  }

  // 搜索领域
  export interface SearchQuery {
    type: SearchType
    content: string | File
    filters?: SearchFilters
  }

  export interface SearchFilters {
    assetTypes?: AssetType[]
    dateRange?: { start: string; end: string }
    minRelevance?: number
    tags?: string[]
  }

  export interface SearchResult {
    id: string
    type: AssetType
    title: string
    relevanceScore: number
    matchReason: string
    highlightedSnippet: string
    thumbnail?: string
    metadata: AssetMetadata
    features: FeatureVeDirectorr
  }

  // 协作领域
  export interface Task {
    id: string
    title: string
    creator: User
    assignee: User
    dataset: DatasetReference
    status: TaskStatus
    createdAt: string
    updatedAt?: string
    completedAt?: string
  }

  export interface DatasetReference {
    assetIds: string[]
    annotations: Annotation[]
  }

  export interface Annotation {
    assetId: string
    timeRange?: [number, number]
    label: string
    notes?: string
  }

  export interface User {
    id: string
    name: string
    role: UserRole
    avatar: string
  }

  // 仪表板领域
  export interface DashboardMetrics {
    totalAssets: number
    todayProcessed: number
    activeUsers: number
    storageUsed: number
    storageLimit: number
    avgProcessingTime: number
    successRate: number
    taskCompletionRate: number
  }

  export interface Insight {
    id: string
    title: string
    assetIds: string[]
    notes: string
    createdAt: string
  }

  // ============================================
  // 数据集领域 - 核心功能：为AI训练提供高质量数据集
  // ============================================

  /**
   * 数据集 - 训练数据的组织单位
   * 作为数据湖的核心产出，提供给AI训练平台使用
   */
  export interface Dataset {
    id: string
    name: string
    description: string
    version: string
    status: DatasetStatus
    createdBy: string
    createdAt: string
    updatedAt: string
    publishedAt?: string

    // 数据组成
    assets: AssetReference[]
    totalAssets: number

    // 数据划分 - 标准训练/验证/测试划分
    splits: DatasetSplit

    // 质量指标 - 确保数据集质量
    quality: QualityMetrics

    // 统计信息
    statistics: DatasetStatistics

    // 标注配置
    annotationConfig: AnnotationConfig

    // 导出历史
    exports: ExportRecord[]

    // 标签和分类
    tags: string[]
    category: string
  }

  /**
   * 资产引用 - 数据集中的资产
   */
  export interface AssetReference {
    assetId: string
    assetType: AssetType
    annotations: DatasetAnnotation[]
    includedAt: string
    split: 'train' | 'validation' | 'test'
  }

  /**
   * 数据集划分配置
   */
  export interface DatasetSplit {
    train: {
      count: number
      percentage: number
    }
    validation: {
      count: number
      percentage: number
    }
    test: {
      count: number
      percentage: number
    }
  }

  /**
   * 质量指标 - 评估数据集质量
   */
  export interface QualityMetrics {
    completeness: number // 完整性 0-1
    consistency: number // 一致性 0-1
    accuracy: number // 准确性 0-1
    labelQuality: number // 标注质量 0-1
    diversity: number // 多样性 0-1
    balance: number // 类别平衡度 0-1
  }

  /**
   * 数据集统计信息
   */
  export interface DatasetStatistics {
    // 基础统计
    totalSize: number // 字节
    avgFileSize: number
    minFileSize: number
    maxFileSize: number

    // 类型分布
    typeDistribution: Record<string, number>

    // 标签分布
    labelDistribution: Record<string, number>

    // 标注统计
    totalAnnotations: number
    avgAnnotationsPerAsset: number
  }

  /**
   * 标注配置
   */
  export interface AnnotationConfig {
    types: AnnotationType[]
    labels: string[]
    requireReview: boolean
    minAnnotatorsPerAsset: number
    guidelines?: string
  }

  /**
   * 数据集标注 - 增强版标注信息
   */
  export interface DatasetAnnotation {
    id: string
    assetId: string
    type: AnnotationType
    status: AnnotationStatus

    // 标注内容
    labels: Label[]
    boundingBoxes?: BoundingBox[]
    segments?: Polygon[]
    entities?: NamedEntity[]
    transcription?: string
    qa?: QuestionAnswer[]

    // 质量控制
    annotator: string
    reviewer?: string
    confidence: number
    createdAt: string
    reviewedAt?: string
    notes?: string
  }

  /**
   * 标签
   */
  export interface Label {
    id: string
    name: string
    category?: string
    confidence: number
    source: 'manual' | 'ai' | 'hybrid'
  }

  /**
   * 边界框 - 用于目标检测
   */
  export interface BoundingBox {
    id: string
    label: string
    x: number
    y: number
    width: number
    height: number
    confidence: number
    attributes?: Record<string, any>
  }

  /**
   * 多边形 - 用于分割
   */
  export interface Polygon {
    id: string
    label: string
    points: Array<{ x: number; y: number }>
    confidence: number
  }

  /**
   * 命名实体 - 用于NER
   */
  export interface NamedEntity {
    id: string
    text: string
    label: string
    start: number
    end: number
    confidence: number
  }

  /**
   * 问答对 - 用于QA任务
   */
  export interface QuestionAnswer {
    id: string
    question: string
    answer: string
    context?: string
    confidence: number
  }

  /**
   * 导出记录
   */
  export interface ExportRecord {
    id: string
    exportedAt: string
    exportedBy: string
    format: ExportFormat
    platform: TrainingPlatform
    fileSize: number
    downloadUrl: string
    config: DatasetExportConfig
  }

  /**
   * 数据集导出配置
   */
  export interface DatasetExportConfig {
    format: ExportFormat
    targetPlatform: TrainingPlatform

    // 导出选项
    includeAugmentations: boolean
    normalizeFormat: boolean
    generateManifest: boolean
    compressOutput: boolean

    // 数据选择
    splits: ('train' | 'validation' | 'test')[]
    assetTypes?: AssetType[]

    // 格式特定选项
    cocoOptions?: {
      includeSegmentations: boolean
      includeCaptions: boolean
    }
    yoloOptions?: {
      classMapFile: boolean
      normalizeCoordinates: boolean
    }
    huggingfaceOptions?: {
      repoName?: string
      private: boolean
      license?: string
    }
  }

  /**
   * 数据集创建配置
   */
  export interface DatasetCreateConfig {
    name: string
    description: string
    category: string
    tags: string[]
    assetIds: string[]
    splitRatio?: {
      train: number
      validation: number
      test: number
    }
    annotationConfig: AnnotationConfig
  }

  /**
   * 数据集质量报告
   */
  export interface QualityReport {
    datasetId: string
    generatedAt: string
    overallScore: number // 0-100
    metrics: QualityMetrics
    issues: QualityIssue[]
    recommendations: string[]
  }

  /**
   * 质量问题
   */
  export interface QualityIssue {
    severity: 'low' | 'medium' | 'high' | 'critical'
    type: string
    description: string
    affectedAssets: string[]
    suggestedFix?: string
  }

  // ============================================
  // 数据源领域 - 企业级数据接入
  // ============================================

  /**
   * 数据源 - 统一的数据接入抽象
   */
  export interface DataSource {
    id: string
    name: string
    type: DataSourceType
    status: DataSourceStatus
    description?: string
    
    // 配置信息
    config: DataSourceConfig
    
    // 同步设置
    syncSettings: SyncSettings
    
    // 统计信息
    statistics: DataSourceStatistics
    
    // 元数据
    createdBy: string
    createdAt: string
    updatedAt: string
    lastSyncAt?: string
    
    // 标签和分类
    tags: string[]
    enabled: boolean
  }

  /**
   * 数据源配置 - 联合类型，根据不同数据源类型有不同配置
   */
  export type DataSourceConfig =
    | S3Config
    | OSSConfig
    | MinIOConfig
    | NASConfig
    | AzureBlobConfig
    | GCSConfig
    | SharePointConfig
    | CloudDriveConfig
    | APIConfig
    | KafkaConfig
    | WebhookConfig

  /**
   * S3兼容对象存储配置
   */
  export interface S3Config {
    type: DataSourceType.S3 | DataSourceType.MINIO
    endpoint: string
    region?: string
    bucket: string
    accessKeyId: string
    secretAccessKey: string
    useSSL: boolean
    pathPrefix?: string
  }

  /**
   * 阿里云OSS配置
   */
  export interface OSSConfig {
    type: DataSourceType.OSS
    endpoint: string
    region: string
    bucket: string
    accessKeyId: string
    accessKeySecret: string
    pathPrefix?: string
  }

  /**
   * MinIO配置
   */
  export interface MinIOConfig {
    type: DataSourceType.MINIO
    endpoint: string
    port: number
    bucket: string
    accessKey: string
    secretKey: string
    useSSL: boolean
    pathPrefix?: string
  }

  /**
   * NAS网络存储配置
   */
  export interface NASConfig {
    type: DataSourceType.NAS
    protocol: 'nfs' | 'smb' | 'cifs'
    host: string
    sharePath: string
    mountPoint: string
    username?: string
    password?: string
  }

  /**
   * Azure Blob存储配置
   */
  export interface AzureBlobConfig {
    type: DataSourceType.AZURE_BLOB
    accountName: string
    accountKey: string
    containerName: string
    endpoint?: string
    pathPrefix?: string
  }

  /**
   * Google Cloud Storage配置
   */
  export interface GCSConfig {
    type: DataSourceType.GOOGLE_CLOUD_STORAGE
    projectId: string
    bucket: string
    credentialsJson: string
    pathPrefix?: string
  }

  /**
   * SharePoint配置
   */
  export interface SharePointConfig {
    type: DataSourceType.SHAREPOINT
    siteUrl: string
    clientId: string
    clientSecret: string
    tenantId: string
    libraryName: string
    folderPath?: string
  }

  /**
   * 云盘配置（Google Drive / OneDrive）
   */
  export interface CloudDriveConfig {
    type: DataSourceType.GOOGLE_DRIVE | DataSourceType.ONEDRIVE
    clientId: string
    clientSecret: string
    refreshToken: string
    folderPath?: string
  }

  /**
   * API配置
   */
  export interface APIConfig {
    type: DataSourceType.API
    endpoint: string
    authType: 'none' | 'api_key' | 'oauth2' | 'basic'
    apiKey?: string
    username?: string
    password?: string
    headers?: Record<string, string>
  }

  /**
   * Kafka配置
   */
  export interface KafkaConfig {
    type: DataSourceType.KAFKA
    brokers: string[]
    topic: string
    groupId: string
    saslMechanism?: 'PLAIN' | 'SCRAM-SHA-256' | 'SCRAM-SHA-512'
    username?: string
    password?: string
  }

  /**
   * Webhook配置
   */
  export interface WebhookConfig {
    type: DataSourceType.WEBHOOK
    webhookUrl: string
    secret?: string
    verifySSL: boolean
  }

  /**
   * 同步设置
   */
  export interface SyncSettings {
    schedule: SyncSchedule
    cronExpression?: string // 自定义cron表达式
    autoImport: boolean
    
    // 导入规则
    rules: ImportRule[]
    
    // 过滤器
    filters: SyncFilters
    
    // 并发控制
    maxConcurrentFiles: number
    batchSize: number
  }

  /**
   * 导入规则
   */
  export interface ImportRule {
    pathPattern: string // glob模式，如 /user-feedbacks/**/*.mp4
    category: string
    tags: string[]
    autoProcess: boolean
    priority: number
  }

  /**
   * 同步过滤器
   */
  export interface SyncFilters {
    // 文件类型过滤
    allowedExtensions?: string[]
    excludedExtensions?: string[]
    
    // 大小过滤
    minSize?: number // 字节
    maxSize?: number // 字节
    
    // 时间过滤
    modifiedAfter?: string
    modifiedBefore?: string
    
    // 路径过滤
    includePaths?: string[]
    excludePaths?: string[]
  }

  /**
   * 数据源统计信息
   */
  export interface DataSourceStatistics {
    totalFiles: number
    totalSize: number // 字节
    syncedFiles: number
    syncedSize: number
    failedFiles: number
    lastSyncDuration?: number // 毫秒
    avgSyncSpeed?: number // bytes/sec
  }

  /**
   * 同步任务
   */
  export interface SyncTask {
    id: string
    dataSourceId: string
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    startedAt: string
    completedAt?: string
    
    progress: {
      total: number
      processed: number
      failed: number
      percentage: number
    }
    
    results: {
      newFiles: number
      updatedFiles: number
      skippedFiles: number
      errors: SyncError[]
    }
  }

  /**
   * 同步错误
   */
  export interface SyncError {
    filePath: string
    error: string
    timestamp: string
  }

  /**
   * 上传配置 - 用于Web上传
   */
  export interface UploadConfig {
    // 大文件分片配置
    chunkSize: number // 每片大小，字节
    maxFileSize: number // 最大文件大小
    maxConcurrentUploads: number // 最大并发上传数
    
    // 断点续传
    enableResume: boolean
    resumeTimeout: number // 毫秒
    
    // 支持的文件类型
    allowedMimeTypes: string[]
    allowedExtensions: string[]
    
    // 自动处理
    autoProcess: boolean
  }

  /**
   * 上传任务
   */
  export interface UploadTask {
    id: string
    file: File
    method: UploadMethod
    status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed' | 'paused'
    
    // 进度信息
    progress: {
      uploadedBytes: number
      totalBytes: number
      percentage: number
      speed: number // bytes/sec
      remainingTime: number // 秒
    }
    
    // 分片信息（大文件）
    chunks?: {
      total: number
      uploaded: number
      failed: number[]
    }
    
    // 元数据
    category?: string
    tags?: string[]
    
    // 时间戳
    createdAt: string
    startedAt?: string
    completedAt?: string
    
    // 结果
    assetId?: string
    error?: string
  }

  /**
   * URL导入任务
   */
  export interface URLImportTask {
    id: string
    url: string
    status: 'pending' | 'downloading' | 'processing' | 'completed' | 'failed'
    
    progress: {
      downloadedBytes: number
      totalBytes: number
      percentage: number
    }
    
    fileName?: string
    fileType?: string
    category?: string
    tags?: string[]
    
    createdAt: string
    completedAt?: string
    assetId?: string
    error?: string
  }

  /**
   * 批量操作
   */
  export interface BatchOperation {
    id: string
    type: 'upload' | 'import' | 'sync'
    status: 'pending' | 'running' | 'completed' | 'failed' | 'cancelled'
    
    items: (UploadTask | URLImportTask | SyncTask)[]
    
    progress: {
      total: number
      completed: number
      failed: number
      percentage: number
    }
    
    createdAt: string
    startedAt?: string
    completedAt?: string
  }
}
