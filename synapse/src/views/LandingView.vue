<template>
  <div class="landing-view min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-neutral-950 via-primary-900/20 to-neutral-950 relative overflow-hidden">
    <!-- Animated Background Elements - 优化：减少动画和模糊效果 -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-2xl opacity-50"></div>
      <div class="absolute bottom-20 right-10 w-96 h-96 bg-secondary-500/10 rounded-full blur-2xl opacity-50"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-500/5 rounded-full blur-2xl opacity-50"></div>
    </div>

    <div class="text-center px-4 z-10 max-w-5xl mx-auto">
      <!-- Main Title -->
      <h1 class="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-400 via-secondary-400 to-accent-400 mb-6 animate-fade-in">
        Synapse
      </h1>
      
      <!-- Subtitle -->
      <p class="text-xl md:text-2xl text-neutral-300 mb-4 animate-slide-up">
        AI洞察引擎动态演示平台
      </p>
      
      <p class="text-base text-neutral-400 mb-12 max-w-2xl mx-auto animate-slide-up" style="animation-delay: 0.2s">
        多模态数据湖 × 智能分析引擎 × 团队协作平台<br/>
        让数据洞察从数周缩短到数秒
      </p>
      
      <!-- 角色选择区域 -->
      <div class="mb-12 animate-slide-up" style="animation-delay: 0.3s">
        <h2 class="text-xl font-semibold text-neutral-300 mb-6">选择您的角色，开始探索</h2>
        <div class="flex flex-col sm:flex-row gap-6 justify-center max-w-4xl mx-auto">
          <div
            class="flex-1 p-6 rounded-xl bg-neutral-900/50 border-2 border-neutral-700 hover:border-primary-500 transition-all duration-200 cursor-pointer group"
            @click="selectRole('user_张三')"
          >
            <div class="text-5xl mb-4">👩</div>
            <h3 class="text-xl font-bold text-neutral-100 mb-2">张三</h3>
            <p class="text-sm text-primary-400 mb-3">市场分析师</p>
            <p class="text-xs text-neutral-400">
              深度挖掘用户洞察<br/>快速定位市场机会
            </p>
          </div>
          
          <div
            class="flex-1 p-6 rounded-xl bg-neutral-900/50 border-2 border-neutral-700 hover:border-secondary-500 transition-all duration-200 cursor-pointer group"
            @click="selectRole('user_李四')"
          >
            <div class="text-5xl mb-4">👨</div>
            <h3 class="text-xl font-bold text-neutral-100 mb-2">李四</h3>
            <p class="text-sm text-secondary-400 mb-3">AI工程师</p>
            <p class="text-xs text-neutral-400">
              模型优化与训练<br/>数据驱动的AI创新
            </p>
          </div>
          
          <div
            class="flex-1 p-6 rounded-xl bg-neutral-900/50 border-2 border-neutral-700 hover:border-accent-500 transition-all duration-200 cursor-pointer group"
            @click="selectRole('user_王五')"
          >
            <div class="text-5xl mb-4">👩‍💼</div>
            <h3 class="text-xl font-bold text-neutral-100 mb-2">王五</h3>
            <p class="text-sm text-accent-400 mb-3">技术总监</p>
            <p class="text-xs text-neutral-400">
              全局监控与决策<br/>技术战略规划
            </p>
          </div>
        </div>
      </div>
      
      <!-- CTA Buttons - 优化：移除 scale 和 shadow 变化 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-slide-up" style="animation-delay: 0.5s">
        <button 
          class="px-8 py-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white text-lg font-semibold rounded-lg transition-colors duration-200"
          @click="navigateToIngestion"
        >
          🚀 开始体验
        </button>
        <button 
          class="px-8 py-4 border-2 border-secondary-500 text-secondary-400 hover:bg-secondary-500/10 text-lg font-semibold rounded-lg transition-colors duration-200"
          @click="navigateToExploration"
        >
          🔍 智能探索
        </button>
        <button 
          class="px-8 py-4 border-2 border-accent-500 text-accent-400 hover:bg-accent-500/10 text-lg font-semibold rounded-lg transition-colors duration-200"
          @click="navigateToCollaboration"
        >
          🤝 团队协作
        </button>
      </div>
      
      <!-- Key Metrics - 优化：移除 backdrop-blur 和 scale -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
        <div class="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-primary-500/50 transition-colors duration-200 animate-slide-up" style="animation-delay: 0.2s">
          <div class="text-5xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent mb-3">50%</div>
          <div class="text-lg font-semibold text-neutral-200 mb-1">效率提升</div>
          <div class="text-sm text-neutral-500">数据处理速度大幅提升</div>
        </div>
        <div class="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-secondary-500/50 transition-colors duration-200 animate-slide-up" style="animation-delay: 0.4s">
          <div class="text-5xl font-bold bg-gradient-to-r from-secondary-400 to-secondary-300 bg-clip-text text-transparent mb-3">3x</div>
          <div class="text-lg font-semibold text-neutral-200 mb-1">洞察速度</div>
          <div class="text-sm text-neutral-500">从数据到决策的时间缩短</div>
        </div>
        <div class="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-accent-500/50 transition-colors duration-200 animate-slide-up" style="animation-delay: 0.6s">
          <div class="text-5xl font-bold bg-gradient-to-r from-accent-400 to-accent-300 bg-clip-text text-transparent mb-3">90%</div>
          <div class="text-lg font-semibold text-neutral-200 mb-1">满意度</div>
          <div class="text-sm text-neutral-500">用户体验显著改善</div>
        </div>
      </div>

      <!-- Features Grid - 优化：减少动画延迟 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <div class="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:border-primary-500/30 transition-colors duration-200 animate-slide-up" style="animation-delay: 0.8s">
          <div class="text-4xl mb-3">📥</div>
          <h3 class="text-lg font-semibold text-neutral-200 mb-2">数据入湖</h3>
          <p class="text-sm text-neutral-500">多模态数据一键上传，自动处理</p>
        </div>
        <div class="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:border-secondary-500/30 transition-colors duration-200 animate-slide-up" style="animation-delay: 1s">
          <div class="text-4xl mb-3">🔍</div>
          <h3 class="text-lg font-semibold text-neutral-200 mb-2">智能搜索</h3>
          <p class="text-sm text-neutral-500">语义理解，跨模态查询</p>
        </div>
        <div class="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:border-accent-500/30 transition-colors duration-200 animate-slide-up" style="animation-delay: 1.2s">
          <div class="text-4xl mb-3">🤝</div>
          <h3 class="text-lg font-semibold text-neutral-200 mb-2">团队协作</h3>
          <p class="text-sm text-neutral-500">洞察分享，任务分配</p>
        </div>
        <div class="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800 hover:border-primary-500/30 transition-colors duration-200 animate-slide-up" style="animation-delay: 1.4s">
          <div class="text-4xl mb-3">📊</div>
          <h3 class="text-lg font-semibold text-neutral-200 mb-2">实时监控</h3>
          <p class="text-sm text-neutral-500">数据资产全生命周期追踪</p>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <div class="w-6 h-10 border-2 border-neutral-600 rounded-full flex items-start justify-center p-2">
        <div class="w-1 h-3 bg-neutral-600 rounded-full"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

function selectRole(userId: string) {
  // 设置用户角色
  userStore.setUser(userId)
  // 根据角色跳转到不同页面
  if (userId === 'user_张三') {
    router.push('/exploration')
  } else if (userId === 'user_李四') {
    router.push('/model-optimization')
  } else if (userId === 'user_王五') {
    router.push('/dashboard')
  }
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

<style scoped>
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 1s ease-out;
}

.animate-slide-up {
  animation: slide-up 1s ease-out;
  animation-fill-mode: both;
}
</style>
