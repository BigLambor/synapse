<template>
  <div class="landing-view page-shell min-h-screen">
    <div class="page-container flex min-h-screen flex-col justify-center py-10">
      <!-- 品牌区 -->
      <div class="mb-10 text-center animate-fade-in">
        <div class="mb-5 flex items-center justify-center gap-3">
          <div class="flex h-14 w-14 items-center justify-center rounded-cursor bg-cursor-accent shadow-cursor">
            <span class="text-2xl font-semibold text-white">S</span>
          </div>
          <div class="text-left">
            <h1 class="page-title">Synapse</h1>
            <p class="page-subtitle !mt-0">AI洞察引擎平台</p>
          </div>
        </div>
        <p class="page-subtitle mx-auto max-w-2xl">
          多模态数据湖 · 智能分析引擎 · 团队协作平台<br />
          让数据洞察从数周缩短到数秒
        </p>
      </div>

      <!-- 角色选择 -->
      <div class="mb-8 animate-slide-up" style="animation-delay: 0.05s">
        <p class="mb-4 text-center text-sm font-medium text-cursor-fg">选择您的角色，开始探索</p>
        <div class="grid gap-4 md:grid-cols-3">
          <button
            v-for="role in roles"
            :key="role.id"
            type="button"
            class="rounded-cursor border border-cursor-border bg-cursor-surface p-5 text-left shadow-cursor transition-all duration-200 hover:border-cursor-accent hover:shadow-cursor-lg"
            @click="selectRole(role.id)"
          >
            <div class="mb-3 flex items-center gap-3">
              <span class="flex h-10 w-10 items-center justify-center rounded-full bg-cursor-accent text-sm font-medium text-white">
                {{ role.initials }}
              </span>
              <div>
                <h3 class="text-base font-medium text-cursor-fg">{{ role.name }}</h3>
                <p class="text-sm text-cursor-accent">{{ role.title }}</p>
              </div>
            </div>
            <p class="text-sm leading-relaxed text-cursor-fg-muted">{{ role.desc }}</p>
          </button>
        </div>
      </div>

      <!-- 快捷入口 -->
      <div class="mb-10 flex flex-wrap justify-center gap-3 animate-slide-up" style="animation-delay: 0.1s">
        <button class="btn-cursor-primary px-8" @click="navigateToIngestion">开始体验</button>
        <button class="btn-cursor-secondary px-8" @click="navigateToExploration">智能探索</button>
        <button class="btn-cursor-secondary px-8" @click="navigateToCollaboration">团队协作</button>
      </div>

      <!-- 核心指标 -->
      <div class="mb-10 grid gap-4 md:grid-cols-3 animate-slide-up" style="animation-delay: 0.15s">
        <div
          v-for="metric in metrics"
          :key="metric.label"
          class="rounded-cursor border border-cursor-border bg-cursor-surface p-5 text-center shadow-cursor"
        >
          <div class="mb-1 text-3xl font-semibold text-cursor-accent">{{ metric.value }}</div>
          <div class="mb-0.5 text-sm font-medium text-cursor-fg">{{ metric.label }}</div>
          <div class="text-2xs text-cursor-fg-muted">{{ metric.desc }}</div>
        </div>
      </div>

      <!-- 能力概览 -->
      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-slide-up" style="animation-delay: 0.2s">
        <div
          v-for="feature in features"
          :key="feature.title"
          class="rounded-cursor border border-cursor-border bg-cursor-surface p-4 text-left shadow-cursor transition-colors hover:border-cursor-accent/50"
        >
          <h3 class="mb-1 text-sm font-medium text-cursor-fg">{{ feature.title }}</h3>
          <p class="text-2xs text-cursor-fg-muted">{{ feature.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const roles = [
  { id: 'user_张三', name: '张三', initials: '张', title: '数据工程师', desc: '深度挖掘用户洞察，快速定位市场机会' },
  { id: 'user_李四', name: '李四', initials: '李', title: 'AI工程师', desc: '模型优化与训练，数据驱动的AI创新' },
  { id: 'user_王五', name: '王五', initials: '王', title: '技术总监', desc: '全局监控与决策，技术战略规划' },
]

const metrics = [
  { value: '50%', label: '效率提升', desc: '数据处理速度大幅提升' },
  { value: '3x', label: '洞察速度', desc: '从数据到决策的时间缩短' },
  { value: '90%', label: '满意度', desc: '用户体验显著改善' },
]

const features = [
  { title: '数据入湖', desc: '多模态数据一键上传' },
  { title: '智能搜索', desc: '语义理解跨模态查询' },
  { title: '团队协作', desc: '洞察分享与任务分配' },
  { title: '实时监控', desc: '数据资产全生命周期追踪' },
]

function selectRole(userId: string) {
  userStore.setUser(userId)
  if (userId === 'user_张三') router.push('/exploration')
  else if (userId === 'user_李四') router.push('/model-optimization')
  else if (userId === 'user_王五') router.push('/dashboard')
}

function navigateToIngestion() {
  router.push('/ingestion')
}

function navigateToExploration() {
  router.push('/exploration')
}

function navigateToCollaboration() {
  router.push('/collaboration')
}
</script>
