<template>
  <div class="collaboration-view page-shell">
    <div class="page-container">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="page-title mb-2">
          团队协作
        </h1>
        <p class="page-subtitle">
          跨角色无缝协作 - 洞察分享、任务分配、数据集构建
        </p>
      </div>

      <!-- Team Members -->
      <div class="flex items-center gap-4 mb-8">
        <div
          v-for="member in teamMembers"
          :key="member.id"
          class="flex items-center gap-3 px-4 py-3 rounded-cursor bg-cursor-surface border border-cursor-border hover:border-cursor-accent/50 transition-colors cursor-pointer"
          :class="{ 'border-cursor-accent': currentUser === member.id }"
          @click="switchUser(member.id)"
        >
          <AppAvatar :emoji="member.avatar" size="md" />
          <div>
            <div class="font-semibold">{{ member.name }}</div>
            <div class="text-xs text-cursor-fg-muted">{{ member.role }}</div>
          </div>
          <div
            class="w-2 h-2 rounded-full ml-2"
            :class="member.status === 'online' ? 'bg-green-500' : 'bg-cursor-fg-subtle'"
          ></div>
        </div>
      </div>

      <!-- Split View -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <!-- 张三's Insights Board -->
        <AppCard variant="elevated">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <AppAvatar emoji="👩" size="sm" />
                <div>
                  <h2 class="text-xl font-semibold">张三 的洞察看板</h2>
                  <p class="text-2xs text-cursor-fg-muted">数据工程师</p>
                </div>
              </div>
              <AppButton size="sm" variant="outline" @click="createInsight">
                ➕ 新洞察
              </AppButton>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="insight in insights"
              :key="insight.id"
              class="p-4 rounded-cursor bg-cursor-panel border border-cursor-border hover:border-cursor-accent/30 transition-colors cursor-pointer"
              @click="selectInsight(insight)"
            >
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold">{{ insight.title }}</h3>
                <AppBadge :variant="insight.priority === 'high' ? 'error' : 'info'" size="sm">
                  {{ insight.priority }}
                </AppBadge>
              </div>
              <p class="text-2xs text-cursor-fg-muted mb-3">{{ insight.description }}</p>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-xs text-cursor-fg-muted">{{ insight.assets.length }} 个资产</span>
                  <span class="text-xs text-cursor-fg-muted">•</span>
                  <span class="text-xs text-cursor-fg-muted">{{ insight.createdAt }}</span>
                </div>
                <AppButton
                  size="sm"
                  variant="ghost"
                  @click.stop="shareInsight(insight)"
                >
                  📤 分享给 李四
                </AppButton>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- 李四's Task Queue -->
        <AppCard variant="elevated">
          <template #header>
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <AppAvatar emoji="👨" size="sm" />
                <div>
                  <h2 class="text-xl font-semibold">李四 的任务队列</h2>
                  <p class="text-2xs text-cursor-fg-muted">AI工程师</p>
                </div>
              </div>
              <AppBadge variant="warning">{{ pendingTasks }} 待处理</AppBadge>
            </div>
          </template>

          <div class="space-y-4">
            <div
              v-for="task in tasks"
              :key="task.id"
              class="p-4 rounded-cursor bg-cursor-panel border border-cursor-border"
            >
              <div class="flex items-start justify-between mb-2">
                <h3 class="font-semibold">{{ task.title }}</h3>
                <AppBadge
                  :variant="task.status === 'completed' ? 'success' : task.status === 'in_progress' ? 'warning' : 'default'"
                  size="sm"
                >
                  {{ getStatusText(task.status) }}
                </AppBadge>
              </div>
              <p class="text-2xs text-cursor-fg-muted mb-3">{{ task.description }}</p>
              <div class="flex items-center gap-2 mb-3">
                <AppAvatar :emoji="task.creator.avatar" size="sm" />
                <span class="text-xs text-cursor-fg-muted">
                  {{ task.creator.name }} 创建于 {{ task.createdAt }}
                </span>
              </div>
              
              <!-- Dataset Info -->
              <div class="p-3 rounded bg-cursor-surface mb-3">
                <div class="text-xs text-cursor-fg-muted mb-2">包含数据集</div>
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium">{{ task.dataset.count }} 个资产</span>
                  <span class="text-xs text-cursor-fg-muted">{{ task.dataset.size }}</span>
                </div>
              </div>

              <div class="flex gap-2">
                <AppButton
                  v-if="task.status === 'pending'"
                  size="sm"
                  variant="primary"
                  @click="acceptTask(task)"
                >
                  ✓ 接受任务
                </AppButton>
                <AppButton
                  v-else-if="task.status === 'in_progress'"
                  size="sm"
                  variant="outline"
                  @click="viewTaskDetails(task)"
                >
                  查看详情
                </AppButton>
                <AppButton size="sm" variant="ghost" @click="downloadDataset(task)">
                  📥 下载数据集
                </AppButton>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Activity Feed -->
      <AppCard variant="elevated">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">协作动态</h2>
            <span class="text-2xs text-cursor-fg-muted">实时更新</span>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="activity in activities"
            :key="activity.id"
            class="flex items-start gap-4 pb-4 border-b border-cursor-border last:border-0"
          >
            <AppAvatar :emoji="activity.user.avatar" size="md" />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <span class="font-semibold">{{ activity.user.name }}</span>
                <span class="text-2xs text-cursor-fg-muted">{{ activity.time }}</span>
              </div>
              <p class="text-sm text-cursor-fg">{{ activity.action }}</p>
              <div v-if="activity.target" class="mt-2 px-3 py-2 rounded bg-cursor-surface text-sm">
                {{ activity.target }}
              </div>
            </div>
            <div class="text-2xl">{{ activity.icon }}</div>
          </div>
        </div>
      </AppCard>

      <!-- Notification -->
      <AppNotification
        :show="showNotification"
        :type="notification.type"
        :title="notification.title"
        :message="notification.message"
        @close="showNotification = false"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppAvatar from '@/components/atoms/AppAvatar.vue'
import AppNotification from '@/components/atoms/AppNotification.vue'

const userStore = useUserStore()

interface TeamMember {
  id: string
  name: string
  role: string
  avatar: string
  status: 'online' | 'away' | 'offline'
}

interface Insight {
  id: string
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
  assets: string[]
  createdAt: string
}

interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  creator: TeamMember
  createdAt: string
  dataset: {
    count: number
    size: string
  }
}

const teamMembers = ref<TeamMember[]>([
  { id: 'user_张三', name: '张三', role: '数据工程师', avatar: '👩', status: 'online' },
  { id: 'user_李四', name: '李四', role: 'AI工程师', avatar: '👨', status: 'online' },
  { id: 'user_王五', name: '王五', role: 'Director', avatar: '👩‍💼', status: 'away' }
])

// 当前用户从userStore获取,如果没有则默认为张三
const currentUser = computed(() => userStore.currentUser?.id || 'user_张三')

const insights = ref<Insight[]>([
  {
    id: '1',
    title: '语音唤醒响应时间过长问题',
    description: '通过分析15个用户访谈视频，发现唤醒响应时间平均达到2.3秒，远高于行业标准',
    priority: 'high',
    assets: ['vid_001', 'vid_002', 'pdf_003'],
    createdAt: '2小时前'
  },
  {
    id: '2',
    title: '竞品Tesla语音交互优势分析',
    description: 'Tesla Model S的语音系统采用了端侧+云端混合架构，响应速度提升40%',
    priority: 'medium',
    assets: ['pdf_005', 'vid_006'],
    createdAt: '5小时前'
  }
])

const tasks = ref<Task[]>([
  {
    id: 'task_001',
    title: '优化语音唤醒模型 - 噪音环境适应性',
    description: '张三发现的关键问题，需要提升模型在嘈杂环境下的表现',
    status: 'pending',
    creator: teamMembers.value[0],
    createdAt: '刚刚',
    dataset: {
      count: 15,
      size: '2.3 GB'
    }
  },
  {
    id: 'task_002',
    title: '语义理解模型微调',
    description: '基于用户反馈数据，优化自然语言理解能力',
    status: 'in_progress',
    creator: teamMembers.value[0],
    createdAt: '昨天',
    dataset: {
      count: 234,
      size: '15.7 GB'
    }
  },
  {
    id: 'task_003',
    title: '竞品功能对比分析模型',
    description: '训练模型自动识别竞品优势功能',
    status: 'completed',
    creator: teamMembers.value[2],
    createdAt: '3天前',
    dataset: {
      count: 89,
      size: '5.2 GB'
    }
  }
])

const activities = ref([
  {
    id: '1',
    user: teamMembers.value[0],
    action: '分享了新洞察',
    target: '语音唤醒响应时间过长问题',
    icon: '💡',
    time: '刚刚'
  },
  {
    id: '2',
    user: teamMembers.value[1],
    action: '接受了任务',
    target: '语义理解模型微调',
    icon: '✓',
    time: '5分钟前'
  },
  {
    id: '3',
    user: teamMembers.value[0],
    action: '上传了新资产',
    target: '用户访谈视频 #16',
    icon: '📤',
    time: '15分钟前'
  },
  {
    id: '4',
    user: teamMembers.value[1],
    action: '完成了模型训练',
    target: '准确率提升至 94.3%',
    icon: '🎯',
    time: '1小时前'
  }
])

const showNotification = ref(false)
const notification = ref({
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  title: '',
  message: ''
})

const pendingTasks = computed(() => {
  return tasks.value.filter(t => t.status === 'pending').length
})

const switchUser = (userId: string) => {
  // 更新全局用户状态
  userStore.setUser(userId)
  const userName = teamMembers.value.find(m => m.id === userId)?.name
  showNotificationMessage('success', '切换角色', `已切换到 ${userName}`)
}

const createInsight = () => {
  showNotificationMessage('info', '创建洞察', '洞察创建功能即将推出')
}

const selectInsight = (insight: Insight) => {
  console.log('Selected insight:', insight)
}

const shareInsight = (insight: Insight) => {
  // 模拟分享
  const newTask: Task = {
    id: `task_${Date.now()}`,
    title: `处理洞察: ${insight.title}`,
    description: insight.description,
    status: 'pending',
    creator: teamMembers.value[0],
    createdAt: '刚刚',
    dataset: {
      count: insight.assets.length,
      size: '1.2 GB'
    }
  }
  
  tasks.value.unshift(newTask)
  
  // 添加活动记录
  activities.value.unshift({
    id: Date.now().toString(),
    user: teamMembers.value[0],
    action: '创建了新任务',
    target: newTask.title,
    icon: '📋',
    time: '刚刚'
  })
  
  showNotificationMessage('success', '分享成功', `已将洞察分享给 李四，任务已创建`)
}

const acceptTask = (task: Task) => {
  task.status = 'in_progress'
  
  activities.value.unshift({
    id: Date.now().toString(),
    user: teamMembers.value[1],
    action: '接受了任务',
    target: task.title,
    icon: '✓',
    time: '刚刚'
  })
  
  showNotificationMessage('success', '任务已接受', `开始处理: ${task.title}`)
}

const viewTaskDetails = (task: Task) => {
  console.log('View task:', task)
}

const downloadDataset = (task: Task) => {
  showNotificationMessage('info', '下载数据集', `正在准备 ${task.dataset.size} 的数据集...`)
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    pending: '待处理',
    in_progress: '进行中',
    completed: '已完成'
  }
  return statusMap[status] || status
}

const showNotificationMessage = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
  notification.value = { type, title, message }
  showNotification.value = true
  setTimeout(() => {
    showNotification.value = false
  }, 3000)
}
</script>
