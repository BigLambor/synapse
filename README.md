# Project Synapse - AI洞察引擎动态演示平台

> 基于Vue 3 + TypeScript + Vite构建的企业级AI演示平台

## 📋 项目简介

Project Synapse是一个多模态AI数据湖的端到端演示平台，旨在向决策层、客户及技术团队展示AI洞察引擎的核心价值。通过"展示即产品"的理念，为从演示到生产的转化提供技术原型基础。

## ✨ 核心特性

- 🎨 **现代化UI设计** - 基于Tailwind CSS的原子设计系统
- 🔄 **状态管理** - 使用Pinia进行全局状态管理
- 🧪 **完整测试** - 集成Vitest单元测试和Playwright E2E测试
- 📊 **数据可视化** - 集成Three.js、D3.js、ECharts
- 🎬 **流畅动画** - GSAP驱动的高级动画效果
- 🚀 **性能优化** - 代码分割、懒加载、虚拟滚动
- ♿ **无障碍支持** - WCAG 2.1 AA级合规
- 🌍 **国际化** - 支持中英文切换

## 🛠️ 技术栈

### 核心框架
- **Vue 3** (^3.5.0) - Composition API
- **TypeScript** (^5.9.0) - 类型安全
- **Vite** (^7.1.0) - 构建工具

### 状态与路由
- **Pinia** (^2.3.0) - 状态管理
- **Vue Router** (^4.4.0) - 路由管理
- **VueUse** (^10.11.0) - 组合式工具库

### UI与样式
- **Tailwind CSS** (^3.4.0) - 原子化CSS
- **Headless UI** (^1.7.0) - 无样式组件
- **Heroicons** (^2.2.0) - SVG图标

### 可视化
- **GSAP** (^3.13.0) - 动画引擎
- **Three.js** (^0.162.0) - 3D渲染
- **D3.js** (^7.9.0) - 数据可视化
- **ECharts** (^5.6.0) - 图表库

### 开发工具
- **Vitest** (^1.6.0) - 单元测试
- **Playwright** (^1.50.0) - E2E测试
- **ESLint** + **Prettier** - 代码规范

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

\`\`\`bash
npm install
\`\`\`

### 开发模式

\`\`\`bash
npm run dev
\`\`\`

应用将在 http://localhost:5173 启动

### 构建生产版本

\`\`\`bash
npm run build
\`\`\`

### 预览生产构建

\`\`\`bash
npm run preview
\`\`\`

## 🧪 测试

### 运行单元测试

\`\`\`bash
npm run test:unit
\`\`\`

### 运行E2E测试

\`\`\`bash
npm run test:e2e
\`\`\`

### E2E测试UI模式

\`\`\`bash
npm run test:e2e:ui
\`\`\`

## 📝 代码规范

### 运行Linter

\`\`\`bash
npm run lint
\`\`\`

### 格式化代码

\`\`\`bash
npm run format
\`\`\`

## 📂 项目结构

\`\`\`
synapse/
├── src/
│   ├── assets/              # 静态资源
│   │   └── styles/          # 样式文件
│   ├── components/          # 组件库（原子设计）
│   │   ├── atoms/           # 原子组件
│   │   ├── molecules/       # 分子组件
│   │   ├── organisms/       # 组织组件
│   │   └── templates/       # 模板组件
│   ├── views/               # 页面组件
│   ├── composables/         # 组合式函数
│   ├── stores/              # Pinia状态管理
│   ├── router/              # 路由配置
│   ├── api/                 # API层
│   │   └── mock/            # Mock数据
│   ├── utils/               # 工具函数
│   ├── types/               # TypeScript类型
│   ├── App.vue              # 根组件
│   └── main.ts              # 应用入口
├── tests/                   # 测试文件
│   ├── unit/                # 单元测试
│   └── e2e/                 # E2E测试
├── public/                  # 静态资源
│   └── demo-assets/         # 演示资源
└── docs/                    # 项目文档
\`\`\`

## 🎯 功能模块

### 已实现
- ✅ 项目初始化与基础设施
- ✅ 路由系统配置
- ✅ 状态管理架构
- ✅ 类型系统定义
- ✅ 工具函数库

### 开发中
- 🚧 原子组件库
- 🚧 Mock API系统
- 🚧 页面开发
- 🚧 数据可视化

### 规划中
- 📋 Storybook集成
- 📋 CI/CD流水线
- 📋 性能监控
- 📋 国际化支持

## 📊 性能指标

| 指标 | 目标值 | 当前状态 |
|:-----|:------|:--------|
| LCP | < 2.5s | 待测试 |
| FID | < 100ms | 待测试 |
| CLS | < 0.1 | 待测试 |
| Bundle Size | < 250KB | 待测试 |

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证

## 👥 团队

- **技术负责人** - 架构设计与技术评审
- **前端工程师** - 组件开发和页面实现
- **UI/UX设计师** - 视觉设计和动画规范
- **QA工程师** - 测试策略和质量保证

## 📞 联系方式

- 项目主页: [Project Synapse]
- 技术文档: [查看文档](./docs/)
- 问题反馈: [Issues]

---

**当前版本**: v2.0.0  
**最后更新**: 2025-10-07  
**开发状态**: Phase 0 完成 ✅
