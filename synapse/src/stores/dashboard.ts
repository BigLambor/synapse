import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Task {
  id: string
  title: string
  creator: string
  assignee: string
  dataset: {
    assetIds: string[]
    annotations: Array<{
      assetId: string
      timeRange?: [number, number]
      label: string
      notes?: string
    }>
  }
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  createdAt: string
  updatedAt?: string
  completedAt?: string
}

export interface DashboardMetrics {
  totalAssets: number
  todayProcessed: number
  activeUsers: number
  storageUsed: number
  storageLimit: number
  avgProcessingTime: number
  successRate: number
  taskCompletionRate: number
}

export const useDashboardStore = defineStore('dashboard', () => {
  // State
  const tasks = ref<Task[]>([])
  const metrics = ref<DashboardMetrics>({
    totalAssets: 0,
    todayProcessed: 0,
    activeUsers: 0,
    storageUsed: 0,
    storageLimit: 1000,
    avgProcessingTime: 0,
    successRate: 0,
    taskCompletionRate: 0
  })
  const savedInsights = ref<Array<{
    id: string
    title: string
    assetIds: string[]
    notes: string
    createdAt: string
  }>>([])

  // Getters
  const activeTasks = computed(() => 
    tasks.value.filter(t => t.status === 'in_progress' || t.status === 'pending')
  )
  const completedTasks = computed(() => 
    tasks.value.filter(t => t.status === 'completed')
  )
  const myTasks = computed(() => (userId: string) => 
    tasks.value.filter(t => t.assignee === userId || t.creator === userId)
  )
  const storagePercentage = computed(() => 
    (metrics.value.storageUsed / metrics.value.storageLimit) * 100
  )

  // Actions
  function addTask(task: Task) {
    tasks.value.push(task)
  }

  function updateTask(taskId: string, updates: Partial<Task>) {
    const index = tasks.value.findIndex(t => t.id === taskId)
    if (index > -1) {
      tasks.value[index] = { 
        ...tasks.value[index], 
        ...updates,
        updatedAt: new Date().toISOString()
      }
    }
  }

  function completeTask(taskId: string) {
    updateTask(taskId, {
      status: 'completed',
      completedAt: new Date().toISOString()
    })
  }

  function updateMetrics(newMetrics: Partial<DashboardMetrics>) {
    metrics.value = { ...metrics.value, ...newMetrics }
  }

  function saveInsight(insight: {
    title: string
    assetIds: string[]
    notes: string
  }) {
    savedInsights.value.push({
      id: `insight_${Date.now()}`,
      ...insight,
      createdAt: new Date().toISOString()
    })
  }

  function removeInsight(insightId: string) {
    const index = savedInsights.value.findIndex(i => i.id === insightId)
    if (index > -1) {
      savedInsights.value.splice(index, 1)
    }
  }

  return {
    // State
    tasks,
    metrics,
    savedInsights,
    // Getters
    activeTasks,
    completedTasks,
    myTasks,
    storagePercentage,
    // Actions
    addTask,
    updateTask,
    completeTask,
    updateMetrics,
    saveInsight,
    removeInsight
  }
})
