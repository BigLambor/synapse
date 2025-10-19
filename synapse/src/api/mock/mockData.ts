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
  { id: '1', name: '张三', role: '数据工程师', avatar: '👩', status: 'online' },
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

// ============================================
// 知识图谱 Mock 数据
// ============================================

export interface KnowledgeGraphNode {
  id: string
  label: string
  type: 'product' | 'feature' | 'person' | 'company' | 'technology' | 'problem' | 'solution'
  size: number
  color: string
  x?: number
  y?: number
  description?: string
  metadata?: Record<string, any>
}

export interface KnowledgeGraphEdge {
  id: string
  source: string
  target: string
  label: string
  type: 'depends_on' | 'related_to' | 'causes' | 'solves' | 'implements' | 'competes_with' | 'mentions'
  weight: number
  color?: string
}

export interface KnowledgeGraphData {
  nodes: KnowledgeGraphNode[]
  edges: KnowledgeGraphEdge[]
  statistics: {
    totalNodes: number
    totalEdges: number
    clusters: number
    density: number
  }
}

// 生成知识图谱mock数据
export const mockKnowledgeGraph: KnowledgeGraphData = {
  nodes: [
    // 产品节点
    {
      id: 'node_1',
      label: 'Tesla Model S',
      type: 'product',
      size: 40,
      color: '#6366f1',
      description: 'Tesla旗舰电动轿车',
      metadata: { category: '竞品', mentions: 45 }
    },
    {
      id: 'node_2',
      label: '智能座舱系统',
      type: 'product',
      size: 50,
      color: '#6366f1',
      description: '我们的核心产品',
      metadata: { category: '自有产品', mentions: 89 }
    },
    {
      id: 'node_3',
      label: '小鹏P7',
      type: 'product',
      size: 35,
      color: '#6366f1',
      description: '小鹏汽车智能电动轿车',
      metadata: { category: '竞品', mentions: 38 }
    },
    
    // 功能节点
    {
      id: 'node_4',
      label: '语音唤醒',
      type: 'feature',
      size: 45,
      color: '#8b5cf6',
      description: '免唤醒词语音交互',
      metadata: { importance: 'high', mentions: 67 }
    },
    {
      id: 'node_5',
      label: '手势控制',
      type: 'feature',
      size: 30,
      color: '#8b5cf6',
      description: '无接触手势识别控制',
      metadata: { importance: 'medium', mentions: 42 }
    },
    {
      id: 'node_6',
      label: '情境感知',
      type: 'feature',
      size: 38,
      color: '#8b5cf6',
      description: '基于场景的智能推荐',
      metadata: { importance: 'high', mentions: 55 }
    },
    {
      id: 'node_7',
      label: 'HMI界面',
      type: 'feature',
      size: 42,
      color: '#8b5cf6',
      description: '人机交互界面设计',
      metadata: { importance: 'high', mentions: 58 }
    },
    
    // 技术节点
    {
      id: 'node_8',
      label: 'BERT模型',
      type: 'technology',
      size: 32,
      color: '#14b8a6',
      description: '自然语言处理模型',
      metadata: { type: 'NLP', maturity: 'mature' }
    },
    {
      id: 'node_9',
      label: '远场语音增强',
      type: 'technology',
      size: 35,
      color: '#14b8a6',
      description: '麦克风阵列技术',
      metadata: { type: 'Audio', maturity: 'emerging' }
    },
    {
      id: 'node_10',
      label: 'CNN图像识别',
      type: 'technology',
      size: 28,
      color: '#14b8a6',
      description: '卷积神经网络',
      metadata: { type: 'CV', maturity: 'mature' }
    },
    
    // 问题节点
    {
      id: 'node_11',
      label: '唤醒响应慢',
      type: 'problem',
      size: 38,
      color: '#ef4444',
      description: '用户反馈语音唤醒延迟',
      metadata: { severity: 'high', reports: 156 }
    },
    {
      id: 'node_12',
      label: '噪音环境识别率低',
      type: 'problem',
      size: 35,
      color: '#ef4444',
      description: '嘈杂环境下识别困难',
      metadata: { severity: 'high', reports: 142 }
    },
    {
      id: 'node_13',
      label: 'UI响应卡顿',
      type: 'problem',
      size: 30,
      color: '#ef4444',
      description: '界面交互延迟',
      metadata: { severity: 'medium', reports: 98 }
    },
    
    // 解决方案节点
    {
      id: 'node_14',
      label: '本地唤醒词模型',
      type: 'solution',
      size: 32,
      color: '#10b981',
      description: '端侧唤醒词检测',
      metadata: { status: 'proposed', confidence: 0.85 }
    },
    {
      id: 'node_15',
      label: '多麦克风波束成形',
      type: 'solution',
      size: 35,
      color: '#10b981',
      description: '降噪和语音增强',
      metadata: { status: 'in_progress', confidence: 0.92 }
    },
    {
      id: 'node_16',
      label: 'GPU硬件加速',
      type: 'solution',
      size: 28,
      color: '#10b981',
      description: '图形渲染优化',
      metadata: { status: 'proposed', confidence: 0.78 }
    },
    
    // 公司节点
    {
      id: 'node_17',
      label: 'Tesla',
      type: 'company',
      size: 36,
      color: '#ec4899',
      description: '电动汽车领导者',
      metadata: { industry: 'automotive', mentions: 52 }
    },
    {
      id: 'node_18',
      label: '百度',
      type: 'company',
      size: 32,
      color: '#ec4899',
      description: 'AI技术公司',
      metadata: { industry: 'tech', mentions: 45 }
    },
    {
      id: 'node_19',
      label: '小鹏汽车',
      type: 'company',
      size: 30,
      color: '#ec4899',
      description: '智能电动汽车制造商',
      metadata: { industry: 'automotive', mentions: 41 }
    },
    
    // 人物节点
    {
      id: 'node_20',
      label: '张伟（首席工程师）',
      type: 'person',
      size: 25,
      color: '#f59e0b',
      description: '语音交互技术负责人',
      metadata: { role: 'engineer', department: 'R&D' }
    },
    {
      id: 'node_21',
      label: '李娜（产品经理）',
      type: 'person',
      size: 22,
      color: '#f59e0b',
      description: 'HMI产品负责人',
      metadata: { role: 'pm', department: 'Product' }
    }
  ],
  edges: [
    // 产品-功能关系
    { id: 'edge_1', source: 'node_2', target: 'node_4', label: '包含', type: 'implements', weight: 3, color: '#8b5cf6' },
    { id: 'edge_2', source: 'node_2', target: 'node_5', label: '包含', type: 'implements', weight: 2, color: '#8b5cf6' },
    { id: 'edge_3', source: 'node_2', target: 'node_6', label: '包含', type: 'implements', weight: 3, color: '#8b5cf6' },
    { id: 'edge_4', source: 'node_2', target: 'node_7', label: '包含', type: 'implements', weight: 3, color: '#8b5cf6' },
    
    { id: 'edge_5', source: 'node_1', target: 'node_4', label: '实现', type: 'implements', weight: 2, color: '#8b5cf6' },
    { id: 'edge_6', source: 'node_3', target: 'node_4', label: '实现', type: 'implements', weight: 2, color: '#8b5cf6' },
    
    // 功能-技术关系
    { id: 'edge_7', source: 'node_4', target: 'node_8', label: '依赖', type: 'depends_on', weight: 2, color: '#14b8a6' },
    { id: 'edge_8', source: 'node_4', target: 'node_9', label: '依赖', type: 'depends_on', weight: 3, color: '#14b8a6' },
    { id: 'edge_9', source: 'node_5', target: 'node_10', label: '依赖', type: 'depends_on', weight: 2, color: '#14b8a6' },
    { id: 'edge_10', source: 'node_7', target: 'node_10', label: '相关', type: 'related_to', weight: 1, color: '#94a3b8' },
    
    // 问题-功能关系
    { id: 'edge_11', source: 'node_11', target: 'node_4', label: '影响', type: 'causes', weight: 3, color: '#ef4444' },
    { id: 'edge_12', source: 'node_12', target: 'node_4', label: '影响', type: 'causes', weight: 3, color: '#ef4444' },
    { id: 'edge_13', source: 'node_13', target: 'node_7', label: '影响', type: 'causes', weight: 2, color: '#ef4444' },
    
    // 解决方案-问题关系
    { id: 'edge_14', source: 'node_14', target: 'node_11', label: '解决', type: 'solves', weight: 3, color: '#10b981' },
    { id: 'edge_15', source: 'node_15', target: 'node_12', label: '解决', type: 'solves', weight: 3, color: '#10b981' },
    { id: 'edge_16', source: 'node_16', target: 'node_13', label: '解决', type: 'solves', weight: 2, color: '#10b981' },
    
    // 解决方案-技术关系
    { id: 'edge_17', source: 'node_14', target: 'node_8', label: '使用', type: 'depends_on', weight: 2, color: '#14b8a6' },
    { id: 'edge_18', source: 'node_15', target: 'node_9', label: '实现', type: 'implements', weight: 3, color: '#8b5cf6' },
    
    // 竞品关系
    { id: 'edge_19', source: 'node_2', target: 'node_1', label: '竞争', type: 'competes_with', weight: 2, color: '#f59e0b' },
    { id: 'edge_20', source: 'node_2', target: 'node_3', label: '竞争', type: 'competes_with', weight: 2, color: '#f59e0b' },
    
    // 公司-产品关系
    { id: 'edge_21', source: 'node_17', target: 'node_1', label: '开发', type: 'implements', weight: 2, color: '#8b5cf6' },
    { id: 'edge_22', source: 'node_19', target: 'node_3', label: '开发', type: 'implements', weight: 2, color: '#8b5cf6' },
    
    // 公司-技术关系
    { id: 'edge_23', source: 'node_18', target: 'node_8', label: '研发', type: 'implements', weight: 2, color: '#8b5cf6' },
    { id: 'edge_24', source: 'node_18', target: 'node_9', label: '持有专利', type: 'related_to', weight: 1, color: '#94a3b8' },
    
    // 人物-功能关系
    { id: 'edge_25', source: 'node_20', target: 'node_4', label: '负责', type: 'implements', weight: 2, color: '#8b5cf6' },
    { id: 'edge_26', source: 'node_21', target: 'node_7', label: '负责', type: 'implements', weight: 2, color: '#8b5cf6' },
    
    // 功能之间的依赖
    { id: 'edge_27', source: 'node_6', target: 'node_4', label: '依赖', type: 'depends_on', weight: 2, color: '#14b8a6' },
    { id: 'edge_28', source: 'node_7', target: 'node_6', label: '集成', type: 'related_to', weight: 1, color: '#94a3b8' }
  ],
  statistics: {
    totalNodes: 21,
    totalEdges: 28,
    clusters: 7,
    density: 0.127
  }
}

// ============================================
// 数据集 Mock 数据 - 核心功能：为AI训练提供高质量数据集
// ============================================

import type { Domain } from '@/types/models'
import {
  DatasetStatus,
  AnnotationType,
  AnnotationStatus,
  ExportFormat,
  TrainingPlatform
} from '@/types/enums'

/**
 * Mock 数据集列表
 */
export const mockDatasets: Domain.Dataset[] = [
  {
    id: 'dataset_001',
    name: '智能座舱用户反馈数据集',
    description:
      '收集整理的用户对智能座舱功能的真实反馈数据，包括语音唤醒、触控交互等场景的视频和文档，用于训练和优化语音交互模型。',
    version: '2.1.0',
    status: DatasetStatus.PUBLISHED,
    createdBy: 'user_张三',
    createdAt: '2024-09-15T10:00:00Z',
    updatedAt: '2024-10-01T14:30:00Z',
    publishedAt: '2024-09-20T09:00:00Z',
    assets: [
      {
        assetId: '1',
        assetType: 'video' as any,
        annotations: [
          {
            id: 'ann_001',
            assetId: '1',
            type: AnnotationType.CLASSIFICATION,
            status: AnnotationStatus.APPROVED,
            labels: [
              {
                id: 'label_001',
                name: '语音唤醒失败',
                category: '问题类型',
                confidence: 0.95,
                source: 'manual'
              },
              {
                id: 'label_002',
                name: '噪音环境',
                category: '场景',
                confidence: 0.88,
                source: 'ai'
              }
            ],
            annotator: 'user_张三',
            reviewer: 'user_李四',
            confidence: 0.92,
            createdAt: '2024-09-16T10:00:00Z',
            reviewedAt: '2024-09-17T14:00:00Z',
            notes: '典型的噪音环境下唤醒失败案例'
          }
        ],
        includedAt: '2024-09-15T10:30:00Z',
        split: 'train'
      }
      // 更多资产...
    ],
    totalAssets: 850,
    splits: {
      train: { count: 680, percentage: 80 },
      validation: { count: 85, percentage: 10 },
      test: { count: 85, percentage: 10 }
    },
    quality: {
      completeness: 0.95,
      consistency: 0.92,
      accuracy: 0.94,
      labelQuality: 0.91,
      diversity: 0.88,
      balance: 0.85
    },
    statistics: {
      totalSize: 12800000000, // 12.8GB
      avgFileSize: 15058824,
      minFileSize: 102400,
      maxFileSize: 450000000,
      typeDistribution: {
        video: 450,
        document: 280,
        audio: 120
      },
      labelDistribution: {
        语音唤醒失败: 230,
        触控问题: 180,
        UI问题: 150,
        性能问题: 145,
        其他: 145
      },
      totalAnnotations: 2456,
      avgAnnotationsPerAsset: 2.89
    },
    annotationConfig: {
      types: [AnnotationType.CLASSIFICATION, AnnotationType.TRANSCRIPTION],
      labels: ['语音唤醒失败', '触控问题', 'UI问题', '性能问题', '功能建议', '其他'],
      requireReview: true,
      minAnnotatorsPerAsset: 1,
      guidelines: '请标注用户遇到的主要问题类型，并对视频中的语音内容进行转录'
    },
    exports: [
      {
        id: 'export_001',
        exportedAt: '2024-09-25T10:00:00Z',
        exportedBy: 'user_李四',
        format: ExportFormat.COCO,
        platform: TrainingPlatform.PYTORCH,
        fileSize: 13500000000,
        downloadUrl: '/downloads/dataset_001_coco_v2.1.0.zip',
        config: {
          format: ExportFormat.COCO,
          targetPlatform: TrainingPlatform.PYTORCH,
          includeAugmentations: true,
          normalizeFormat: true,
          generateManifest: true,
          compressOutput: true,
          splits: ['train', 'validation', 'test'],
          cocoOptions: {
            includeSegmentations: false,
            includeCaptions: true
          }
        }
      },
      {
        id: 'export_002',
        exportedAt: '2024-10-01T15:00:00Z',
        exportedBy: 'user_李四',
        format: ExportFormat.HUGGINGFACE,
        platform: TrainingPlatform.HUGGINGFACE,
        fileSize: 13200000000,
        downloadUrl: 'https://huggingface.co/datasets/synapse/smart-cabin-feedback',
        config: {
          format: ExportFormat.HUGGINGFACE,
          targetPlatform: TrainingPlatform.HUGGINGFACE,
          includeAugmentations: false,
          normalizeFormat: true,
          generateManifest: true,
          compressOutput: false,
          splits: ['train', 'validation', 'test'],
          huggingfaceOptions: {
            repoName: 'synapse/smart-cabin-feedback',
            private: false,
            license: 'cc-by-4.0'
          }
        }
      }
    ],
    tags: ['语音交互', '智能座舱', '用户反馈', 'NLP', '质量保证'],
    category: '用户反馈分析'
  },
  {
    id: 'dataset_002',
    name: '竞品UI设计图像数据集',
    description:
      '收集的各品牌智能座舱UI界面截图和设计稿，包含按钮、旋钮、仪表盘等组件的图像数据，用于训练目标检测和分类模型。',
    version: '1.5.0',
    status: DatasetStatus.READY,
    createdBy: 'user_张三',
    createdAt: '2024-09-20T08:00:00Z',
    updatedAt: '2024-10-05T11:00:00Z',
    assets: [],
    totalAssets: 1250,
    splits: {
      train: { count: 1000, percentage: 80 },
      validation: { count: 125, percentage: 10 },
      test: { count: 125, percentage: 10 }
    },
    quality: {
      completeness: 0.88,
      consistency: 0.90,
      accuracy: 0.92,
      labelQuality: 0.89,
      diversity: 0.93,
      balance: 0.82
    },
    statistics: {
      totalSize: 3200000000, // 3.2GB
      avgFileSize: 2560000,
      minFileSize: 204800,
      maxFileSize: 8388608,
      typeDistribution: {
        image: 1250
      },
      labelDistribution: {
        按钮: 450,
        旋钮: 320,
        仪表盘: 280,
        菜单: 200
      },
      totalAnnotations: 4520,
      avgAnnotationsPerAsset: 3.62
    },
    annotationConfig: {
      types: [AnnotationType.DETECTION, AnnotationType.CLASSIFICATION],
      labels: ['按钮', '旋钮', '仪表盘', '菜单', '图标', '文字'],
      requireReview: true,
      minAnnotatorsPerAsset: 2,
      guidelines: '请标注UI组件的边界框和类型，确保标注精确'
    },
    exports: [
      {
        id: 'export_003',
        exportedAt: '2024-10-03T09:00:00Z',
        exportedBy: 'user_李四',
        format: ExportFormat.YOLO,
        platform: TrainingPlatform.PYTORCH,
        fileSize: 3400000000,
        downloadUrl: '/downloads/dataset_002_yolo_v1.5.0.zip',
        config: {
          format: ExportFormat.YOLO,
          targetPlatform: TrainingPlatform.PYTORCH,
          includeAugmentations: true,
          normalizeFormat: true,
          generateManifest: true,
          compressOutput: true,
          splits: ['train', 'validation', 'test'],
          yoloOptions: {
            classMapFile: true,
            normalizeCoordinates: true
          }
        }
      }
    ],
    tags: ['UI设计', '目标检测', '竞品分析', 'CV', '界面元素'],
    category: '设计资产'
  },
  {
    id: 'dataset_003',
    name: '专利文档NER数据集',
    description: '汽车行业专利文档，标注了技术术语、公司名称、人名、地名等实体，用于命名实体识别模型训练。',
    version: '1.0.0',
    status: DatasetStatus.DRAFT,
    createdBy: 'user_张三',
    createdAt: '2024-10-01T14:00:00Z',
    updatedAt: '2024-10-07T10:00:00Z',
    assets: [],
    totalAssets: 560,
    splits: {
      train: { count: 448, percentage: 80 },
      validation: { count: 56, percentage: 10 },
      test: { count: 56, percentage: 10 }
    },
    quality: {
      completeness: 0.65,
      consistency: 0.70,
      accuracy: 0.75,
      labelQuality: 0.68,
      diversity: 0.80,
      balance: 0.75
    },
    statistics: {
      totalSize: 1800000000, // 1.8GB
      avgFileSize: 3214286,
      minFileSize: 512000,
      maxFileSize: 15728640,
      typeDistribution: {
        document: 560
      },
      labelDistribution: {
        技术术语: 3450,
        公司名: 1280,
        人名: 890,
        产品名: 760,
        地名: 520
      },
      totalAnnotations: 1245,
      avgAnnotationsPerAsset: 2.22
    },
    annotationConfig: {
      types: [AnnotationType.NER],
      labels: ['技术术语', '公司名', '人名', '产品名', '地名', '时间', '数字'],
      requireReview: true,
      minAnnotatorsPerAsset: 1,
      guidelines: '标注文档中的命名实体，注意技术术语的完整性'
    },
    exports: [],
    tags: ['NER', '专利分析', 'NLP', '实体识别', '知识图谱'],
    category: '文档分析'
  },
  {
    id: 'dataset_004',
    name: '语音指令多模态数据集',
    description:
      '用户在不同场景下的语音指令录音及对应的场景视频，包含噪音、口音、背景干扰等真实情况，用于训练鲁棒的语音识别模型。',
    version: '3.0.0',
    status: DatasetStatus.PUBLISHED,
    createdBy: 'user_李四',
    createdAt: '2024-08-10T09:00:00Z',
    updatedAt: '2024-10-06T16:00:00Z',
    publishedAt: '2024-09-01T10:00:00Z',
    assets: [],
    totalAssets: 2100,
    splits: {
      train: { count: 1680, percentage: 80 },
      validation: { count: 210, percentage: 10 },
      test: { count: 210, percentage: 10 }
    },
    quality: {
      completeness: 0.97,
      consistency: 0.95,
      accuracy: 0.96,
      labelQuality: 0.94,
      diversity: 0.92,
      balance: 0.90
    },
    statistics: {
      totalSize: 8900000000, // 8.9GB
      avgFileSize: 4238095,
      minFileSize: 307200,
      maxFileSize: 52428800,
      typeDistribution: {
        audio: 1050,
        video: 1050
      },
      labelDistribution: {
        清晰: 890,
        噪音: 680,
        口音: 530
      },
      totalAnnotations: 6850,
      avgAnnotationsPerAsset: 3.26
    },
    annotationConfig: {
      types: [AnnotationType.TRANSCRIPTION, AnnotationType.CLASSIFICATION],
      labels: ['清晰', '噪音', '口音', '背景干扰', '多人说话'],
      requireReview: true,
      minAnnotatorsPerAsset: 2,
      guidelines: '转录语音内容并标注音频质量和环境特征'
    },
    exports: [
      {
        id: 'export_004',
        exportedAt: '2024-09-15T11:00:00Z',
        exportedBy: 'user_李四',
        format: ExportFormat.JSON,
        platform: TrainingPlatform.TENSORFLOW,
        fileSize: 9200000000,
        downloadUrl: '/downloads/dataset_004_json_v3.0.0.zip',
        config: {
          format: ExportFormat.JSON,
          targetPlatform: TrainingPlatform.TENSORFLOW,
          includeAugmentations: true,
          normalizeFormat: true,
          generateManifest: true,
          compressOutput: true,
          splits: ['train', 'validation', 'test']
        }
      }
    ],
    tags: ['语音识别', 'ASR', '多模态', '音频处理', '噪音鲁棒性'],
    category: '语音处理'
  },
  {
    id: 'dataset_005',
    name: '用户情感分析数据集',
    description: '用户评论和反馈文本，标注了情感极性和细粒度情感类别，用于训练情感分析模型。',
    version: '1.2.0',
    status: DatasetStatus.PROCESSING,
    createdBy: 'user_张三',
    createdAt: '2024-10-05T13:00:00Z',
    updatedAt: '2024-10-07T09:30:00Z',
    assets: [],
    totalAssets: 3500,
    splits: {
      train: { count: 2800, percentage: 80 },
      validation: { count: 350, percentage: 10 },
      test: { count: 350, percentage: 10 }
    },
    quality: {
      completeness: 0.45,
      consistency: 0.50,
      accuracy: 0.55,
      labelQuality: 0.48,
      diversity: 0.85,
      balance: 0.65
    },
    statistics: {
      totalSize: 450000000, // 450MB
      avgFileSize: 128571,
      minFileSize: 2048,
      maxFileSize: 1048576,
      typeDistribution: {
        document: 3500
      },
      labelDistribution: {
        正面: 1200,
        负面: 1450,
        中性: 850
      },
      totalAnnotations: 1580,
      avgAnnotationsPerAsset: 0.45
    },
    annotationConfig: {
      types: [AnnotationType.CLASSIFICATION],
      labels: [
        '正面',
        '负面',
        '中性',
        '愤怒',
        '喜悦',
        '悲伤',
        '惊讶',
        '厌恶',
        '恐惧'
      ],
      requireReview: true,
      minAnnotatorsPerAsset: 2,
      guidelines: '标注文本的整体情感倾向和具体情感类别'
    },
    exports: [],
    tags: ['情感分析', 'NLP', '文本分类', '用户反馈'],
    category: '文本分析'
  }
]

/**
 * 获取数据集统计概览
 */
export const getDatasetStatistics = () => ({
  totalDatasets: mockDatasets.length,
  published: mockDatasets.filter((d) => d.status === DatasetStatus.PUBLISHED).length,
  ready: mockDatasets.filter((d) => d.status === DatasetStatus.READY).length,
  draft: mockDatasets.filter((d) => d.status === DatasetStatus.DRAFT).length,
  processing: mockDatasets.filter((d) => d.status === DatasetStatus.PROCESSING).length,
  totalAssets: mockDatasets.reduce((sum, d) => sum + d.totalAssets, 0),
  totalSize: mockDatasets.reduce((sum, d) => sum + d.statistics.totalSize, 0),
  totalExports: mockDatasets.reduce((sum, d) => sum + d.exports.length, 0),
  avgQuality:
    mockDatasets.reduce((sum, d) => sum + d.quality.accuracy, 0) / mockDatasets.length
})

