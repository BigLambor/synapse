<template>
  <div class="landing-view min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-950 via-primary-900/20 to-neutral-950">
    <div class="text-center px-4">
      <h1 class="heading-xl text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 mb-6 animate-fade-in">
        Project Synapse
      </h1>
      <p class="body-lg text-neutral-300 mb-12 max-w-2xl mx-auto animate-slide-up">
        AI洞察引擎动态演示平台
      </p>
      
      <div class="flex gap-4 justify-center">
        <button 
          class="px-8 py-3 bg-primary-600 hover:bg-primary-500 text-white rounded-lg transition-colors duration-200 shadow-glow"
          @click="navigateToIngestion"
        >
          开始体验
        </button>
        <button 
          class="px-8 py-3 border border-primary-500 text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors duration-200"
          @click="navigateToDashboard"
        >
          查看仪表板
        </button>
      </div>
      
      <div class="mt-16 grid grid-cols-3 gap-8 max-w-3xl mx-auto">
        <div class="animate-slide-up" style="animation-delay: 0.2s">
          <div class="text-4xl font-bold text-primary-400 mb-2">50%</div>
          <div class="caption">效率提升</div>
        </div>
        <div class="animate-slide-up" style="animation-delay: 0.4s">
          <div class="text-4xl font-bold text-secondary-400 mb-2">3x</div>
          <div class="caption">洞察速度</div>
        </div>
        <div class="animate-slide-up" style="animation-delay: 0.6s">
          <div class="text-4xl font-bold text-accent-400 mb-2">90%</div>
          <div class="caption">满意度</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToIngestion() {
  router.push('/ingestion')
}

function navigateToDashboard() {
  router.push('/dashboard')
}
</script>
