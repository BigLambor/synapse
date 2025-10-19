<template>
  <div class="dataset-publish-demo-view min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8">
    <div class="max-w-7xl mx-auto">
      <!-- 返回按钮 -->
      <div class="mb-6">
        <button
          @click="goBack"
          class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        >
          <span>←</span>
          <span>返回数据集列表</span>
        </button>
      </div>

      <!-- 页面标题 -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-white mb-3">
          数据集发布流程
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            完整演示
          </span>
        </h1>
        <p class="text-gray-400 text-lg">
          真实模拟从创建到发布的全过程，体验数据集的完整生命周期
        </p>
      </div>

      <!-- 流程说明卡片 -->
      <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-6 mb-8">
        <div class="flex items-start gap-4">
          <div class="text-4xl">📊</div>
          <div class="flex-1">
            <h3 class="text-lg font-bold text-white mb-2">关于这个演示</h3>
            <p class="text-gray-300 text-sm mb-3">
              这个交互式演示将引导你完成数据集发布的5个关键阶段：
            </p>
            <div class="grid grid-cols-5 gap-3 text-xs">
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-yellow-400 font-semibold mb-1">1. 草稿</div>
                <div class="text-gray-400">配置基本信息和标注规则</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-blue-400 font-semibold mb-1">2. 处理中</div>
                <div class="text-gray-400">AI任务专属标注</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-green-400 font-semibold mb-1">3. 就绪</div>
                <div class="text-gray-400">质量评估和问题修复</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-purple-400 font-semibold mb-1">4. 已发布</div>
                <div class="text-gray-400">管理员审核并发布</div>
              </div>
              <div class="bg-gray-800/50 rounded-lg p-3">
                <div class="text-gray-400 font-semibold mb-1">5. 已归档</div>
                <div class="text-gray-400">使用完毕后归档</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 两阶段处理说明 -->
      <div class="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-xl p-5 mb-8">
        <div class="flex items-start gap-3">
          <div class="text-2xl">💡</div>
          <div class="flex-1">
            <h4 class="text-base font-bold text-white mb-2">为什么数据要处理两次？</h4>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div class="bg-gray-800/30 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-blue-400 font-semibold">🌊 入湖处理</span>
                  <span class="text-xs text-gray-500">(数据刚进入系统)</span>
                </div>
                <div class="text-gray-300 text-xs space-y-1">
                  <div>• <span class="text-gray-400">目的：</span>方便检索和探索</div>
                  <div>• <span class="text-gray-400">标注：</span>通用、粗粒度（如"负面情绪"）</div>
                  <div>• <span class="text-gray-400">特征：</span>通用向量（CLIP、BERT）</div>
                  <div>• <span class="text-gray-400">质量：</span>80%准确率即可</div>
                </div>
              </div>
              <div class="bg-gray-800/30 rounded-lg p-3">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-purple-400 font-semibold">🎯 数据集处理</span>
                  <span class="text-xs text-gray-500">(创建训练集时)</span>
                </div>
                <div class="text-gray-300 text-xs space-y-1">
                  <div>• <span class="text-gray-400">目的：</span>生成高质量训练数据</div>
                  <div>• <span class="text-gray-400">标注：</span>专业、细粒度（如"愤怒0.92"）</div>
                  <div>• <span class="text-gray-400">特征：</span>任务特定（梅尔频谱、词性）</div>
                  <div>• <span class="text-gray-400">质量：</span>95%+准确率，人工复核</div>
                </div>
              </div>
            </div>
            <div class="mt-3 text-xs text-gray-400 flex items-center gap-2">
              <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
              </svg>
              <span>入湖处理让数据"可被找到"，数据集处理让数据"可被训练"</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 发布流程组件 -->
      <DatasetPublishFlow />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import DatasetPublishFlow from '@/components/organisms/DatasetPublishFlow.vue'

const router = useRouter()

const goBack = () => {
  router.push('/dataset')
}
</script>

<style scoped>
/* 额外的样式可以在这里添加 */
</style>

