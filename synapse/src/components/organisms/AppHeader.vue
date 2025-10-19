<template>
  <header class="sticky top-0 z-50 bg-neutral-900/95 border-b border-neutral-800">
    <div class="container mx-auto px-6 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-3 group">
          <div>
            <h1 class="text-xl font-bold bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
              Synapse
            </h1>
            <p class="text-xs text-neutral-500">AI洞察引擎</p>
          </div>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden md:flex items-center space-x-1">
          <router-link
            v-for="item in visibleNavItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            :class="isActive(item.path) 
              ? 'bg-primary-500/20 text-primary-400' 
              : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'"
          >
            <span class="mr-2">{{ item.icon }}</span>
            {{ item.label }}
          </router-link>
        </nav>

        <!-- User Menu -->
        <div class="flex items-center space-x-4">
          <div class="hidden sm:block text-right">
            <p class="text-sm font-medium text-neutral-200">{{ currentUser.name }}</p>
            <p class="text-xs text-neutral-500">{{ currentUser.role }}</p>
          </div>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-xl">
            {{ currentUser.avatar }}
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const userStore = useUserStore()

const navItems = [
  { path: '/', label: '首页', icon: '🏠', roles: ['all'] },
  { path: '/ingestion', label: '数据入湖', icon: '📥', roles: ['all'] },
  { path: '/processing', label: '数据处理', icon: '⚙️', roles: ['all'] },
  { path: '/exploration', label: '智能探索', icon: '🔍', roles: ['all'] },
  { path: '/dataset', label: '训练数据集', icon: '🎯', roles: ['all'] },
  { path: '/collaboration', label: '团队协作', icon: '🤝', roles: ['all'] },
  { path: '/model-optimization', label: '模型优化', icon: '🚀', roles: ['all'] },
  { path: '/dashboard', label: 'Director视角', icon: '📊', roles: ['user_王五'] }
]

// 根据用户角色过滤导航项
const visibleNavItems = computed(() => {
  return navItems.filter(item => {
    if (item.roles.includes('all')) return true
    if (!userStore.currentUser) return item.roles.includes('all')
    return item.roles.includes(userStore.currentUser.id)
  })
})

// 从userStore获取当前用户,如果没有则使用默认用户
const currentUser = computed(() => {
  if (userStore.currentUser) {
    return {
      name: userStore.currentUser.name,
      role: getRoleText(userStore.currentUser.role),
      avatar: getAvatarEmoji(userStore.currentUser.id)
    }
  }
  // 默认用户
  return {
    name: '张三',
    role: '数据工程师',
    avatar: '👩'
  }
})

const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    'Market Analyst': '数据工程师',
    'AI Engineer': 'AI工程师',
    'Director': '技术总监'
  }
  return roleMap[role] || role
}

const getAvatarEmoji = (userId: string): string => {
  const avatarMap: Record<string, string> = {
    'user_张三': '👩',
    'user_李四': '👨',
    'user_王五': '👩‍💼'
  }
  return avatarMap[userId] || '👤'
}

const isActive = (path: string) => {
  return route.path === path
}
</script>

