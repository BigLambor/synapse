<template>
  <header class="sticky top-0 z-50 bg-cursor-surface border-b border-cursor-border shadow-cursor">
    <div class="container mx-auto px-6">
      <div class="flex items-center justify-between h-14 gap-6">
        <!-- Logo -->
        <router-link to="/" class="flex items-center gap-2.5 shrink-0">
          <div class="w-8 h-8 rounded-cursor bg-cursor-accent flex items-center justify-center">
            <span class="text-white text-sm font-semibold">S</span>
          </div>
          <div>
            <h1 class="text-base font-semibold text-cursor-fg leading-tight">Synapse</h1>
            <p class="text-2xs text-cursor-fg-muted leading-tight">AI洞察引擎</p>
          </div>
        </router-link>

        <!-- Navigation -->
        <nav class="hidden lg:flex items-center gap-1 flex-1 justify-center">
          <router-link
            v-for="item in visibleNavItems"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 text-sm transition-colors duration-150 whitespace-nowrap rounded-cursor"
            :class="isActive(item.path)
              ? 'text-cursor-accent font-medium bg-cursor-accent-muted'
              : 'text-cursor-fg hover:text-cursor-accent hover:bg-cursor-surface-hover'"
          >
            {{ item.label }}
          </router-link>
        </nav>

        <!-- User -->
        <div class="flex items-center gap-3 shrink-0">
          <div class="hidden sm:block text-right">
            <p class="text-sm font-medium text-cursor-fg">{{ currentUser.name }}</p>
            <p class="text-2xs text-cursor-fg-muted">{{ currentUser.role }}</p>
          </div>
          <div class="w-8 h-8 rounded-full bg-cursor-accent flex items-center justify-center text-xs text-cursor-fg font-medium">
            {{ currentUser.initials }}
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
  { path: '/', label: '首页', roles: ['all'] },
  { path: '/ingestion', label: '数据入湖', roles: ['all'] },
  { path: '/processing', label: '数据处理', roles: ['all'] },
  { path: '/exploration', label: '智能探索', roles: ['all'] },
  { path: '/dataset', label: '训练数据集', roles: ['all'] },
  { path: '/collaboration', label: '团队协作', roles: ['all'] },
  { path: '/model-optimization', label: '模型优化', roles: ['all'] },
  { path: '/dashboard', label: 'Director视角', roles: ['user_王五'] }
]

const visibleNavItems = computed(() => {
  return navItems.filter(item => {
    if (item.roles.includes('all')) return true
    if (!userStore.currentUser) return item.roles.includes('all')
    return item.roles.includes(userStore.currentUser.id)
  })
})

const currentUser = computed(() => {
  if (userStore.currentUser) {
    return {
      name: userStore.currentUser.name,
      role: getRoleText(userStore.currentUser.role),
      initials: getInitials(userStore.currentUser.name)
    }
  }
  return {
    name: '张三',
    role: '数据工程师',
    initials: '张'
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

const getInitials = (name: string): string => {
  if (!name) return '?'
  return name.charAt(0)
}

const isActive = (path: string) => {
  return route.path === path
}
</script>
