// 数据模型类型定义
import { AssetType, ProcessingStage, SearchType, TaskStatus, UserRole } from './enums'

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
}
