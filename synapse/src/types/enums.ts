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
  Director = 'Director'
}

export enum NotificationType {
  SUCCESS = 'success',
  ERROR = 'error',
  INFO = 'info',
  WARNING = 'warning'
}

// 数据集相关枚举
export enum DatasetStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  READY = 'ready',
  PUBLISHED = 'published',
  ARCHIVED = 'archived'
}

export enum AnnotationType {
  CLASSIFICATION = 'classification',
  DETECTION = 'detection',
  SEGMENTATION = 'segmentation',
  NER = 'ner',
  QA = 'qa',
  TRANSCRIPTION = 'transcription'
}

export enum AnnotationStatus {
  PENDING = 'pending',
  IN_REVIEW = 'in_review',
  APPROVED = 'approved',
  REJECTED = 'rejected'
}

export enum ExportFormat {
  COCO = 'coco',
  YOLO = 'yolo',
  TFRECORD = 'tfrecord',
  HUGGINGFACE = 'huggingface',
  PASCAL_VOC = 'pascal_voc',
  CSV = 'csv',
  JSON = 'json'
}

export enum TrainingPlatform {
  PYTORCH = 'pytorch',
  TENSORFLOW = 'tensorflow',
  JAX = 'jax',
  HUGGINGFACE = 'huggingface',
  CUSTOM = 'custom'
}

// 数据源相关枚举
export enum DataSourceType {
  WEB_UPLOAD = 'web_upload',
  URL_IMPORT = 'url_import',
  S3 = 's3',
  OSS = 'oss',
  MINIO = 'minio',
  NAS = 'nas',
  AZURE_BLOB = 'azure_blob',
  GOOGLE_CLOUD_STORAGE = 'gcs',
  SHAREPOINT = 'sharepoint',
  GOOGLE_DRIVE = 'google_drive',
  ONEDRIVE = 'onedrive',
  API = 'api',
  KAFKA = 'kafka',
  WEBHOOK = 'webhook'
}

export enum DataSourceStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  SYNCING = 'syncing',
  ERROR = 'error',
  CONFIGURING = 'configuring'
}

export enum SyncSchedule {
  MANUAL = 'manual',
  REALTIME = 'realtime',
  HOURLY = 'hourly',
  EVERY_4_HOURS = 'every_4_hours',
  DAILY = 'daily',
  WEEKLY = 'weekly'
}

export enum UploadMethod {
  DRAG_DROP = 'drag_drop',
  FILE_SELECT = 'file_select',
  URL = 'url',
  STORAGE_SYNC = 'storage_sync',
  API_PUSH = 'api_push'
}
