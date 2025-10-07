# **项目名称：【Project Synapse \- AI洞察引擎】动态演示平台**

**版本：1.0**

**目标**：构建一个高保真、可交互的前端Web应用Demo，旨在向决策层、客户及跨部门团队，生动、直观地展示多模odal AI数据湖从数据入湖、智能处理、多模态检索到赋能AI模型优化的端到端核心价值。

## **1\. 核心叙事与用户流程 (Core Narrative & User Flow)**

Demo将围绕“新星汽车” (Nova Automotive) 研发下一代智能座舱的业务场景展开，通过两位核心角色 **Sarah (市场分析师)** 和 **Leo (AI工程师)** 的协作，演绎一个完整的数据价值闭环故事。

**故事线 (The Story Arc):**

1. **挑战 (The Challenge)**: Sarah面临海量、异构的市场与用户数据孤岛，难以进行高效洞察。  
2. **汇入与理解 (Ingestion & Understanding)**: 数据被轻松汇入Synapse平台，后台自动进行多模态特征提取，将原始数据转化为可理解的“智能资产”。  
3. **探索与发现 (Exploration & Discovery)**: Sarah利用强大的多模态检索能力，从不同维度的数据中发现了隐藏的、深层的业务洞察。  
4. **洞察转化为行动 (Insight to Action)**: Sarah将洞察打包成AI任务，一键推送给AI工程师Leo。  
5. **AI赋能与进化 (AI Empowerment & Evolution)**: Leo利用这份高质量数据集快速优化AI模型，并通过可视化对比验证了模型的显著提升。  
6. **价值闭环 (Closing the Loop)**: 进化后的AI能力将反哺业务，形成持续优化的数据飞轮。

## **2\. 技术栈选型 (Technology Stack)**

| 类别 | 技术 | 理由 (Best Practice) |
| :---- | :---- | :---- |
| **核心框架** | **Vue 3 (Composition API)** | 响应式数据流清晰，组件化能力强，生态成熟，非常适合快速构建数据驱动的SPA（单页应用）。 |
| **构建工具** | **Vite** | 提供极速的开发服务器启动和热更新，构建效率高，是现代前端开发的首选。 |
| **UI/样式** | **Tailwind CSS** | 功能优先的CSS框架，能极速构建美观、高度定制化的界面，避免编写冗余CSS，保持代码整洁。 |
| **状态管理** | **Pinia** | Vue官方推荐的状态管理库，轻量、易用且类型安全，完美契合Vue 3的组合式API。 |
| **图标库** | **Heroicons** | 设计简洁、现代，与Tailwind CSS无缝集成。 |
| **动画库** | **Vue Transitions & GSAP (可选)** | Vue内置的过渡系统能满足大部分需求，对于复杂的动画（如向量空间展示），可引入GSAP增强效果。 |

## **3\. 功能模块与组件拆解 (Modules & Component Breakdown)**

平台由以下核心页面和组件构成：

**3.1 页面 (Pages)**

* IngestionView.vue: **数据入湖页**，对应叙事的第一、二幕。  
* SearchView.vue: **统一探索页**，对应叙事的第三幕，是Demo的核心交互区。  
* DashboardView.vue: **看板与数据集构建页**，对应叙事的第四幕。  
* ModelFinetuneView.vue: **模型优化验证页**，对应叙事的第五幕，是一个纯展示性页面。

**3.2 核心组件 (Components)**

* TheHeader.vue: 全局导航栏。  
* FileUploader.vue: 文件拖拽上传组件，带动画效果。  
* AssetCard.vue: 展示处理状态的“数据资产”卡片。  
* AssetDetailModal.vue: 弹窗，用于**可视化展示**特征提取过程。  
  * TagCloud.vue: 自动标签云。  
  * VectorAnimation.vue: 模拟的向量空间动画。  
* SearchBar.vue: 核心的多模态搜索框（支持文本输入和图片上传）。  
* ResultsGrid.vue: 搜索结果的网格布局容器。  
* KnowledgeCard.vue: 统一的“知识卡片”，用于展示不同类型（PDF, 视频, 图片）的搜索结果。  
* VideoPlayerWithSearch.vue: 带有时间轴标记和视频内搜索功能的播放器。  
* DatasetBuilderModal.vue: “构建AI数据集”的弹窗表单。

## **4\. 后端数据模拟方案 (Mock API Design)**

创建一个 src/api/mockAPI.js 文件，模拟所有后端交互。API需支持异步和延迟，以模仿真实网络环境。

**核心函数:**

* uploadFiles(files): 接收文件列表，延迟2秒后返回处理中的资产对象。  
* getAssetDetails(assetId): 根据ID返回资产的详细信息，包括模拟的AI标签和特征向量元数据。  
* search(query): **核心模拟函数**。根据特定输入返回预设的JSON结果。  
  * 如果 query.type \=== 'text' 且 query.term 包含 "语音唤醒"，返回包含视频和PDF的结果集。  
  * 如果 query.type \=== 'image' 且 query.file.name 是特定的图片，返回包含专利PDF和设计师访谈视频的结果集。

**数据结构示例 (JSON):**

// search() 函数返回的数据结构示例  
{  
  "results": \[  
    {  
      "id": "vid001",  
      "type": "video",  
      "title": "知名KOL深度体验天狼星座舱",  
      "thumbnailUrl": "/images/video\_thumb.jpg",  
      "source": "Bilibili",  
      "timestamp": "15:32", // 关键信息，用于视频跳转  
      "snippet": "...最让我头疼的是，它的语音唤醒功能在嘈杂环境下几乎失灵..."  
    },  
    {  
      "id": "pdf002",  
      "type": "pdf",  
      "title": "2025Q3智能座舱用户体验报告",  
      "thumbnailUrl": "/images/pdf\_thumb.jpg",  
      "source": "公司内网",  
      "snippet": "报告指出，超过30%的用户抱怨语音唤醒的成功率..."  
    },  
    {  
        "id": "img005",  
        "type": "image",  
        "title": "天狼星座舱旋钮特写",  
        "thumbnailUrl": "/images/knob\_detail.jpg",  
        "source": "汽车之家"  
    }  
  \]  
}

## **5\. UI/UX 设计与动画规范 (UI/UX & Animation Specs)**

* **设计风格**: 采用**深色模式 (Dark Mode)**，营造科技感和专业感。主色调为科技蓝 (\#4F46E5) 和中性灰。  
* **布局**: 采用响应式设计，确保在标准演示屏幕（1920x1080）上效果最佳。  
* **字体**: 使用无衬线字体，如 "Inter" 或 "Source Han Sans"，保证可读性。  
* **动画指导**:  
  * **加载状态**: 使用平滑的骨架屏 (Skeleton) 或旋转加载器，避免生硬的界面跳动。  
  * **页面切换**: 使用淡入淡出 (Fade) 效果。  
  * **元素出现**: 搜索结果的知识卡片应以**交错动画 (Stagger Animation)** 的形式从下至上、由透明到不透明地浮现，营造动态感。  
  * **悬停效果 (Hover)**: 所有可交互元素（卡片、按钮）在鼠标悬停时应有细微的放大或发光效果，提供即时反馈。  
  * **模态框**: 以缩放和淡入的方式从屏幕中央弹出。

## **6\. 实施路线图 (Implementation Roadmap)**

**Phase 1: 项目初始化与环境搭建 (10%)**

1. 使用 Vite 创建 Vue 3 \+ TypeScript 项目。  
2. 集成 Tailwind CSS 和 Pinia。  
3. 设置项目目录结构（views, components, api, store, assets）。  
4. 配置基本的路由 (vue-router)。

**Phase 2: 静态页面与组件开发 (30%)**

1. 根据设计稿，使用 HTML 和 Tailwind CSS 构建所有页面和组件的静态布局和样式。  
2. 此时，所有内容都是硬编码的，但UI应该是像素完美的。

**Phase 3: 数据模拟与状态管理 (20%)**

1. 编写 mockAPI.js 文件，并定义好所有演示场景所需的模拟数据结构。  
2. 创建 Pinia Store (useDataStore)，用于管理搜索结果、看板内容等全局状态。

**Phase 4: 动态交互逻辑实现 (30%)**

1. 在组件的 \<script setup\> 中引入 Pinia Store 和 mockAPI。  
2. 为 SearchBar.vue 添加事件监听，当用户搜索时调用 mockAPI，并将结果更新到 Pinia Store。  
3. ResultsGrid.vue 监听 Store 的变化，并动态渲染 KnowledgeCard.vue 组件。  
4. 实现“添加到看板”、视频跳转、弹窗表单等所有核心交互逻辑。

**Phase 5: 动画、润色与最终测试 (10%)**

1. 根据UI/UX规范，为页面和组件添加 Vue Transitions 和 CSS 动画。  
2. 全面测试用户流程，确保所有交互如丝般顺滑，符合叙事逻辑。  
3. 清理代码，添加必要的注释。

**交付物**: 一个完整的、自包含的前端项目源代码包。该项目应能在任何现代浏览器中通过简单的 npm install && npm run dev 命令启动并完美运行。