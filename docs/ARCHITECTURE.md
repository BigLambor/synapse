# Synapse - 架构文档

## 系统架构概述

Synapse采用分层架构设计，基于领域驱动设计(DDD)原则，确保代码的可维护性和可扩展性。

## 架构分层

```
┌─────────────────────────────────────┐
│  Presentation Layer (Views)         │  ← 页面组件
├─────────────────────────────────────┤
│  Application Layer (Composables)    │  ← 业务逻辑
├─────────────────────────────────────┤
│  Domain Layer (Stores + Types)      │  ← 领域模型
├─────────────────────────────────────┤
│  Infrastructure Layer (API + Utils) │  ← 技术实现
└─────────────────────────────────────┘
```

## 核心模块

### 1. 表现层 (Presentation Layer)

#### 组件设计模式：原子设计 (Atomic Design)

- **Atoms (原子组件)**: Button, Input, Badge, Avatar, Icon
- **Molecules (分子组件)**: SearchBar, FileUploader, TagCloud, ProgressBar
- **Organisms (组织组件)**: Header, ResultsGrid, DatasetBuilder, VeDirectorrSpace3D
- **Templates (模板组件)**: DashboardLayout, ModalLayout

#### 页面路由

| 路由 | 页面 | 功能 |
|:-----|:-----|:-----|
| / | LandingView | 着陆页，角色选择 |
| /ingestion | IngestionView | 数据上传 |
| /processing | ProcessingView | 处理可视化 |
| /exploration | ExplorationView | 多模态搜索 |
| /collaboration | CollaborationView | 团队协作 |
| /model-optimization | ModelOptimizationView | 模型优化 |
| /dashboard | DashboardView | Director仪表板 |

### 2. 应用层 (Application Layer)

使用Vue 3 Composition API和Composables模式封装业务逻辑：

- **useSearch**: 搜索逻辑
- **useUpload**: 上传逻辑
- **useAnimation**: 动画控制
- **useWebSocket**: WebSocket模拟
- **useNotification**: 通知系统

### 3. 领域层 (Domain Layer)

#### Pinia Stores

| Store | 职责 |
|:------|:-----|
| useUIStore | UI状态（主题、侧边栏、模态框、通知） |
| useUserStore | 用户管理（当前用户、角色切换） |
| useAssetsStore | 数据资产管理（资产列表、上传队列、处理状态） |
| useSearchStore | 搜索管理（查询、结果、过滤器、排序） |
| useDashboardStore | 仪表板（任务、指标、洞察） |

#### 类型系统

采用TypeScript严格模式，所有领域模型定义在`Domain`命名空间下：

```typescript
Domain.Asset
Domain.SearchQuery
Domain.Task
Domain.User
Domain.DashboardMetrics
```

### 4. 基础设施层 (Infrastructure Layer)

#### Mock API系统

- **MockAPIService**: 模拟后端API
  - 文件上传模拟
  - 智能搜索（文本/图像/语义）
  - 资产管理
  - 任务创建

- **MockWebSocketService**: 模拟实时推送
  - 处理进度更新
  - 协作通知

#### 工具函数

- **format.ts**: 格式化工具（文件大小、时间戳、日期、百分比）
- **validate.ts**: 验证函数
- **performance.ts**: 性能监控
- **constants.ts**: 常量定义

## 数据流

### 单向数据流

```
User Action → Component Event → Store Action → API Call → Store State Update → Component Re-render
```

### 示例：搜索流程

1. 用户在SearchBar输入查询
2. 触发`@search`事件
3. 调用`useSearch` composable
4. 更新`searchStore.isSearching = true`
5. 调用`mockAPI.search()`
6. 更新`searchStore.results`
7. ResultsGrid自动更新显示

## 性能优化策略

### 1. 代码分割

- 路由级别懒加载
- 重型库（Three.js, D3.js）按需加载
- Vendor分包：vue、viz、ui

### 2. 资源优化

- 图像：WebP/AVIF格式
- 懒加载：`loading="lazy"`
- 虚拟滚动：长列表优化

### 3. 缓存策略

- Service Worker
- CDN缓存
- 浏览器缓存

## 测试策略

### 测试金字塔

```
        /\
       /E2E\           10% - 端到端测试
      /------\
     /Integration\     20% - 集成测试
    /------------\
   /Unit Tests    \    70% - 单元测试
  /----------------\
```

### 单元测试 (Vitest)

- Composables测试
- Store测试
- 工具函数测试

### E2E测试 (Playwright)

- 完整用户旅程
- 跨浏览器测试
- 性能基准测试

## 安全考虑

1. **XSS防护**: Vue自动转义
2. **CSRF**: Token验证（生产环境）
3. **输入验证**: 前端+后端双重验证
4. **依赖安全**: 定期`npm audit`

## 可扩展性

### 添加新页面

1. 创建`src/views/NewView.vue`
2. 在`router/index.ts`添加路由
3. 创建对应的Store（如需要）
4. 实现业务逻辑

### 添加新组件

1. 确定组件类型（Atom/Molecule/Organism）
2. 创建组件文件
3. 编写Storybook故事（可选）
4. 编写单元测试

## 部署架构

### 开发环境
```
Vite Dev Server (localhost:5173)
└─ HMR启用
└─ Source Maps
```

### 生产环境
```
CDN (Static Assets)
├─ HTML
├─ CSS (压缩)
├─ JS (代码分割、Tree-shaking)
└─ Images (优化后)
```

## 监控与日志

### 性能监控

- Web Vitals指标收集
- Lighthouse CI集成
- 自定义性能标记

### 错误追踪

- 控制台错误捕获
- Sentry集成（可选）
- 用户行为追踪

## 技术债务管理

| 优先级 | 项目 | 状态 |
|:------|:-----|:-----|
| 高 | ESLint配置修复 | 待处理 |
| 中 | Storybook集成 | 计划中 |
| 低 | PWA支持 | 待评估 |

## 参考资源

- [Vue 3 官方文档](https://vuejs.org/)
- [Pinia 文档](https://pinia.vuejs.org/)
- [Tailwind CSS 文档](https://tailwindcss.com/)
- [原子设计理论](https://bradfrost.com/blog/post/atomic-web-design/)

---

**文档版本**: 1.0  
**最后更新**: 2025-10-07  
**维护者**: Synapse Team
