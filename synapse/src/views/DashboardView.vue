<template>
  <div class="dashboard-view page-shell">
    <div class="page-container">
      <!-- Header - 优化：静态内容使用 v-once -->
      <div class="mb-12" v-once>
        <div class="flex items-center gap-4 mb-6">
          <div class="w-10 h-10 rounded-full bg-cursor-accent flex items-center justify-center text-sm text-white font-medium">王</div>
          <div>
            <h1 class="page-title">
              Director 观察者视角
            </h1>
            <p class="page-subtitle mt-2">
              实时监控团队协作效率、数据资产ROI和系统性能
            </p>
          </div>
        </div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-cursor bg-cursor-accent-muted border border-cursor-accent/30">
          <span class="text-cursor-accent text-sm font-medium">王五 专属视角</span>
          <span class="text-xs text-cursor-fg-muted">- 全局监控与决策支持</span>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AppCard
          v-for="metric in metrics"
          :key="metric.id"
          variant="elevated"
          :hoverable="true"
        >
          <div class="flex items-center justify-between mb-4">
            <span class="text-4xl">{{ metric.icon }}</span>
            <AppBadge
              :variant="metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'error' : 'default'"
              size="sm"
            >
              {{ metric.change > 0 ? '+' : '' }}{{ metric.change }}%
            </AppBadge>
          </div>
          <div class="mb-2">
            <div class="text-3xl font-semibold text-cursor-fg mb-1">{{ metric.value }}</div>
            <div class="text-2xs text-cursor-fg-muted">{{ metric.label }}</div>
          </div>
          <div class="h-1 bg-cursor-border rounded-full overflow-hidden">
            <div
              class="h-full transition-all duration-300"
              :class="metric.trend === 'up' ? 'bg-green-500' : metric.trend === 'down' ? 'bg-red-500' : 'bg-cursor-fg-subtle'"
              :style="{ width: Math.abs(metric.change) * 3 + '%' }"
            />
          </div>
        </AppCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- Upload Trend Chart -->
        <AppCard variant="elevated">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">数据入湖趋势</h2>
              <AppBadge variant="info" size="sm">本周</AppBadge>
            </div>
          </template>

          <div class="space-y-6">
            <div
              v-for="(dataset, index) in chartData.uploadTrend.datasets"
              :key="index"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <div
                    class="w-3 h-3 rounded-full"
                    :style="{ backgroundColor: dataset.color }"
                  />
                  <span class="font-medium">{{ dataset.label }}</span>
                </div>
                <span class="text-cursor-fg-muted">{{ getDatasetTotal(dataset.data) }} 个</span>
              </div>
              
              <!-- Simple bar chart -->
              <div class="flex items-end gap-2 h-24">
                <div
                  v-for="(value, dayIndex) in dataset.data"
                  :key="dayIndex"
                  class="flex-1 rounded-t transition-opacity duration-200 hover:opacity-80 cursor-pointer relative group"
                  :style="{
                    backgroundColor: dataset.color,
                    height: getBarHeight(value, dataset.data) + '%',
                    opacity: 0.8
                  }"
                >
                  <div class="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    {{ value }}
                  </div>
                </div>
              </div>
              
              <div class="flex justify-between text-xs text-cursor-fg-muted mt-2">
                <span v-for="(label, i) in chartData.uploadTrend.labels" :key="i">
                  {{ label }}
                </span>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Asset Distribution -->
        <AppCard variant="elevated">
          <template #header>
            <div class="flex items-center justify-between">
              <h2 class="text-xl font-semibold">资产类型分布</h2>
              <span class="text-2xs text-cursor-fg-muted">总计 {{ totalAssets }} 个</span>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="item in chartData.assetDistribution"
              :key="item.name"
              class="space-y-2"
            >
              <div class="flex items-center justify-between text-sm">
                <span class="font-medium">{{ item.name }}</span>
                <span class="text-cursor-fg-muted">{{ item.value }} ({{ getPercentage(item.value, totalAssets) }}%)</span>
              </div>
              <div class="h-3 bg-cursor-border rounded-full overflow-hidden">
                <div
                  class="h-full transition-all duration-500"
                  :style="{
                    width: getPercentage(item.value, totalAssets) + '%',
                    backgroundColor: item.color
                  }"
                />
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-center gap-4 text-xs">
              <div v-for="item in chartData.assetDistribution" :key="item.name" class="flex items-center gap-1">
                <div
                  class="w-2 h-2 rounded-full"
                  :style="{ backgroundColor: item.color }"
                />
                <span class="text-cursor-fg-muted">{{ item.name }}</span>
              </div>
            </div>
          </template>
        </AppCard>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Processing Efficiency -->
        <AppCard variant="elevated" class="lg:col-span-2">
          <template #header>
            <h2 class="text-xl font-semibold">处理效率趋势</h2>
          </template>

          <div class="space-y-4">
            <div class="flex items-end gap-3 h-48">
              <div
                v-for="(value, index) in chartData.processingEfficiency.data"
                :key="index"
                class="flex-1 flex flex-col items-center justify-end gap-2"
              >
                <div class="text-xs text-cursor-fg-muted font-medium">{{ value }}%</div>
                <div
                  class="w-full rounded-t-lg bg-cursor-accent transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                  :style="{ height: value + '%' }"
                />
                <div class="text-xs text-cursor-fg-muted">
                  {{ chartData.processingEfficiency.labels[index] }}
                </div>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex items-center justify-between text-sm">
              <span class="text-cursor-fg-muted">平均效率提升</span>
              <AppBadge variant="success">+27%</AppBadge>
            </div>
          </template>
        </AppCard>

        <!-- Recent Activities -->
        <AppCard variant="elevated">
          <template #header>
            <h2 class="text-xl font-semibold">近期活动</h2>
          </template>

          <div class="space-y-4 max-h-96 overflow-y-auto">
            <div
              v-for="activity in activities"
              :key="activity.id"
              class="flex gap-3 pb-4 border-b border-cursor-border last:border-0"
            >
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-cursor-panel border border-cursor-border flex items-center justify-center text-sm">
                {{ getActivityIcon(activity.type) }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium truncate">{{ activity.user }}</p>
                <p class="text-xs text-cursor-fg-muted">{{ activity.action }}</p>
                <p class="text-xs text-cursor-fg-muted mt-1 truncate">{{ activity.target }}</p>
                <p class="text-xs text-cursor-fg-subtle mt-1">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </AppCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import { mockAPI } from '@/api/mock/mockAPI'
import type { DashboardMetric } from '@/api/mock/mockData'

const metrics = ref<DashboardMetric[]>([])
const chartData = ref<any>({
  uploadTrend: { labels: [], datasets: [] },
  assetDistribution: [],
  processingEfficiency: { labels: [], data: [] }
})
const activities = ref<any[]>([])

const totalAssets = computed(() => {
  if (!chartData.value.assetDistribution) return 0
  return chartData.value.assetDistribution.reduce((sum: number, item: any) => sum + item.value, 0)
})

onMounted(async () => {
  try {
    // 加载数据
    metrics.value = await mockAPI.getDashboardMetrics()
    chartData.value = await mockAPI.getChartData()
    activities.value = await mockAPI.getRecentActivities()
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
    // 设置默认值以防止页面崩溃
    metrics.value = []
    chartData.value = {
      uploadTrend: { labels: [], datasets: [] },
      assetDistribution: [],
      processingEfficiency: { labels: [], data: [] }
    }
    activities.value = []
  }
})

// 辅助函数 - 优化性能
const getDatasetTotal = (data: number[]): number => {
  return data.reduce((a, b) => a + b, 0)
}

const getBarHeight = (value: number, data: number[]): number => {
  const max = Math.max(...data)
  return (value / max) * 100
}

const getPercentage = (value: number, total: number): string => {
  if (total === 0) return '0.0'
  return ((value / total) * 100).toFixed(1)
}

const getActivityIcon = (type: string): string => {
  const icons: Record<string, string> = {
    upload: '📤',
    dataset: '📊',
    insight: '💡',
    view: '👁️'
  }
  return icons[type] || '📌'
}
</script>
