export interface Asset {
  id: string
  name: string
  type: 'document' | 'video' | 'image' | 'audio'
  size: number
  uploadDate: string
  status: 'processing' | 'completed' | 'failed'
  progress: number
  tags: string[]
  thumbnail?: string
}

export interface DashboardMetric {
  id: string
  label: string
  value: string | number
  change: number
  trend: 'up' | 'down' | 'stable'
  icon: string
}

export interface SearchResult {
  id: string
  title: string
  type: 'document' | 'video' | 'image'
  snippet: string
  relevance: number
  timestamp?: string
  thumbnail?: string
}

// 模拟资产数据
export const mockAssets: Asset[] = [
  {
    id: '1',
    name: '用户访谈-语音唤醒功能.mp4',
    type: 'video',
    size: 45600000,
    uploadDate: '2024-10-05T10:30:00',
    status: 'completed',
    progress: 100,
    tags: ['用户研究', '语音交互', 'UX问题'],
    thumbnail: '🎥'
  },
  {
    id: '2',
    name: '竞品分析报告-智能座舱.pdf',
    type: 'document',
    size: 2340000,
    uploadDate: '2024-10-05T14:20:00',
    status: 'completed',
    progress: 100,
    tags: ['竞品分析', '市场洞察'],
    thumbnail: '📄'
  },
  {
    id: '3',
    name: '专利文档-手势控制.pdf',
    type: 'document',
    size: 1890000,
    uploadDate: '2024-10-06T09:15:00',
    status: 'processing',
    progress: 65,
    tags: ['专利', '手势识别'],
    thumbnail: '📄'
  },
  {
    id: '4',
    name: '用户界面设计稿.png',
    type: 'image',
    size: 5600000,
    uploadDate: '2024-10-06T11:45:00',
    status: 'completed',
    progress: 100,
    tags: ['UI设计', '原型'],
    thumbnail: '🖼️'
  },
  {
    id: '5',
    name: '客户反馈音频-2024Q3.mp3',
    type: 'audio',
    size: 12400000,
    uploadDate: '2024-10-06T16:30:00',
    status: 'processing',
    progress: 30,
    tags: ['客户反馈', '音频分析'],
    thumbnail: '🎵'
  },
  {
    id: '6',
    name: 'Tesla Model S 深度体验.mp4',
    type: 'video',
    size: 67800000,
    uploadDate: '2024-10-04T08:15:00',
    status: 'completed',
    progress: 100,
    tags: ['竞品分析', 'Tesla', '语音系统'],
    thumbnail: '🎥'
  },
  {
    id: '7',
    name: '车载HMI设计规范.pdf',
    type: 'document',
    size: 8900000,
    uploadDate: '2024-10-03T15:30:00',
    status: 'completed',
    progress: 100,
    tags: ['设计规范', 'HMI', '安全标准'],
    thumbnail: '📄'
  },
  {
    id: '8',
    name: '语音识别算法专利-百度.pdf',
    type: 'document',
    size: 3400000,
    uploadDate: '2024-10-02T11:20:00',
    status: 'completed',
    progress: 100,
    tags: ['专利', '语音识别', '百度'],
    thumbnail: '📄'
  },
  {
    id: '9',
    name: '用户痛点可视化看板.png',
    type: 'image',
    size: 2100000,
    uploadDate: '2024-10-01T14:50:00',
    status: 'completed',
    progress: 100,
    tags: ['数据可视化', '用户痛点'],
    thumbnail: '🖼️'
  },
  {
    id: '10',
    name: '客户满意度调研报告.pdf',
    type: 'document',
    size: 5600000,
    uploadDate: '2024-09-30T09:00:00',
    status: 'completed',
    progress: 100,
    tags: ['客户调研', '满意度', 'NPS'],
    thumbnail: '📄'
  }
]

// 仪表板指标
export const mockMetrics: DashboardMetric[] = [
  {
    id: '1',
    label: '总资产数',
    value: 1247,
    change: 12.5,
    trend: 'up',
    icon: '📊'
  },
  {
    id: '2',
    label: '处理速度',
    value: '2.3x',
    change: 45,
    trend: 'up',
    icon: '⚡'
  },
  {
    id: '3',
    label: '洞察生成',
    value: 89,
    change: -3.2,
    trend: 'down',
    icon: '💡'
  },
  {
    id: '4',
    label: '团队协作',
    value: '94%',
    change: 8.1,
    trend: 'up',
    icon: '🤝'
  }
]

// 搜索结果
export const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    title: '用户对语音唤醒反应迟钝的抱怨',
    type: 'video',
    snippet: '在第12分钟，用户明确表示"每次叫小新都要喊三四遍才有反应，很烦人"...',
    relevance: 0.95,
    timestamp: '12:34',
    thumbnail: '🎥'
  },
  {
    id: '2',
    title: '竞品Tesla Model S语音响应时间分析',
    type: 'document',
    snippet: 'Tesla的语音唤醒平均响应时间为0.8秒，而行业平均为1.5秒...',
    relevance: 0.87,
    thumbnail: '📄'
  },
  {
    id: '3',
    title: '专利: 远场语音增强技术',
    type: 'document',
    snippet: '该专利描述了一种多麦克风阵列技术，可在嘈杂环境下提升语音识别准确率...',
    relevance: 0.82,
    thumbnail: '📄'
  },
  {
    id: '4',
    title: 'UI原型: 语音交互可视化反馈',
    type: 'image',
    snippet: '设计稿展示了语音识别过程中的波形动画，提供即时视觉反馈...',
    relevance: 0.78,
    thumbnail: '🖼️'
  }
]

// 处理状态更新数据（用于实时更新）
export const processingStages = [
  { stage: 'upload', label: '文件上传', progress: 100 },
  { stage: 'extract', label: '特征提取', progress: 100 },
  { stage: 'analyze', label: 'AI分析', progress: 75 },
  { stage: 'index', label: '索引构建', progress: 45 },
  { stage: 'complete', label: '完成', progress: 0 }
]

// 团队成员数据
export const teamMembers = [
  { id: '1', name: '张三', role: '市场分析师', avatar: '👩', status: 'online' },
  { id: '2', name: '李四', role: 'AI工程师', avatar: '👨', status: 'online' },
  { id: '3', name: '王五', role: 'Director', avatar: '👩‍💼', status: 'away' }
]

// 近期活动
export const recentActivities = [
  {
    id: '1',
    user: '张三',
    action: '上传了新文件',
    target: '用户访谈-语音唤醒功能.mp4',
    time: '2分钟前',
    type: 'upload'
  },
  {
    id: '2',
    user: '李四',
    action: '创建了数据集',
    target: '语音识别优化数据集 v2.0',
    time: '15分钟前',
    type: 'dataset'
  },
  {
    id: '3',
    user: '张三',
    action: '分享了洞察',
    target: '竞品语音响应速度对比分析',
    time: '1小时前',
    type: 'insight'
  },
  {
    id: '4',
    user: '王五',
    action: '查看了报告',
    target: 'Q3数据资产ROI分析',
    time: '2小时前',
    type: 'view'
  }
]

// 图表数据
export const chartData = {
  // 上传趋势数据
  uploadTrend: {
    labels: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    datasets: [
      {
        label: '文档',
        data: [12, 19, 15, 25, 22, 18, 24],
        color: '#6366f1'
      },
      {
        label: '视频',
        data: [5, 8, 6, 10, 9, 7, 11],
        color: '#8b5cf6'
      },
      {
        label: '图片',
        data: [8, 12, 10, 15, 13, 11, 16],
        color: '#ec4899'
      }
    ]
  },
  // 处理效率数据
  processingEfficiency: {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    data: [65, 72, 78, 85, 88, 92]
  },
  // 资产类型分布
  assetDistribution: [
    { name: '文档', value: 456, color: '#6366f1' },
    { name: '视频', value: 234, color: '#8b5cf6' },
    { name: '图片', value: 389, color: '#ec4899' },
    { name: '音频', value: 168, color: '#14b8a6' }
  ]
}

// 向量可视化数据
export interface VectorPoint {
  id: string
  type: 'document' | 'image' | 'audio' | 'video'
  position: [number, number, number]
  title: string
  cluster?: string
}

// 生成mock向量点数据
export const generateMockVectorPoints = (): VectorPoint[] => {
  const points: VectorPoint[] = []
  const types = [
    { type: 'document' as const, count: 456, clusters: ['产品设计文档', '技术架构资料'] },
    { type: 'image' as const, count: 389, clusters: ['营销素材', '产品设计文档'] },
    { type: 'audio' as const, count: 168, clusters: ['培训教程', '营销素材'] },
    { type: 'video' as const, count: 234, clusters: ['培训教程', '技术架构资料'] }
  ]
  
  let id = 0
  types.forEach(({ type, count, clusters }) => {
    const clusterCenters = clusters.map(() => ({
      x: (Math.random() - 0.5) * 8,
      y: (Math.random() - 0.5) * 8,
      z: (Math.random() - 0.5) * 8
    }))
    
    for (let i = 0; i < count; i++) {
      const cluster = clusters[Math.floor(Math.random() * clusters.length)]
      const centerIndex = clusters.indexOf(cluster)
      const center = clusterCenters[centerIndex]
      
      // 在聚类中心周围生成点，形成聚类效果
      const spread = 1.5
      const x = center.x + (Math.random() - 0.5) * spread
      const y = center.y + (Math.random() - 0.5) * spread
      const z = center.z + (Math.random() - 0.5) * spread
      
      points.push({
        id: `point-${id++}`,
        type,
        position: [x, y, z],
        title: `${type}-${i}`,
        cluster
      })
    }
  })
  
  return points
}

export const mockVectorPoints = generateMockVectorPoints()

