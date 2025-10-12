<template>
  <AppCard variant="elevated">
    <template #header>
      <div>
        <h2 class="text-xl font-semibold mb-1">🏗️ 技术架构总览</h2>
        <p class="text-sm text-neutral-400">端到端的数据处理流水线</p>
      </div>
    </template>

    <div class="space-y-6">
      <!-- 流程图 -->
      <div class="relative bg-neutral-900/50 rounded-lg p-8 overflow-x-auto">
        <div class="flex items-center justify-between min-w-[900px]">
          <!-- 1. 数据源 -->
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-2 border-blue-500/50 flex items-center justify-center text-3xl mb-3 transition-all hover:scale-105">
              📁
            </div>
            <h3 class="font-semibold text-sm mb-1">数据源</h3>
            <div class="text-xs text-neutral-400 text-center space-y-1">
              <div>📄 文档</div>
              <div>🖼️ 图片</div>
              <div>🎵 音频</div>
              <div>🎬 视频</div>
            </div>
          </div>

          <div class="flex-1 flex items-center justify-center">
            <div class="h-0.5 w-full bg-gradient-to-r from-blue-500/50 to-purple-500/50 relative">
              <div class="absolute right-0 top-1/2 -translate-y-1/2">
                <div class="w-2 h-2 rotate-45 bg-purple-500"></div>
              </div>
            </div>
          </div>

          <!-- 2. Ray分布式处理 -->
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-2 border-purple-500/50 flex items-center justify-center text-3xl mb-3 transition-all hover:scale-105">
              ⚡
            </div>
            <h3 class="font-semibold text-sm mb-1">Ray集群</h3>
            <div class="text-xs text-neutral-400 text-center space-y-1">
              <div>分布式处理</div>
              <div>特征提取</div>
              <div>并行计算</div>
            </div>
          </div>

          <div class="flex-1 flex items-center justify-center">
            <div class="h-0.5 w-full bg-gradient-to-r from-purple-500/50 to-pink-500/50 relative">
              <div class="absolute right-0 top-1/2 -translate-y-1/2">
                <div class="w-2 h-2 rotate-45 bg-pink-500"></div>
              </div>
            </div>
          </div>

          <!-- 3. 特征向量 -->
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/20 border-2 border-pink-500/50 flex items-center justify-center text-3xl mb-3 transition-all hover:scale-105">
              🧬
            </div>
            <h3 class="font-semibold text-sm mb-1">特征向量</h3>
            <div class="text-xs text-neutral-400 text-center space-y-1">
              <div>768维向量</div>
              <div>语义表示</div>
              <div>可搜索</div>
            </div>
          </div>

          <div class="flex-1 flex items-center justify-center">
            <div class="h-0.5 w-full bg-gradient-to-r from-pink-500/50 to-green-500/50 relative">
              <div class="absolute right-0 top-1/2 -translate-y-1/2">
                <div class="w-2 h-2 rotate-45 bg-green-500"></div>
              </div>
            </div>
          </div>

          <!-- 4. 向量数据库 -->
          <div class="flex flex-col items-center">
            <div class="w-24 h-24 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border-2 border-green-500/50 flex items-center justify-center text-3xl mb-3 transition-all hover:scale-105">
              🗄️
            </div>
            <h3 class="font-semibold text-sm mb-1">向量数据库</h3>
            <div class="text-xs text-neutral-400 text-center space-y-1">
              <div>Milvus/Qdrant</div>
              <div>HNSW索引</div>
              <div>相似度检索</div>
            </div>
          </div>
        </div>

        <!-- 双向箭头 - 原始数据关联 -->
        <div class="mt-8 flex items-center justify-center">
          <div class="flex items-center gap-2 text-xs text-neutral-400">
            <span>💾 原始数据存储 (S3/OSS)</span>
            <span class="text-secondary-400">↔</span>
            <span>🔗 元数据关联</span>
            <span class="text-secondary-400">↔</span>
            <span>🔍 统一检索接口</span>
          </div>
        </div>
      </div>

      <!-- 关键技术点 -->
      <div class="grid grid-cols-3 gap-4">
        <div class="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">🚀</span>
            <h4 class="font-semibold text-sm">高性能处理</h4>
          </div>
          <p class="text-xs text-neutral-400">
            Ray分布式计算框架，自动负载均衡，支持GPU加速，处理速度提升10-100倍
          </p>
        </div>

        <div class="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">🔄</span>
            <h4 class="font-semibold text-sm">实时同步</h4>
          </div>
          <p class="text-xs text-neutral-400">
            原始数据和特征向量通过asset_id关联，保证数据一致性，支持增量更新
          </p>
        </div>

        <div class="p-4 rounded-lg bg-neutral-900/30 border border-neutral-800">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">🎯</span>
            <h4 class="font-semibold text-sm">混合检索</h4>
          </div>
          <p class="text-xs text-neutral-400">
            向量相似度检索 + 元数据过滤 + 全文搜索，实现精准的多模态内容发现
          </p>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/atoms/AppCard.vue'
</script>

