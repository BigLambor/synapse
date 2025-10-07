// 枚举类型定义

export enum AssetType {
  VIDEO = 'video',
  PDF = 'pdf',
  IMAGE = 'image',
  PATENT = 'patent',
  DOCUMENT = 'document'
}

export enum ProcessingStage {
  UPLOADING = 'uploading',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

export enum SearchType {
  TEXT = 'text',
  IMAGE = 'image',
  SEMANTIC = 'semantic'
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum UserRole {
  MARKET_ANALYST = 'Market Analyst',
  AI_ENGINEER = 'AI Engineer',
  CTO = 'CTO'
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}
