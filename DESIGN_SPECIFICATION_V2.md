# **Synapse - AI洞察引擎动态演示平台**
## **设计规范文档 v2.0**

---

## **📋 执行摘要 (Executive Summary)**

本文档定义了 Synapse 动态演示平台的完整技术架构与实施方案。该平台是一个企业级、可交互的前端应用，旨在向决策层、客户及技术团队展示多模态AI数据湖的端到端价值。

**核心改进点**：
- ✅ 强化的技术栈，引入 TypeScript、测试框架和性能监控
- ✅ 领域驱动的架构设计，提升代码可维护性
- ✅ 增强的用户体验，包括引导教程和无障碍支持
- ✅ 3D可视化能力，更直观展示AI概念
- ✅ 完善的开发工作流，集成 Storybook 和 CI/CD

---

## **1. 产品愿景与核心价值 (Vision & Core Value)**

### **1.1 业务目标**
构建一个**生产就绪级**的演示平台，不仅用于展示，更可作为真实产品的原型基础。通过"展示即产品"的理念，加速从演示到生产的转化。

### **1.2 目标受众**
| 角色 | 关注点 | 交互深度 |
|:-----|:------|:--------|
| **C-Level高管** | ROI、业务价值、战略定位 | 浅层（观看预设演示流程） |
| **技术决策者** | 架构可行性、技术先进性 | 中层（交互探索核心功能） |
| **潜在客户** | 解决方案匹配度、易用性 | 深层（完整体验所有功能） |
| **内部团队** | 协作效率、功能完整性 | 深层（压力测试与边界探索） |

### **1.3 成功指标**
- **业务层面**: 演示后的转化率提升 40%
- **技术层面**: 核心交互响应时间 < 200ms
- **用户层面**: SUS（系统可用性量表）得分 > 80

---

## **2. 叙事框架与用户旅程 (Narrative Framework & User Journey)**

### **2.1 故事背景强化**

**场景**: "新星汽车" (Nova Automotive) 正在研发下一代智能座舱系统 "Sirius Pro"，面临激烈的市场竞争和快速迭代压力。

**核心矛盾**:
- 💥 **数据孤岛**: 用户评论、专利文档、测试视频分散在不同系统
- 💥 **洞察延迟**: 从数据收集到决策支持需要数周时间
- 💥 **协作壁垒**: 业务分析师与AI工程师之间存在知识鸿沟

### **2.2 角色深化**

#### **张三 - 高级市场分析师**
- **背景**: 8年汽车行业经验，MBA学位，擅长竞品分析
- **痛点**: 每天需要手动浏览50+份文档和视频，难以发现隐藏洞察
- **目标**: 快速定位用户痛点，为产品团队提供可行动的建议

#### **李四 - AI工程师**
- **背景**: 3年NLP经验，专注语音交互系统优化
- **痛点**: 获取高质量标注数据困难，模型迭代周期长
- **目标**: 用真实场景数据快速验证模型改进效果

#### **新增角色: 王五 - 技术总监 (观察者视角)**
- **目标**: 通过实时仪表板监控团队协作效率和数据资产ROI

### **2.3 增强的故事线 (7幕剧结构)**

```
幕一：危机展示 (The Crisis)
└─ 动画展示数据孤岛的混乱状态，痛点量化指标

幕二：解决方案登场 (Solution Introduction)
└─ Synapse平台界面优雅展现，配合品牌动画

幕三：数据汇聚 (Data Convergence)
└─ 拖拽上传多种文件类型，实时处理进度可视化

幕四：智能理解 (AI Understanding)
├─ 特征提取过程的3D向量空间动画
└─ 自动标签生成与知识图谱构建

幕五：多模态探索 (Multimodal Exploration)
├─ 文本搜索："语音唤醒问题" → 精准定位视频片段
├─ 图像搜索：竞品旋钮照片 → 发现专利侵权风险
└─ 语义搜索："用户不满意的设计" → 跨模态洞察聚合

幕六：协作赋能 (Collaboration)
├─ 张三将洞察打包成"AI优化任务包"
├─ 一键推送给李四，附带数据集和标注建议
└─ 李四在平台内直接启动模型微调

幕七：价值闭环 (Value Loop)
├─ 对比展示：优化前后的模型性能（准确率提升）
├─ 业务指标改善：预测用户满意度提升
└─ Director仪表板显示平台使用带来的效率提升
```

---

## **3. 技术架构设计 (Technical Architecture)**

### **3.1 技术栈全景图**

#### **核心框架层**
| 技术 | 版本 | 用途 | 选型理由 |
|:-----|:-----|:-----|:---------|
| **Vue 3** | ^3.4.0 | 核心框架 | Composition API提供更好的逻辑复用，性能优异 |
| **TypeScript** | ^5.3.0 | 类型系统 | 提升代码质量，减少运行时错误，增强IDE支持 |
| **Vite** | ^5.0.0 | 构建工具 | HMR速度极快，构建产物体积优化 |

#### **状态与路由层**
| 技术 | 用途 | 优势 |
|:-----|:-----|:-----|
| **Pinia** | 全局状态管理 | 原生TS支持，devtools集成，模块化设计 |
| **Vue Router** | 路由管理 | 支持动态加载，路由守卫，过渡动画 |
| **VueUse** | 组合式工具库 | 提供60+ composables，加速开发 |

#### **UI与样式层**
| 技术 | 用途 | 优势 |
|:-----|:-----|:-----|
| **Tailwind CSS** | 原子化CSS | 快速构建，内置设计系统，PurgeCSS优化 |
| **Headless UI** | 无样式组件库 | 无障碍友好，完全可定制 |
| **Heroicons** | 图标库 | 与Tailwind无缝集成，600+ SVG图标 |

#### **可视化与动画层**
| 技术 | 用途 | 应用场景 |
|:-----|:-----|:---------|
| **GSAP** | 高级动画引擎 | 交错动画、时间轴控制、SVG动画 |
| **Three.js** | 3D渲染 | 向量空间可视化、知识图谱展示 |
| **D3.js** | 数据可视化 | 力导向图、数据流动画 |
| **ECharts** | 商业图表 | 仪表板、性能对比图表 |

#### **开发工具链**
| 技术 | 用途 | 价值 |
|:-----|:-----|:-----|
| **Vitest** | 单元测试 | 与Vite深度集成，速度快 |
| **Playwright** | E2E测试 | 跨浏览器支持，录制回放功能 |
| **Storybook** | 组件开发 | 隔离开发，自动生成文档 |
| **ESLint + Prettier** | 代码规范 | 统一代码风格，减少code review负担 |
| **Husky + lint-staged** | Git钩子 | 提交前自动检查，保证代码质量 |

#### **性能与监控层**
| 技术 | 用途 | 监控指标 |
|:-----|:-----|:---------|
| **Lighthouse CI** | 性能预算 | LCP < 2.5s, FID < 100ms, CLS < 0.1 |
| **Sentry (可选)** | 错误追踪 | 运行时错误监控与上报 |
| **Web Vitals** | 用户体验指标 | 真实用户性能数据收集 |

### **3.2 项目目录结构**

```
synapse/
├── .github/                    # GitHub Actions CI/CD配置
│   └── workflows/
│       ├── ci.yml             # 自动化测试与构建
│       └── lighthouse.yml     # 性能监控
│
├── public/                     # 静态资源
│   ├── demo-assets/           # 演示用的图片、视频
│   │   ├── videos/
│   │   ├── images/
│   │   └── documents/
│   └── favicon.svg
│
├── src/
│   ├── assets/                # 设计资源
│   │   ├── styles/
│   │   │   ├── main.css       # Tailwind入口
│   │   │   └── animations.css # 自定义动画
│   │   └── fonts/
│   │
│   ├── components/            # 组件库（原子设计模式）
│   │   ├── atoms/             # 原子组件
│   │   │   ├── Button.vue
│   │   │   ├── Badge.vue
│   │   │   ├── Avatar.vue
│   │   │   └── Icon.vue
│   │   ├── molecules/         # 分子组件
│   │   │   ├── SearchBar.vue
│   │   │   ├── FileUploader.vue
│   │   │   ├── TagCloud.vue
│   │   │   └── ProgressBar.vue
│   │   ├── organisms/         # 组织组件
│   │   │   ├── TheHeader.vue
│   │   │   ├── ResultsGrid.vue
│   │   │   ├── DatasetBuilder.vue
│   │   │   └── VeDirectorrSpace3D.vue
│   │   └── templates/         # 模板组件
│   │       ├── DashboardLayout.vue
│   │       └── ModalLayout.vue
│   │
│   ├── views/                 # 页面组件
│   │   ├── LandingView.vue           # 新增：着陆页
│   │   ├── IngestionView.vue         # 数据入湖页
│   │   ├── ProcessingView.vue        # 新增：处理可视化页
│   │   ├── ExplorationView.vue       # 统一探索页（原SearchView）
│   │   ├── CollaborationView.vue     # 新增：协作页
│   │   ├── ModelOptimizationView.vue # 模型优化页（原ModelFinetuneView）
│   │   └── DashboardView.vue         # Director仪表板
│   │
│   ├── composables/           # 组合式函数（业务逻辑复用）
│   │   ├── useSearch.ts       # 搜索逻辑
│   │   ├── useUpload.ts       # 上传逻辑
│   │   ├── useAnimation.ts    # 动画控制
│   │   ├── useWebSocket.ts    # WebSocket模拟
│   │   └── useNotification.ts # 通知系统
│   │
│   ├── stores/                # Pinia状态管理
│   │   ├── assets.ts          # 数据资产状态
│   │   ├── search.ts          # 搜索状态
│   │   ├── dashboard.ts       # 看板状态
│   │   ├── user.ts            # 用户角色切换
│   │   └── ui.ts              # UI状态（主题、侧边栏等）
│   │
│   ├── api/                   # API层
│   │   ├── mock/              # Mock数据
│   │   │   ├── mockData.ts    # 预设数据集
│   │   │   ├── mockAPI.ts     # API模拟实现
│   │   │   └── mockWebSocket.ts # WebSocket模拟
│   │   └── types.ts           # API类型定义
│   │
│   ├── utils/                 # 工具函数
│   │   ├── format.ts          # 格式化函数
│   │   ├── validate.ts        # 验证函数
│   │   ├── performance.ts     # 性能监控工具
│   │   └── constants.ts       # 常量定义
│   │
│   ├── types/                 # TypeScript类型定义
│   │   ├── models.ts          # 数据模型
│   │   ├── enums.ts           # 枚举类型
│   │   └── index.ts           # 类型导出
│   │
│   ├── router/                # 路由配置
│   │   └── index.ts
│   │
│   ├── App.vue                # 根组件
│   └── main.ts                # 应用入口
│
├── tests/                     # 测试文件
│   ├── unit/                  # 单元测试
│   │   └── components/
│   ├── e2e/                   # E2E测试
│   │   └── user-journey.spec.ts
│   └── setup.ts               # 测试配置
│
├── .storybook/                # Storybook配置
│   ├── main.ts
│   └── preview.ts
│
├── docs/                      # 项目文档
│   ├── ARCHITECTURE.md        # 架构说明
│   ├── API.md                 # API文档
│   └── DEPLOYMENT.md          # 部署指南
│
├── .eslintrc.cjs              # ESLint配置
├── .prettierrc.json           # Prettier配置
├── tailwind.config.js         # Tailwind配置
├── tsconfig.json              # TypeScript配置
├── vite.config.ts             # Vite配置
├── vitest.config.ts           # Vitest配置
├── playwright.config.ts       # Playwright配置
├── package.json
└── README.md
```

### **3.3 核心架构模式**

#### **3.3.1 领域驱动设计 (Domain-Driven Design)**

将业务逻辑按照领域划分：

```typescript
// src/types/models.ts
export namespace Domain {
  // 数据资产领域
  export interface Asset {
    id: string
    type: AssetType
    metadata: AssetMetadata
    processingStatus: ProcessingStatus
    features: FeatureVeDirectorr
  }

  // 搜索领域
  export interface SearchQuery {
    type: 'text' | 'image' | 'semantic'
    content: string | File
    filters?: SearchFilters
  }

  // 协作领域
  export interface Task {
    id: string
    creator: User
    assignee: User
    dataset: DatasetReference
    status: TaskStatus
  }
}
```

#### **3.3.2 Composables模式（逻辑复用）**

```typescript
// src/composables/useSearch.ts
import { ref, computed } from 'vue'
import { useSearchStore } from '@/stores/search'
import { mockAPI } from '@/api/mock/mockAPI'

export function useSearch() {
  const store = useSearchStore()
  const isSearching = ref(false)
  const error = ref<Error | null>(null)

  const search = async (query: SearchQuery) => {
    isSearching.value = true
    error.value = null
    
    try {
      const results = await mockAPI.search(query)
      store.setResults(results)
      
      // 性能追踪
      trackPerformance('search', query.type)
    } catch (e) {
      error.value = e as Error
    } finally {
      isSearching.value = false
    }
  }

  return {
    search,
    isSearching,
    error,
    results: computed(() => store.results)
  }
}
```

#### **3.3.3 分层架构**

```
┌─────────────────────────────────────┐
│     Presentation Layer (Views)      │  ← 页面组件
├─────────────────────────────────────┤
│  Application Layer (Composables)    │  ← 业务逻辑
├─────────────────────────────────────┤
│    Domain Layer (Stores + Types)    │  ← 领域模型
├─────────────────────────────────────┤
│  Infrastructure Layer (API + Utils) │  ← 技术实现
└─────────────────────────────────────┘
```

---

## **4. 功能模块详细设计 (Feature Modules)**

### **4.1 页面架构（新增3个页面）**

#### **页面1: LandingView.vue - 着陆页**
**目标**: 3秒内抓住观众注意力，建立情感连接

**内容**:
- Hero动画：数据流从混乱到有序的视觉隐喻
- 价值主张：3个核心数字（50%效率提升，3x洞察速度，90%满意度）
- 角色选择入口：点击张三/李四头像进入对应视角
- 自动播放模式按钮：无需操作，自动演示完整流程（5分钟）

#### **页面2: ProcessingView.vue - 处理可视化页**
**目标**: 展示AI"理解"数据的过程

**核心展示**:
- 实时处理队列：显示多个文件的处理状态
- 3D向量空间：文档在高维空间中的位置变化
- 特征提取过程：分步展示（文本提取 → 语义理解 → 向量化）
- 知识图谱生成：实体识别与关系构建的动画

#### **页面3: CollaborationView.vue - 协作页**
**目标**: 展示跨角色协作的无缝体验

**功能**:
- 分屏视图：左侧张三的洞察看板，右侧李四的任务队列
- 数据集打包流程：选择资产 → 添加标注建议 → 生成任务卡
- 实时通知：模拟WebSocket推送（"李四已接受任务"）
- 评论与反馈：模拟异步协作对话

#### **原有页面优化**

**IngestionView.vue** - 增强功能:
- 批量上传支持（拖拽整个文件夹）
- 文件类型自动识别图标
- 上传进度的帧动画（非简单进度条）

**ExplorationView.vue** - 增强功能:
- 三种搜索模式标签页（文本/图像/语义）
- 搜索历史记录（快速回溯）
- 高级过滤器：时间范围、数据源、相关度阈值
- "解释这个结果"按钮：展示匹配原因（可解释AI）

**ModelOptimizationView.vue** - 增强功能:
- A/B对比视图：优化前后的模型表现
- 混淆矩阵可视化
- 真实测试案例播放（语音唤醒成功率对比）

**DashboardView.vue** - Director视角:
- 实时指标：今日处理文件数、活跃用户、存储使用率
- 协作效率图表：从数据到洞察的平均时长
- ROI计算器：展示使用平台带来的成本节省

### **4.2 核心组件库（原子设计）**

#### **Atoms (原子组件)**

```vue
<!-- Button.vue -->
<template>
  <button
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      { 'btn-loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <Icon v-if="icon" :name="icon" class="btn-icon" />
    <span v-if="!loading">{{ label }}</span>
    <LoadingSpinner v-else size="sm" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: string
  label?: string
  loading?: boolean
  disabled?: boolean
}

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()
</script>
```

#### **Molecules (分子组件)**

**SearchBar.vue** - 增强版
```vue
<template>
  <div class="search-bar">
    <!-- 搜索模式切换 -->
    <TabGroup v-model="searchMode">
      <Tab value="text">Text</Tab>
      <Tab value="image">Image</Tab>
      <Tab value="semantic">Semantic</Tab>
    </TabGroup>

    <!-- 主输入区 -->
    <div class="search-input-wrapper">
      <input
        v-if="searchMode === 'text'"
        v-model="query"
        placeholder="搜索任何内容..."
        @keyup.enter="handleSearch"
      />
      
      <FileDropzone
        v-else-if="searchMode === 'image'"
        accept="image/*"
        @file-drop="handleImageSearch"
      />
      
      <NaturalLanguageInput
        v-else
        v-model="semanticQuery"
        placeholder="用自然语言描述你要找的内容..."
      />
    </div>

    <!-- 搜索历史快捷按钮 -->
    <SearchHistory @select="applyHistoryQuery" />
  </div>
</template>
```

**VeDirectorrSpace3D.vue** - 新增组件
```vue
<template>
  <div ref="containerRef" class="veDirectorr-space-3d">
    <canvas ref="canvasRef"></canvas>
    
    <!-- 控制面板 -->
    <div class="controls">
      <button @click="rotateView">Rotate</button>
      <button @click="zoomToAsset">Focus</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Three.js场景初始化
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ antialias: true })

// 向量点渲染逻辑
function renderVeDirectorrPoints(veDirectorrs: FeatureVeDirectorr[]) {
  // 使用PCA降维到3D
  const reduced = performPCA(veDirectorrs, 3)
  
  // 创建粒子系统
  reduced.forEach((point, idx) => {
    const geometry = new THREE.SphereGeometry(0.05)
    const material = new THREE.MeshPhongMaterial({ 
      color: getColorByCluster(point.clusterId) 
    })
    const sphere = new THREE.Mesh(geometry, material)
    sphere.position.set(point.x, point.y, point.z)
    scene.add(sphere)
  })
}
</script>
```

#### **Organisms (组织组件)**

**ResultsGrid.vue** - 带虚拟滚动
```vue
<template>
  <div class="results-grid">
    <!-- 过滤与排序控制 -->
    <div class="results-toolbar">
      <FilterPanel v-model:filters="activeFilters" />
      <SortDropdown v-model="sortBy" />
    </div>

    <!-- 虚拟滚动结果列表 -->
    <VirtualScroller
      :items="filteredResults"
      :item-height="280"
      class="results-list"
    >
      <template #default="{ item }">
        <KnowledgeCard
          :result="item"
          @click="openDetail(item)"
          @add-to-dashboard="addToDashboard(item)"
        />
      </template>
    </VirtualScroller>

    <!-- 空状态 -->
    <EmptyState v-if="results.length === 0">
      <template #title>No results found</template>
      <template #description>
        Try adjusting your search terms or filters
      </template>
    </EmptyState>
  </div>
</template>
```

---

## **5. 数据模拟架构 (Mock Data Architecture)**

### **5.1 分层Mock设计**

```typescript
// src/api/mock/mockData.ts
export const MOCK_DATABASE = {
  assets: [
    {
      id: 'vid_001',
      type: 'video',
      title: '知名KOL深度体验天狼星座舱',
      source: 'Bilibili',
      uploadedAt: '2025-09-15T10:30:00Z',
      metadata: {
        duration: 1245, // 秒
        resolution: '1080p',
        transcription: '完整的视频转录文本...',
        keyMoments: [
          { timestamp: 932, label: '语音唤醒问题演示', sentiment: 'negative' },
          { timestamp: 1102, label: '旋钮操作体验', sentiment: 'positive' }
        ]
      },
      features: {
        embedding: [0.123, -0.456, 0.789, /* ...512维向量 */],
        tags: ['智能座舱', '语音交互', '用户体验', '竞品分析'],
        entities: [
          { type: 'product', name: '天狼星座舱', mentions: 23 },
          { type: 'feature', name: '语音唤醒', mentions: 15 }
        ]
      },
      processingStatus: {
        stage: 'completed',
        progress: 100,
        startedAt: '2025-09-15T10:31:00Z',
        completedAt: '2025-09-15T10:35:00Z'
      }
    },
    // ... 更多资产
  ],

  searchIndex: {
    // 预计算的搜索结果，用于演示
    '语音唤醒': ['vid_001', 'pdf_002', 'img_003'],
    'voice_wake_up': ['vid_001', 'pdf_002'], // 多语言支持
    // 图像搜索通过文件名匹配
    'knob_photo.jpg': ['patent_004', 'vid_005']
  },

  users: [
    {
      id: 'user_张三',
      name: '张三',
      role: 'Market Analyst',
      avatar: '/avatars/张三.jpg'
    },
    {
      id: 'user_李四',
      name: '李四',
      role: 'AI Engineer',
      avatar: '/avatars/李四.jpg'
    }
  ],

  tasks: [
    {
      id: 'task_001',
      title: '优化语音唤醒模型 - 噪音环境适应性',
      creator: 'user_张三',
      assignee: 'user_李四',
      dataset: {
        assetIds: ['vid_001', 'pdf_002'],
        annotations: [
          { assetId: 'vid_001', timeRange: [932, 945], label: 'failure_case' }
        ]
      },
      status: 'in_progress',
      createdAt: '2025-10-01T14:20:00Z'
    }
  ]
}
```

### **5.2 智能Mock API**

```typescript
// src/api/mock/mockAPI.ts
import { MOCK_DATABASE } from './mockData'

export class MockAPIService {
  // 模拟网络延迟
  private async delay(ms: number = 800) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // 文件上传模拟
  async uploadFiles(files: File[]): Promise<Asset[]> {
    await this.delay(1500)
    
    return files.map(file => ({
      id: `asset_${Date.now()}_${Math.random()}`,
      type: this.inferAssetType(file),
      title: file.name,
      uploadedAt: new Date().toISOString(),
      processingStatus: {
        stage: 'processing',
        progress: 0
      }
    }))
  }

  // 智能搜索（支持模糊匹配和语义理解）
  async search(query: SearchQuery): Promise<SearchResult[]> {
    await this.delay(600)
    
    let matchedAssetIds: string[] = []

    if (query.type === 'text') {
      // 关键词匹配 + 语义扩展
      matchedAssetIds = this.textSearch(query.content as string)
    } else if (query.type === 'image') {
      // 模拟视觉搜索
      matchedAssetIds = this.imageSearch(query.content as File)
    } else if (query.type === 'semantic') {
      // 模拟向量相似度搜索
      matchedAssetIds = this.semanticSearch(query.content as string)
    }

    // 从数据库获取完整资产信息
    const results = matchedAssetIds
      .map(id => MOCK_DATABASE.assets.find(a => a.id === id))
      .filter(Boolean)
      .map(asset => this.toSearchResult(asset!, query))

    return results
  }

  private textSearch(queryText: string): string[] {
    // 简单的关键词匹配
    const keywords = queryText.toLowerCase().split(' ')
    
    return MOCK_DATABASE.assets
      .filter(asset => {
        const searchableText = `
          ${asset.title} 
          ${asset.metadata.transcription || ''} 
          ${asset.features.tags.join(' ')}
        `.toLowerCase()
        
        return keywords.some(kw => searchableText.includes(kw))
      })
      .map(a => a.id)
      .slice(0, 10) // 限制结果数量
  }

  private imageSearch(imageFile: File): string[] {
    // 根据文件名匹配预设结果（实际应调用视觉API）
    const fileName = imageFile.name.toLowerCase()
    
    if (fileName.includes('knob') || fileName.includes('旋钮')) {
      return ['patent_004', 'vid_005', 'img_006']
    }
    
    return ['img_007', 'img_008'] // 默认返回
  }

  private semanticSearch(naturalLanguageQuery: string): string[] {
    // 模拟语义理解（实际应调用Embedding API）
    const intentMap: Record<string, string[]> = {
      '用户不满意': ['vid_001', 'pdf_002'],
      '设计缺陷': ['patent_003', 'img_009'],
      '竞品优势': ['pdf_010', 'vid_011']
    }

    for (const [intent, assetIds] of Object.entries(intentMap)) {
      if (naturalLanguageQuery.includes(intent)) {
        return assetIds
      }
    }

    return [] // 无匹配
  }

  private toSearchResult(asset: Asset, query: SearchQuery): SearchResult {
    return {
      ...asset,
      relevanceScore: 0.85 + Math.random() * 0.15, // 模拟相关度分数
      matchReason: this.generateMatchReason(asset, query),
      highlightedSnippet: this.extractSnippet(asset, query)
    }
  }

  // 生成"为什么匹配"的解释（可解释AI）
  private generateMatchReason(asset: Asset, query: SearchQuery): string {
    return `This ${asset.type} matches your query because it contains relevant keywords and semantic similarity score is 0.89`
  }

  // 提取相关片段
  private extractSnippet(asset: Asset, query: SearchQuery): string {
    if (asset.type === 'video' && asset.metadata.keyMoments) {
      const relevantMoment = asset.metadata.keyMoments[0]
      return `At ${this.formatTimestamp(relevantMoment.timestamp)}: "${relevantMoment.label}"`
    }
    
    return asset.metadata.transcription?.substring(0, 150) + '...' || ''
  }
}

export const mockAPI = new MockAPIService()
```

### **5.3 WebSocket模拟（实时更新）**

```typescript
// src/api/mock/mockWebSocket.ts
export class MockWebSocketService {
  private listeners: Map<string, Function[]> = new Map()
  private connected = false

  connect() {
    this.connected = true
    console.log('[MockWS] Connected to simulation server')
    
    // 模拟定期推送事件
    this.simulateEvents()
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event)!.push(callback)
  }

  emit(event: string, data: any) {
    const callbacks = this.listeners.get(event) || []
    callbacks.forEach(cb => cb(data))
  }

  private simulateEvents() {
    // 模拟文件处理进度更新
    setTimeout(() => {
      this.emit('asset:processing', {
        assetId: 'vid_001',
        progress: 30,
        stage: 'extracting_features'
      })
    }, 2000)

    setTimeout(() => {
      this.emit('asset:processing', {
        assetId: 'vid_001',
        progress: 70,
        stage: 'generating_embeddings'
      })
    }, 4000)

    setTimeout(() => {
      this.emit('asset:completed', {
        assetId: 'vid_001',
        features: { /* ... */ }
      })
    }, 6000)

    // 模拟协作通知
    setTimeout(() => {
      this.emit('task:accepted', {
        taskId: 'task_001',
        acceptedBy: 'user_李四',
        message: '李四 has started working on this task'
      })
    }, 8000)
  }
}

export const mockWS = new MockWebSocketService()
```

---

## **6. UI/UX设计系统 (Design System)**

### **6.1 视觉设计语言**

#### **色彩系统**

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Primary - 科技蓝
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1', // 主色
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        
        // Secondary - 青色（数据感）
        secondary: {
          500: '#06B6D4',
          600: '#0891B2',
        },
        
        // Accent - 品红（强调色）
        accent: {
          500: '#EC4899',
          600: '#DB2777',
        },
        
        // Neutral - 中性灰（深色模式）
        neutral: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          800: '#1F2937',
          900: '#111827',
          950: '#0A0F1A', // 背景色
        },
        
        // Semantic colors
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      
      fontFamily: {
        sans: ['Inter var', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.5)',
      },
      
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'stagger': 'stagger 0.8s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      }
    }
  }
}
```

#### **排版系统**

```css
/* src/assets/styles/typography.css */
.heading-xl {
  @apply text-5xl font-bold tracking-tight;
  line-height: 1.1;
}

.heading-lg {
  @apply text-4xl font-semibold tracking-tight;
  line-height: 1.2;
}

.heading-md {
  @apply text-2xl font-semibold;
  line-height: 1.3;
}

.body-lg {
  @apply text-lg leading-relaxed;
}

.body {
  @apply text-base leading-normal;
}

.caption {
  @apply text-sm text-neutral-400;
}

.code {
  @apply font-mono text-sm bg-neutral-800 px-2 py-1 rounded;
}
```

### **6.2 动画设计规范**

#### **动画时长标准**
- **Micro (微动画)**: 100-200ms - 按钮hover、图标变化
- **Small (小动画)**: 200-400ms - 卡片展开、弹窗出现
- **Medium (中动画)**: 400-800ms - 页面过渡、列表展示
- **Large (大动画)**: 800-1500ms - 复杂的叙事动画、3D场景

#### **缓动函数**
```css
:root {
  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in-out-circ: cubic-bezier(0.85, 0, 0.15, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

#### **交错动画示例**

```vue
<!-- ResultsGrid.vue -->
<template>
  <transition-group
    name="stagger"
    tag="div"
    class="results-grid"
    @before-enter="beforeEnter"
    @enter="enter"
  >
    <KnowledgeCard
      v-for="(result, index) in results"
      :key="result.id"
      :data-index="index"
      :result="result"
    />
  </transition-group>
</template>

<script setup lang="ts">
import gsap from 'gsap'

function beforeEnter(el: Element) {
  gsap.set(el, {
    opacity: 0,
    y: 30,
  })
}

function enter(el: Element, done: () => void) {
  const delay = (el as HTMLElement).dataset.index 
    ? parseInt((el as HTMLElement).dataset.index!) * 0.1 
    : 0
    
  gsap.to(el, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    delay,
    ease: 'power3.out',
    onComplete: done
  })
}
</script>
```

### **6.3 无障碍设计 (Accessibility)**

#### **WCAG 2.1 AA级合规清单**
- ✅ **色彩对比度**: 所有文本与背景对比度 ≥ 4.5:1
- ✅ **键盘导航**: 所有交互元素可通过Tab键访问
- ✅ **焦点指示器**: 清晰的焦点高亮样式
- ✅ **ARIA标签**: 为屏幕阅读器提供语义化标签
- ✅ **替代文本**: 所有图像包含描述性alt文本

#### **实施示例**

```vue
<!-- SearchBar.vue - 无障碍增强 -->
<template>
  <div class="search-bar" role="search">
    <label for="search-input" class="sr-only">
      Search for insights across all data sources
    </label>
    
    <input
      id="search-input"
      v-model="query"
      type="text"
      role="searchbox"
      aria-label="Search query"
      aria-describedby="search-instructions"
      @keyup.enter="handleSearch"
    />
    
    <span id="search-instructions" class="sr-only">
      Press enter to search, or use arrow keys to navigate suggestions
    </span>
    
    <button
      type="submit"
      aria-label="Submit search"
      @click="handleSearch"
    >
      <Icon name="search" aria-hidden="true" />
      <span class="sr-only">Search</span>
    </button>
  </div>
</template>

<style scoped>
/* Screen reader only class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
</style>
```

---

## **7. 性能优化策略 (Performance Optimization)**

### **7.1 性能预算**

| 指标 | 目标值 | 测量工具 |
|:-----|:------|:--------|
| **首次内容绘制 (FCP)** | < 1.5s | Lighthouse |
| **最大内容绘制 (LCP)** | < 2.5s | Web Vitals |
| **首次输入延迟 (FID)** | < 100ms | Web Vitals |
| **累积布局偏移 (CLS)** | < 0.1 | Web Vitals |
| **交互到绘制 (INP)** | < 200ms | Web Vitals |
| **JS Bundle大小** | < 250KB (gzipped) | Bundlephobia |
| **首屏图片总大小** | < 500KB | Network Panel |

### **7.2 代码分割策略**

```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/views/LandingView.vue') // 懒加载
    },
    {
      path: '/exploration',
      name: 'Exploration',
      component: () => import('@/views/ExplorationView.vue'),
      // 预加载关键组件
      meta: { preload: ['SearchBar', 'ResultsGrid'] }
    },
    {
      path: '/processing',
      name: 'Processing',
      component: () => import('@/views/ProcessingView.vue'),
      // 这个页面包含Three.js，延迟加载
      meta: { heavy: true }
    }
  ]
})

// 路由守卫：预加载下一页资源
router.beforeEach((to, from, next) => {
  if (to.meta.preload) {
    const components = to.meta.preload as string[]
    components.forEach(comp => {
      import(`@/components/${comp}.vue`)
    })
  }
  next()
})
```

### **7.3 图像优化**

```html
<!-- 使用现代图像格式 + 响应式加载 -->
<picture>
  <source
    srcset="/images/hero.avif"
    type="image/avif"
  />
  <source
    srcset="/images/hero.webp"
    type="image/webp"
  />
  <img
    src="/images/hero.jpg"
    alt="Synapse Platform Hero"
    loading="lazy"
    decoding="async"
    width="1920"
    height="1080"
  />
</picture>
```

### **7.4 虚拟滚动**

```vue
<!-- 处理大量搜索结果 -->
<template>
  <RecycleScroller
    :items="searchResults"
    :item-size="280"
    key-field="id"
    v-slot="{ item }"
  >
    <KnowledgeCard :result="item" />
  </RecycleScroller>
</template>

<script setup lang="ts">
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
</script>
```

### **7.5 性能监控**

```typescript
// src/utils/performance.ts
import { onLCP, onFID, onCLS, onINP } from 'web-vitals'

export function initPerformanceMonitoring() {
  onLCP(metric => {
    console.log('LCP:', metric.value)
    // 发送到分析平台
    trackMetric('LCP', metric.value)
  })

  onFID(metric => {
    console.log('FID:', metric.value)
    trackMetric('FID', metric.value)
  })

  onCLS(metric => {
    console.log('CLS:', metric.value)
    trackMetric('CLS', metric.value)
  })

  onINP(metric => {
    console.log('INP:', metric.value)
    trackMetric('INP', metric.value)
  })
}

// 自定义性能标记
export function measureInteraction(name: string, fn: () => void) {
  const start = performance.now()
  fn()
  const duration = performance.now() - start
  
  console.log(`[Perf] ${name}: ${duration.toFixed(2)}ms`)
  
  if (duration > 200) {
    console.warn(`⚠️ Slow interaction detected: ${name}`)
  }
}
```

---

## **8. 测试策略 (Testing Strategy)**

### **8.1 测试金字塔**

```
        /\
       /E2E\           10% - 端到端测试（关键用户流程）
      /------\
     /Integration\     20% - 集成测试（组件交互）
    /------------\
   /Unit Tests    \    70% - 单元测试（纯函数、composables）
  /----------------\
```

### **8.2 单元测试示例**

```typescript
// tests/unit/composables/useSearch.spec.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useSearch } from '@/composables/useSearch'
import { setActivePinia, createPinia } from 'pinia'
import { mockAPI } from '@/api/mock/mockAPI'

describe('useSearch', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('should perform text search successfully', async () => {
    const { search, results, isSearching } = useSearch()
    
    const mockResults = [
      { id: 'vid_001', type: 'video', title: 'Test Video' }
    ]
    
    vi.spyOn(mockAPI, 'search').mockResolvedValue(mockResults)
    
    expect(isSearching.value).toBe(false)
    
    await search({ type: 'text', content: '语音唤醒' })
    
    expect(mockAPI.search).toHaveBeenCalledWith({
      type: 'text',
      content: '语音唤醒'
    })
    expect(results.value).toEqual(mockResults)
    expect(isSearching.value).toBe(false)
  })

  it('should handle search errors gracefully', async () => {
    const { search, error } = useSearch()
    
    const mockError = new Error('Network error')
    vi.spyOn(mockAPI, 'search').mockRejectedValue(mockError)
    
    await search({ type: 'text', content: 'test' })
    
    expect(error.value).toBe(mockError)
  })
})
```

### **8.3 E2E测试示例**

```typescript
// tests/e2e/user-journey.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Complete User Journey - 张三 Persona', () => {
  test('should successfully search and create AI task', async ({ page }) => {
    // 1. 访问着陆页
    await page.goto('/')
    await expect(page.getByRole('heading', { name: /Synapse/i })).toBeVisible()
    
    // 2. 选择张三角色
    await page.getByRole('button', { name: /张三/i }).click()
    await expect(page).toHaveURL('/exploration')
    
    // 3. 执行文本搜索
    const searchInput = page.getByRole('searchbox')
    await searchInput.fill('语音唤醒问题')
    await searchInput.press('Enter')
    
    // 4. 等待搜索结果加载
    await expect(page.getByText(/知名KOL深度体验/i)).toBeVisible({ timeout: 3000 })
    
    // 5. 打开视频详情
    await page.getByRole('button', { name: /知名KOL深度体验/i }).click()
    
    // 6. 验证视频播放器加载
    const videoPlayer = page.locator('video')
    await expect(videoPlayer).toBeVisible()
    
    // 7. 添加到看板
    await page.getByRole('button', { name: /添加到看板/i }).click()
    await expect(page.getByText(/已添加到看板/i)).toBeVisible()
    
    // 8. 导航到看板页面
    await page.getByRole('link', { name: /Dashboard/i }).click()
    await expect(page).toHaveURL('/dashboard')
    
    // 9. 创建AI任务
    await page.getByRole('button', { name: /创建AI任务/i }).click()
    
    // 10. 填写任务表单
    const taskForm = page.getByRole('dialog')
    await taskForm.getByLabel(/任务标题/i).fill('优化语音唤醒模型')
    await taskForm.getByLabel(/分配给/i).seleDirectorption('user_李四')
    await taskForm.getByRole('button', { name: /提交/i }).click()
    
    // 11. 验证成功通知
    await expect(page.getByText(/任务已创建/i)).toBeVisible()
  })

  test('should meet performance budget', async ({ page }) => {
    await page.goto('/')
    
    // 测量LCP
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.renderTime || lastEntry.loadTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })
    
    expect(lcp).toBeLessThan(2500) // LCP < 2.5s
  })
})
```

### **8.4 视觉回归测试**

```typescript
// tests/visual/components.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Visual Regression Tests', () => {
  test('SearchBar component', async ({ page }) => {
    await page.goto('/storybook/iframe.html?id=molecules-searchbar--default')
    
    // 等待组件渲染完成
    await page.waitForLoadState('networkidle')
    
    // 截图对比
    await expect(page).toHaveScreenshot('searchbar-default.png')
  })

  test('KnowledgeCard hover state', async ({ page }) => {
    await page.goto('/storybook/iframe.html?id=organisms-knowledgecard--video')
    
    const card = page.locator('.knowledge-card')
    await card.hover()
    
    await expect(page).toHaveScreenshot('knowledgecard-hover.png')
  })
})
```

---

## **9. 实施路线图 (Implementation Roadmap)**

### **阶段划分与时间估算**

#### **Phase 0: 项目初始化与基础设施 (Week 1 - 5天)**

**目标**: 搭建完整的开发环境和工具链

**任务清单**:
- [ ] 使用 Vite 创建 Vue 3 + TypeScript 项目
- [ ] 配置 Tailwind CSS、PostCSS、Autoprefixer
- [ ] 集成 Pinia 状态管理
- [ ] 配置 Vue Router（含懒加载）
- [ ] 设置 ESLint + Prettier + Husky
- [ ] 配置 Vitest 单元测试环境
- [ ] 配置 Playwright E2E测试环境
- [ ] 集成 Storybook（含 Tailwind 支持）
- [ ] 建立目录结构（按原子设计模式）
- [ ] 创建 README 和开发文档
- [ ] 配置 GitHub Actions CI/CD 流水线

**交付物**:
```bash
npm install
npm run dev        # 开发服务器启动
npm run test:unit  # 单元测试通过
npm run storybook  # Storybook启动
```

---

#### **Phase 1: 设计系统与原子组件 (Week 2 - 5天)**

**目标**: 建立可复用的UI组件库

**任务清单**:
- [ ] 定义 Tailwind 主题配置（色彩、字体、阴影）
- [ ] 创建全局样式文件（排版、动画、工具类）
- [ ] 开发 Atom 组件（10个）:
  - Button, Input, Badge, Avatar, Icon
  - LoadingSpinner, Checkbox, Radio, Switch, Tooltip
- [ ] 为每个组件编写 Storybook 故事
- [ ] 编写组件单元测试（覆盖率 > 80%）
- [ ] 创建 TypeScript 类型定义文件

**交付物**:
- 完整的 Storybook 组件文档
- 组件单元测试报告
- 可视化组件库截图

---

#### **Phase 2: 分子与组织组件 (Week 3 - 7天)**

**目标**: 组合原子组件，构建业务级组件

**任务清单**:
- [ ] **Molecules**:
  - SearchBar（三种模式切换）
  - FileUploader（拖拽支持）
  - TagCloud（动态标签）
  - ProgressBar（多阶段支持）
  - VideoTimeline（带标记点）
- [ ] **Organisms**:
  - TheHeader（全局导航）
  - ResultsGrid（虚拟滚动）
  - DatasetBuilder（多步表单）
  - VeDirectorrSpace3D（Three.js集成）
  - KnowledgeCard（多类型支持）
- [ ] 集成 GSAP 动画库
- [ ] 集成 Three.js 和 D3.js
- [ ] 为复杂组件编写交互测试

**交付物**:
- 所有组件在 Storybook 中可交互演示
- 组件 API 文档
- 性能测试报告（渲染时间 < 16ms）

---

#### **Phase 3: Mock API 与数据层 (Week 4 - 4天)**

**目标**: 构建完整的数据模拟系统

**任务清单**:
- [ ] 定义所有 TypeScript 数据模型（`types/models.ts`）
- [ ] 创建 Mock 数据库（`mockData.ts`）:
  - 20+ 资产对象（视频、PDF、图片、专利）
  - 10+ 搜索场景预设
  - 5+ 用户与任务数据
- [ ] 实现 MockAPIService 类:
  - uploadFiles()
  - search()（支持三种搜索模式）
  - getAssetDetails()
  - createTask()
  - updateProcessingStatus()
- [ ] 实现 MockWebSocketService:
  - 实时处理进度推送
  - 协作通知推送
- [ ] 编写 API 单元测试
- [ ] 创建 API 调用性能监控

**交付物**:
- API 文档（`docs/API.md`）
- Mock 数据架构图
- API 响应时间基准测试报告

---

#### **Phase 4: Pinia Stores 与状态管理 (Week 4 - 3天)**

**目标**: 建立全局状态管理架构

**任务清单**:
- [ ] 创建 5 个 Pinia Store:
  - `useAssetsStore`: 资产列表、上传状态
  - `useSearchStore`: 搜索历史、结果、过滤器
  - `useDashboardStore`: 看板内容、AI任务
  - `useUserStore`: 当前角色、权限
  - `useUIStore`: 主题、侧边栏、模态框状态
- [ ] 实现 Store Actions（调用 Mock API）
- [ ] 实现 Store Getters（计算属性）
- [ ] 集成 Pinia Devtools
- [ ] 编写 Store 单元测试

**交付物**:
- 状态管理架构文档
- Store API 参考
- 状态流转图

---

#### **Phase 5: 页面开发 - 第一批 (Week 5 - 7天)**

**目标**: 开发前3个核心页面

**LandingView.vue**:
- [ ] Hero 动画（数据流动效果）
- [ ] 角色选择卡片
- [ ] 自动演示模式按钮
- [ ] 页面过渡动画

**IngestionView.vue**:
- [ ] 文件拖拽上传区域
- [ ] 批量上传支持
- [ ] 上传进度动画
- [ ] 资产卡片列表
- [ ] 处理状态实时更新（WebSocket）

**ProcessingView.vue**:
- [ ] 处理队列可视化
- [ ] 3D 向量空间展示（Three.js）
- [ ] 特征提取步骤动画
- [ ] 知识图谱生成（D3.js）

**交付物**:
- 3个可完整交互的页面
- 页面级 E2E 测试
- 性能指标达标（LCP < 2.5s）

---

#### **Phase 6: 页面开发 - 第二批 (Week 6 - 8天)**

**目标**: 完成剩余4个页面

**ExplorationView.vue**:
- [ ] 三种搜索模式实现
- [ ] 搜索结果展示（交错动画）
- [ ] 高级过滤器面板
- [ ] 结果详情模态框
- [ ] "解释匹配原因"功能
- [ ] 视频播放器（时间轴跳转）

**CollaborationView.vue**:
- [ ] 分屏布局（张三/李四视角）
- [ ] 数据集打包流程
- [ ] 任务卡片创建表单
- [ ] 实时通知系统
- [ ] 评论与反馈模拟

**ModelOptimizationView.vue**:
- [ ] A/B 对比视图
- [ ] 性能指标图表（ECharts）
- [ ] 混淆矩阵可视化
- [ ] 测试案例播放器

**DashboardView.vue**:
- [ ] 实时指标卡片
- [ ] 协作效率图表
- [ ] ROI 计算器
- [ ] 活动日志

**交付物**:
- 所有7个页面完成
- 完整用户旅程 E2E 测试通过
- 跨页面状态同步验证

---

#### **Phase 7: 叙事流程与引导系统 (Week 7 - 5天)**

**目标**: 实现自动演示和用户引导

**任务清单**:
- [ ] 实现"自动播放模式":
  - 定义7幕剧的动作序列
  - 自动页面切换
  - 自动填充表单
  - 自动触发搜索
- [ ] 集成引导库（如 Shepherd.js）:
  - 为每个页面创建引导步骤
  - 高亮交互元素
  - 工具提示说明
- [ ] 添加"跳过"和"重播"功能
- [ ] 实现进度指示器
- [ ] 添加旁白文案（可选配音）

**交付物**:
- 5分钟完整自动演示视频
- 交互式引导体验
- 演示脚本文档

---

#### **Phase 8: 动画润色与微交互 (Week 8 - 5天)**

**目标**: 提升用户体验的细节

**任务清单**:
- [ ] 为所有页面添加过渡动画
- [ ] 实现交错动画（搜索结果、卡片列表）
- [ ] 添加 Hover/Focus 微交互
- [ ] 优化 Loading 状态（骨架屏）
- [ ] 添加成功/错误通知动画
- [ ] 优化模态框进入/退出动画
- [ ] 实现页面滚动视差效果
- [ ] 添加音效（可选，按钮点击、通知提示）

**交付物**:
- 动画效果演示视频
- 动画性能测试报告（60fps验证）

---

#### **Phase 9: 无障碍与国际化 (Week 8 - 3天)**

**目标**: 确保可访问性和多语言支持

**任务清单**:
- [ ] 为所有交互元素添加 ARIA 标签
- [ ] 实现完整的键盘导航
- [ ] 优化焦点管理
- [ ] 色彩对比度验证
- [ ] 集成 Vue I18n
- [ ] 创建中英文语言包
- [ ] 添加语言切换器

**交付物**:
- WCAG 2.1 AA 合规报告
- 多语言支持演示

---

#### **Phase 10: 性能优化与测试 (Week 9 - 5天)**

**目标**: 达到生产级性能标准

**任务清单**:
- [ ] 代码分割优化（分析 bundle 大小）
- [ ] 图像优化（WebP/AVIF 格式转换）
- [ ] 实现虚拟滚动（长列表）
- [ ] 添加 Service Worker（离线支持）
- [ ] 配置 CDN 缓存策略
- [ ] 运行 Lighthouse 审计
- [ ] 修复所有性能瓶颈
- [ ] 压力测试（大量数据加载）

**交付物**:
- Lighthouse 分数报告（目标：所有指标 > 90）
- 性能优化前后对比
- Bundle 分析报告

---

#### **Phase 11: 文档与部署 (Week 9 - 3天)**

**目标**: 完善文档并部署到生产环境

**任务清单**:
- [ ] 完善 README.md:
  - 项目介绍
  - 快速开始指南
  - 技术栈说明
  - 本地开发指南
- [ ] 创建 ARCHITECTURE.md
- [ ] 创建 API.md
- [ ] 创建 DEPLOYMENT.md
- [ ] 录制演示视频
- [ ] 部署到 Vercel/Netlify
- [ ] 配置自定义域名
- [ ] 设置 CI/CD 自动部署

**交付物**:
- 完整的项目文档
- 可公开访问的在线 Demo
- 部署流程文档

---

#### **Phase 12: 最终测试与交付 (Week 10 - 3天)**

**目标**: 全面测试并准备交付

**任务清单**:
- [ ] 执行完整 E2E 测试套件
- [ ] 跨浏览器测试（Chrome, Firefox, Safari, Edge）
- [ ] 移动端响应式测试
- [ ] 用户验收测试（UAT）
- [ ] 修复发现的所有 bug
- [ ] 代码审查与重构
- [ ] 清理调试代码和注释
- [ ] 创建 Git release tag

**交付物**:
- 完整的源代码包
- 测试报告
- 部署 URL
- 用户手册

---

### **总体时间估算**: **10周 (50个工作日)**

### **团队配置建议**:
- **前端工程师 x 2**: 负责组件开发和页面实现
- **UI/UX 设计师 x 1**: 负责视觉设计和动画规范
- **QA 工程师 x 1**: 负责测试策略和质量保证
- **技术负责人 x 1**: 负责架构设计和技术评审

---

## **10. 风险管理与应对策略 (Risk Management)**

### **技术风险**

| 风险 | 影响 | 概率 | 缓解策略 |
|:-----|:-----|:-----|:---------|
| **Three.js 性能瓶颈** | 高 | 中 | 1. 使用 LoD (Level of Detail)<br>2. 限制粒子数量<br>3. 提供"简化模式"开关 |
| **大型 JS Bundle** | 中 | 高 | 1. 严格的代码分割<br>2. Tree shaking<br>3. 依赖项审计 |
| **跨浏览器兼容性** | 中 | 中 | 1. 使用 Browserslist<br>2. 自动化跨浏览器测试<br>3. Polyfills |
| **动画性能下降** | 中 | 中 | 1. 使用 GPU 加速<br>2. 避免 Layout Thrashing<br>3. 使用 `will-change` |

### **项目风险**

| 风险 | 影响 | 概率 | 缓解策略 |
|:-----|:-----|:-----|:---------|
| **需求变更频繁** | 高 | 高 | 1. 组件化架构易于调整<br>2. 每周演示获取反馈<br>3. 保留2天缓冲时间 |
| **时间压力过大** | 高 | 中 | 1. MVP优先策略<br>2. 砍掉非核心功能<br>3. 复用开源组件 |
| **设计资产延迟** | 中 | 中 | 1. 先用 Placeholder<br>2. Storybook 独立开发<br>3. 准备备用方案 |

---

## **11. 成功指标与验收标准 (Success Criteria)**

### **技术指标**
- ✅ Lighthouse 性能分数 > 90
- ✅ 单元测试覆盖率 > 80%
- ✅ E2E 测试关键路径覆盖率 100%
- ✅ 零 TypeScript 编译错误
- ✅ 零 ESLint 错误
- ✅ 核心交互响应时间 < 200ms

### **用户体验指标**
- ✅ 完整演示流程可在5分钟内完成
- ✅ 自动播放模式无需任何交互
- ✅ 所有交互有明确的视觉反馈
- ✅ 支持键盘导航所有功能

### **业务指标**
- ✅ 演示后的观众理解度 > 90%
- ✅ NPS（净推荐值）> 8/10
- ✅ 技术决策者认可度 > 85%

---

## **12. 附录 (Appendix)**

### **12.1 推荐学习资源**

**Vue 3 生态**:
- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [VueUse](https://vueuse.org/)

**动画与可视化**:
- [GSAP 官方教程](https://greensock.com/learning/)
- [Three.js Journey](https://threejs-journey.com/)
- [D3.js Observable](https://observablehq.com/@d3/gallery)

**性能优化**:
- [Web.dev Performance](https://web.dev/performance/)
- [Lighthouse 性能优化指南](https://web.dev/lighthouse-performance/)

### **12.2 关键依赖版本**

```json
{
  "dependencies": {
    "vue": "^3.4.21",
    "vue-router": "^4.3.0",
    "pinia": "^2.1.7",
    "@vueuse/core": "^10.9.0",
    "three": "^0.162.0",
    "d3": "^7.9.0",
    "gsap": "^3.12.5",
    "echarts": "^5.5.0",
    "@headlessui/vue": "^1.7.18",
    "@heroicons/vue": "^2.1.1"
  },
  "devDependencies": {
    "typescript": "^5.4.2",
    "vite": "^5.1.6",
    "vitest": "^1.4.0",
    "@playwright/test": "^1.42.1",
    "tailwindcss": "^3.4.1",
    "eslint": "^8.57.0",
    "prettier": "^3.2.5",
    "husky": "^9.0.11",
    "lint-staged": "^15.2.2"
  }
}
```

### **12.3 项目初始化命令**

```bash
# 创建项目
npm create vite@latest synapse -- --template vue-ts

cd synapse

# 安装核心依赖
npm install vue-router pinia @vueuse/core

# 安装 UI 依赖
npm install -D tailwindcss postcss autoprefixer
npm install @headlessui/vue @heroicons/vue

# 安装可视化库
npm install three d3 gsap echarts

# 安装开发工具
npm install -D eslint prettier eslint-plugin-vue @typescript-eslint/parser
npm install -D vitest @vitejs/plugin-vue-test-utils
npm install -D @playwright/test
npm install -D husky lint-staged

# 初始化配置
npx tailwindcss init -p
npx husky init

# 启动开发服务器
npm run dev
```

---

## **📌 总结 (Summary)**

本设计文档定义了 Synapse 的完整技术实现方案，相比 v1.0 版本，主要改进包括：

1. **更强的技术栈**: 引入 TypeScript、完整测试框架、性能监控
2. **更清晰的架构**: 领域驱动设计、分层架构、composables 模式
3. **更丰富的功能**: 新增3个页面、3D可视化、实时协作演示
4. **更好的用户体验**: 自动演示模式、引导教程、无障碍支持
5. **更完善的工程化**: Storybook、CI/CD、性能预算、代码规范

这不仅是一个演示平台，更是一个**可扩展为真实产品**的技术原型。

---

**文档版本**: 2.0  
**最后更新**: 2025-10-07  
**维护者**: [Your Name]  
**审核状态**: ✅ 待技术评审

