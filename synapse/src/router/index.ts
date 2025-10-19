import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: () => import('@/views/LandingView.vue'),
      meta: { title: 'Synapse - AI洞察引擎' }
    },
    {
      path: '/ingestion',
      name: 'Ingestion',
      component: () => import('@/views/IngestionView.vue'),
      meta: { title: '数据入湖' }
    },
    {
      path: '/processing',
      name: 'Processing',
      component: () => import('@/views/ProcessingView.vue'),
      meta: { title: '数据处理', heavy: true }
    },
    {
      path: '/exploration',
      name: 'Exploration',
      component: () => import('@/views/ExplorationView.vue'),
      meta: { title: '智能探索', preload: ['SearchBar', 'ResultsGrid'] }
    },
    {
      path: '/dataset',
      name: 'Dataset',
      component: () => import('@/views/DatasetView.vue'),
      meta: { 
        title: '训练数据集 - AI训练平台的数据源',
        description: '为AI训练提供高质量、标准化的数据集'
      }
    },
    {
      path: '/dataset/publish-demo',
      name: 'DatasetPublishDemo',
      component: () => import('@/views/DatasetPublishDemoView.vue'),
      meta: { 
        title: '数据集发布流程演示',
        description: '交互式演示数据集从创建到发布的完整流程'
      }
    },
    {
      path: '/collaboration',
      name: 'Collaboration',
      component: () => import('@/views/CollaborationView.vue'),
      meta: { title: '协作' }
    },
    {
      path: '/model-optimization',
      name: 'ModelOptimization',
      component: () => import('@/views/ModelOptimizationView.vue'),
      meta: { title: '模型优化' }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { title: 'Director观察者视角 - 全局监控' }
    }
  ]
})

// 路由守卫：更新页面标题
router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title as string
  }
  
  // 预加载组件
  if (to.meta.preload) {
    const components = to.meta.preload as string[]
    components.forEach(comp => {
      import(`@/components/${comp}.vue`).catch(() => {
        // 如果组件不存在，忽略错误
      })
    })
  }
  
  next()
})

export default router
