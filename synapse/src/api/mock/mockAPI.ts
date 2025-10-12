import {
  mockAssets,
  mockMetrics,
  mockSearchResults,
  processingStages,
  recentActivities,
  chartData,
  type Asset,
  type DashboardMetric,
  type SearchResult
} from './mockData'

// 模拟网络延迟 - 优化为更快的响应时间
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// Mock API服务
export const mockAPI = {
  // 获取资产列表
  async getAssets(): Promise<Asset[]> {
    await delay(50)
    return [...mockAssets]
  },

  // 上传文件
  async uploadFile(file: File): Promise<Asset> {
    await delay(100)
    const newAsset: Asset = {
      id: Date.now().toString(),
      name: file.name,
      type: getFileType(file.name),
      size: file.size,
      uploadDate: new Date().toISOString(),
      status: 'processing',
      progress: 0,
      tags: [],
      thumbnail: getFileThumbnail(file.name)
    }
    return newAsset
  },

  // 获取资产详情
  async getAssetById(id: string): Promise<Asset | null> {
    await delay(30)
    return mockAssets.find(asset => asset.id === id) || null
  },

  // 搜索
  async search(query: string): Promise<SearchResult[]> {
    await delay(80)
    if (!query.trim()) {
      return []
    }
    // 简单的模糊搜索
    return mockSearchResults.filter(result =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.snippet.toLowerCase().includes(query.toLowerCase())
    )
  },

  // 获取仪表板指标
  async getDashboardMetrics(): Promise<DashboardMetric[]> {
    await delay(50)
    return [...mockMetrics]
  },

  // 获取处理状态
  async getProcessingStages() {
    await delay(30)
    return [...processingStages]
  },

  // 获取近期活动
  async getRecentActivities() {
    await delay(50)
    return [...recentActivities]
  },

  // 获取图表数据
  async getChartData() {
    await delay(50)
    return { ...chartData }
  },

  // 模拟实时进度更新
  subscribeToProgress(_assetId: string, callback: (progress: number) => void) {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
      }
      callback(Math.floor(progress))
    }, 300)
    
    return () => clearInterval(interval)
  }
}

// 辅助函数
function getFileType(filename: string): Asset['type'] {
  const ext = filename.split('.').pop()?.toLowerCase()
  if (['mp4', 'avi', 'mov', 'mkv'].includes(ext || '')) return 'video'
  if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'image'
  if (['mp3', 'wav', 'ogg', 'm4a'].includes(ext || '')) return 'audio'
  return 'document'
}

function getFileThumbnail(filename: string): string {
  const type = getFileType(filename)
  const thumbnails = {
    video: '🎥',
    image: '🖼️',
    audio: '🎵',
    document: '📄'
  }
  return thumbnails[type]
}

