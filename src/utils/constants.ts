// 常量定义

export const APP_NAME = 'Project Synapse'
export const APP_VERSION = '2.0.0'

// API配置
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'
export const API_TIMEOUT = 30000

// 性能预算
export const PERFORMANCE_BUDGET = {
  LCP: 2500, // Largest Contentful Paint (ms)
  FID: 100, // First Input Delay (ms)
  CLS: 0.1, // Cumulative Layout Shift
  INP: 200, // Interaction to Next Paint (ms)
}

// 动画时长
export const ANIMATION_DURATION = {
  MICRO: 150, // 微动画
  SMALL: 300, // 小动画
  MEDIUM: 600, // 中动画
  LARGE: 1200, // 大动画
}

// 缓动函数
export const EASING = {
  OUT_EXPO: 'cubic-bezier(0.16, 1, 0.3, 1)',
  IN_OUT_CIRC: 'cubic-bezier(0.85, 0, 0.15, 1)',
  BOUNCE: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}

// 路由路径
export const ROUTES = {
  LANDING: '/',
  INGESTION: '/ingestion',
  PROCESSING: '/processing',
  EXPLORATION: '/exploration',
  COLLABORATION: '/collaboration',
  MODEL_OPTIMIZATION: '/model-optimization',
  DASHBOARD: '/dashboard',
}

// 默认配置
export const DEFAULT_PAGE_SIZE = 20
export const MAX_UPLOAD_SIZE = 100 * 1024 * 1024 // 100MB
export const SUPPORTED_FILE_TYPES = [
  'video/mp4',
  'video/webm',
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'text/plain',
]
