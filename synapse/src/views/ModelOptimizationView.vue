<template>
  <div class="model-optimization-view min-h-screen bg-gradient-to-br from-neutral-950 via-orange-900/10 to-neutral-950">
    <div class="container mx-auto px-6 py-12">
      <!-- Header -->
      <div class="mb-12">
        <h1 class="text-4xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent">
          模型优化与微调
        </h1>
        <p class="text-lg text-neutral-400">
          对比分析模型性能，验证优化效果
        </p>
      </div>

      <!-- A/B Comparison -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <!-- Model A (Before) -->
        <AppCard variant="elevated">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold">基线模型 (v1.0)</h2>
                <p class="text-sm text-neutral-400">优化前</p>
              </div>
              <AppBadge variant="default">Baseline</AppBadge>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Key Metrics -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-lg bg-neutral-900/50">
                <div class="text-3xl font-bold text-neutral-300 mb-1">82.3%</div>
                <div class="text-sm text-neutral-500">准确率</div>
              </div>
              <div class="p-4 rounded-lg bg-neutral-900/50">
                <div class="text-3xl font-bold text-neutral-300 mb-1">1.8s</div>
                <div class="text-sm text-neutral-500">响应时间</div>
              </div>
              <div class="p-4 rounded-lg bg-neutral-900/50">
                <div class="text-3xl font-bold text-neutral-300 mb-1">76%</div>
                <div class="text-sm text-neutral-500">F1 Score</div>
              </div>
              <div class="p-4 rounded-lg bg-neutral-900/50">
                <div class="text-3xl font-bold text-neutral-300 mb-1">234MB</div>
                <div class="text-sm text-neutral-500">模型大小</div>
              </div>
            </div>

            <!-- Performance Chart -->
            <div>
              <div class="text-sm font-medium mb-3">各场景表现</div>
              <div class="space-y-3">
                <div v-for="(score, scenario) in baselineScores" :key="scenario">
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span>{{ scenario }}</span>
                    <span class="font-medium">{{ score }}%</span>
                  </div>
                  <AppProgress :value="score" :show-label="false" variant="default" />
                </div>
              </div>
            </div>
          </div>
        </AppCard>

        <!-- Model B (After) -->
        <AppCard variant="elevated">
          <template #header>
            <div class="flex items-center justify-between">
              <div>
                <h2 class="text-xl font-semibold">优化模型 (v2.0)</h2>
                <p class="text-sm text-neutral-400">优化后</p>
              </div>
              <AppBadge variant="success">Optimized</AppBadge>
            </div>
          </template>

          <div class="space-y-6">
            <!-- Key Metrics with Improvements -->
            <div class="grid grid-cols-2 gap-4">
              <div class="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div class="text-3xl font-bold text-green-400 mb-1">94.7%</div>
                <div class="text-sm text-green-500 flex items-center gap-1">
                  准确率 <span class="text-xs">↑ 12.4%</span>
                </div>
              </div>
              <div class="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div class="text-3xl font-bold text-green-400 mb-1">0.9s</div>
                <div class="text-sm text-green-500 flex items-center gap-1">
                  响应时间 <span class="text-xs">↓ 50%</span>
                </div>
              </div>
              <div class="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div class="text-3xl font-bold text-green-400 mb-1">91%</div>
                <div class="text-sm text-green-500 flex items-center gap-1">
                  F1 Score <span class="text-xs">↑ 15%</span>
                </div>
              </div>
              <div class="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <div class="text-3xl font-bold text-green-400 mb-1">187MB</div>
                <div class="text-sm text-green-500 flex items-center gap-1">
                  模型大小 <span class="text-xs">↓ 20%</span>
                </div>
              </div>
            </div>

            <!-- Performance Chart -->
            <div>
              <div class="text-sm font-medium mb-3">各场景表现</div>
              <div class="space-y-3">
                <div v-for="(score, scenario) in optimizedScores" :key="scenario">
                  <div class="flex items-center justify-between text-sm mb-1">
                    <span>{{ scenario }}</span>
                    <span class="font-medium text-green-400">{{ score }}%</span>
                  </div>
                  <AppProgress :value="score" :show-label="false" variant="success" />
                </div>
              </div>
            </div>
          </div>
        </AppCard>
      </div>

      <!-- Confusion Matrix -->
      <AppCard variant="elevated" class="mb-8">
        <template #header>
          <h2 class="text-xl font-semibold">混淆矩阵对比</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Baseline -->
          <div>
            <h3 class="text-sm font-medium text-neutral-400 mb-4 text-center">基线模型</h3>
            <div class="grid grid-cols-3 gap-2">
              <div class="text-center text-xs text-neutral-500"></div>
              <div class="text-center text-xs text-neutral-400 font-medium">预测: 正例</div>
              <div class="text-center text-xs text-neutral-400 font-medium">预测: 负例</div>
              
              <div class="text-xs text-neutral-400 font-medium flex items-center">真实: 正例</div>
              <div class="p-4 bg-green-500/20 text-green-400 text-center rounded font-bold">876</div>
              <div class="p-4 bg-red-500/20 text-red-400 text-center rounded font-bold">124</div>
              
              <div class="text-xs text-neutral-400 font-medium flex items-center">真实: 负例</div>
              <div class="p-4 bg-red-500/20 text-red-400 text-center rounded font-bold">156</div>
              <div class="p-4 bg-green-500/20 text-green-400 text-center rounded font-bold">844</div>
            </div>
          </div>

          <!-- Optimized -->
          <div>
            <h3 class="text-sm font-medium text-green-400 mb-4 text-center">优化模型</h3>
            <div class="grid grid-cols-3 gap-2">
              <div class="text-center text-xs text-neutral-500"></div>
              <div class="text-center text-xs text-neutral-400 font-medium">预测: 正例</div>
              <div class="text-center text-xs text-neutral-400 font-medium">预测: 负例</div>
              
              <div class="text-xs text-neutral-400 font-medium flex items-center">真实: 正例</div>
              <div class="p-4 bg-green-500/30 text-green-300 text-center rounded font-bold">967</div>
              <div class="p-4 bg-red-500/20 text-red-400 text-center rounded font-bold">33</div>
              
              <div class="text-xs text-neutral-400 font-medium flex items-center">真实: 负例</div>
              <div class="p-4 bg-red-500/20 text-red-400 text-center rounded font-bold">72</div>
              <div class="p-4 bg-green-500/30 text-green-300 text-center rounded font-bold">928</div>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- Test Cases -->
      <AppCard variant="elevated" class="mb-8">
        <template #header>
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-semibold">真实测试案例</h2>
            <div class="flex gap-2">
              <AppButton size="sm" variant="ghost" @click="playTestCase">
                ▶️ 播放案例
              </AppButton>
              <AppButton size="sm" variant="outline">
                查看全部 →
              </AppButton>
            </div>
          </div>
        </template>

        <div class="space-y-4">
          <div
            v-for="testCase in testCases"
            :key="testCase.id"
            class="p-4 rounded-lg bg-neutral-900/50 border border-neutral-800"
          >
            <div class="flex items-start gap-4">
              <div class="text-3xl">{{ testCase.icon }}</div>
              <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                  <h3 class="font-semibold">{{ testCase.title }}</h3>
                  <AppBadge
                    :variant="testCase.improved ? 'success' : 'warning'"
                    size="sm"
                  >
                    {{ testCase.improved ? '✓ 改进' : '⚠ 待优化' }}
                  </AppBadge>
                </div>
                <p class="text-sm text-neutral-400 mb-3">{{ testCase.description }}</p>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-xs text-neutral-500 mb-1">基线模型</div>
                    <div class="flex items-center gap-2">
                      <AppProgress :value="testCase.baseline.confidence" :show-label="false" class="flex-1" />
                      <span class="text-sm font-medium">{{ testCase.baseline.confidence }}%</span>
                    </div>
                    <div class="text-xs text-neutral-500 mt-1">
                      结果: {{ testCase.baseline.result }}
                    </div>
                  </div>
                  <div>
                    <div class="text-xs text-neutral-500 mb-1">优化模型</div>
                    <div class="flex items-center gap-2">
                      <AppProgress :value="testCase.optimized.confidence" :show-label="false" variant="success" class="flex-1" />
                      <span class="text-sm font-medium text-green-400">{{ testCase.optimized.confidence }}%</span>
                    </div>
                    <div class="text-xs text-green-400 mt-1">
                      结果: {{ testCase.optimized.result }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AppCard>

      <!-- Optimization Summary -->
      <AppCard variant="elevated">
        <template #header>
          <h2 class="text-xl font-semibold">优化总结</h2>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
            <div class="text-4xl mb-3">🎯</div>
            <h3 class="font-semibold mb-2">关键改进</h3>
            <ul class="space-y-2 text-sm text-neutral-300">
              <li>• 引入注意力机制</li>
              <li>• 数据增强策略</li>
              <li>• 模型剪枝优化</li>
              <li>• 量化加速推理</li>
            </ul>
          </div>

          <div class="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20">
            <div class="text-4xl mb-3">📊</div>
            <h3 class="font-semibold mb-2">性能提升</h3>
            <ul class="space-y-2 text-sm text-neutral-300">
              <li>• 准确率提升 12.4%</li>
              <li>• 响应速度提升 50%</li>
              <li>• F1 Score 提升 15%</li>
              <li>• 模型体积减小 20%</li>
            </ul>
          </div>

          <div class="p-6 rounded-lg bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
            <div class="text-4xl mb-3">💡</div>
            <h3 class="font-semibold mb-2">业务价值</h3>
            <ul class="space-y-2 text-sm text-neutral-300">
              <li>• 用户满意度预计提升 25%</li>
              <li>• 减少误判率 45%</li>
              <li>• 降低服务器成本 30%</li>
              <li>• 支持更大并发量</li>
            </ul>
          </div>
        </div>

        <template #footer>
          <div class="flex items-center justify-between">
            <span class="text-sm text-neutral-400">优化完成时间: 2024-10-07 14:30</span>
            <div class="flex gap-2">
              <AppButton variant="outline" size="sm">
                📥 下载模型
              </AppButton>
              <AppButton variant="primary" size="sm">
                🚀 部署到生产
              </AppButton>
            </div>
          </div>
        </template>
      </AppCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import AppProgress from '@/components/atoms/AppProgress.vue'

const baselineScores = ref({
  '安静环境': 89,
  '轻度噪音': 78,
  '车载环境': 71,
  '嘈杂环境': 65
})

const optimizedScores = ref({
  '安静环境': 97,
  '轻度噪音': 94,
  '车载环境': 89,
  '嘈杂环境': 86
})

const testCases = ref([
  {
    id: '1',
    title: '车载环境 - 语音唤醒测试',
    description: '在时速80km/h的高速路段，背景噪音包括发动机声、风噪和音乐',
    icon: '🚗',
    improved: true,
    baseline: {
      confidence: 71,
      result: '识别成功 (低置信度)'
    },
    optimized: {
      confidence: 94,
      result: '识别成功 (高置信度)'
    }
  },
  {
    id: '2',
    title: '嘈杂环境 - 指令理解测试',
    description: '商场环境，多人对话背景噪音约70dB',
    icon: '🏬',
    improved: true,
    baseline: {
      confidence: 62,
      result: '误识别'
    },
    optimized: {
      confidence: 88,
      result: '正确识别'
    }
  },
  {
    id: '3',
    title: '方言识别 - 四川话测试',
    description: '带有明显地方口音的语音指令',
    icon: '🗣️',
    improved: true,
    baseline: {
      confidence: 54,
      result: '识别失败'
    },
    optimized: {
      confidence: 82,
      result: '识别成功'
    }
  }
])

const playTestCase = () => {
  console.log('Playing test case...')
}
</script>
