<template>
  <AppCard variant="elevated">
    <template #header>
      <div>
        <h2 class="text-xl font-semibold mb-1">🗄️ 向量数据库存储架构</h2>
        <p class="text-sm text-neutral-400">原始数据 + 特征向量 + 元数据的协同存储方案</p>
      </div>
    </template>

    <div class="space-y-6">
      <!-- 存储架构图 -->
      <div class="bg-neutral-900/50 rounded-lg p-6 border border-neutral-800">
        <h3 class="text-sm font-semibold mb-4 flex items-center gap-2">
          <span>🏗️</span>
          <span>三层存储架构</span>
        </h3>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- 1. 对象存储 -->
          <div class="relative">
            <div class="bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg p-4 border-2 border-blue-500/50">
              <div class="text-3xl mb-2">📦</div>
              <h4 class="font-semibold mb-2">对象存储层</h4>
              <div class="text-xs text-neutral-300 space-y-1 mb-3">
                <div>• S3 / OSS / MinIO</div>
                <div>• 存储原始文件</div>
                <div>• 支持大文件</div>
                <div>• 按需加载</div>
              </div>
              <AppBadge size="sm" variant="info">原始数据</AppBadge>
            </div>
          </div>

          <!-- 2. 向量数据库 -->
          <div class="relative">
            <div class="bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg p-4 border-2 border-purple-500/50">
              <div class="text-3xl mb-2">🧬</div>
              <h4 class="font-semibold mb-2">向量数据库层</h4>
              <div class="text-xs text-neutral-300 space-y-1 mb-3">
                <div>• Milvus / Qdrant</div>
                <div>• 存储特征向量</div>
                <div>• HNSW索引</div>
                <div>• 快速相似搜索</div>
              </div>
              <AppBadge size="sm" variant="info">特征向量</AppBadge>
            </div>
          </div>

          <!-- 3. 元数据数据库 -->
          <div class="relative">
            <div class="bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-lg p-4 border-2 border-green-500/50">
              <div class="text-3xl mb-2">📊</div>
              <h4 class="font-semibold mb-2">元数据数据库层</h4>
              <div class="text-xs text-neutral-300 space-y-1 mb-3">
                <div>• PostgreSQL/Mysql(Gravitino)</div>
                <div>• 存储业务信息</div>
                <div>• 关系型查询</div>
                <div>• 事务支持</div>
              </div>
              <AppBadge size="sm" variant="info">结构化数据</AppBadge>
            </div>
          </div>
        </div>

        <!-- 关联关系 -->
        <div class="mt-6 bg-neutral-950/50 rounded-lg p-4">
          <div class="flex items-center justify-center gap-3 text-xs">
            <span class="text-neutral-400">通过</span>
            <code class="px-2 py-1 bg-primary-500/20 rounded text-primary-400 font-mono">asset_id</code>
            <span class="text-neutral-400">关联三层数据</span>
            <span class="text-secondary-400">→</span>
            <span class="text-neutral-300">保证数据一致性</span>
          </div>
        </div>
      </div>

      <!-- 数据结构示例 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 向量数据库记录 -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>🧬</span>
            <span>向量数据库记录 (Milvus)</span>
          </h4>
          <pre class="bg-neutral-950 rounded p-3 overflow-x-auto"><code class="text-xs text-neutral-300 font-mono">{
  "id": "vec_001234",
  "asset_id": "asset_abc123",
  "vector": [
    0.0234, -0.1234, 0.5678, ...  // 768维
  ],
  "modality": "document",
  "model": "bert-base-chinese",
  "created_at": "2025-10-07T10:30:00Z"
}</code></pre>
          <div class="mt-3 flex gap-2">
            <AppBadge size="sm" variant="primary">HNSW索引</AppBadge>
            <AppBadge size="sm" variant="primary">余弦距离</AppBadge>
          </div>
        </div>

        <!-- 元数据库记录 -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>📊</span>
            <span>元数据库记录 (PostgreSQL)</span>
          </h4>
          <pre class="bg-neutral-950 rounded p-3 overflow-x-auto"><code class="text-xs text-neutral-300 font-mono">{
  "asset_id": "asset_abc123",
  "filename": "产品需求文档.pdf",
  "type": "document",
  "size": 2457600,
  "s3_url": "s3://bucket/files/abc123.pdf",
  "tags": ["需求", "产品", "设计"],
  "entities": [
    {"name": "AI技术", "type": "技术"},
    {"name": "多模态", "type": "概念"}
  ],
  "uploaded_by": "user_001",
  "uploaded_at": "2025-10-07T10:30:00Z"
}</code></pre>
          <div class="mt-3 flex gap-2">
            <AppBadge size="sm" variant="success">B-Tree索引</AppBadge>
            <AppBadge size="sm" variant="success">全文搜索</AppBadge>
          </div>
        </div>
      </div>

      <!-- 混合检索流程 -->
      <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
        <h4 class="text-sm font-semibold mb-4 flex items-center gap-2">
          <span>🔍</span>
          <span>混合检索流程 - 向量相似度 + 元数据过滤</span>
        </h4>
        
        <div class="space-y-3">
          <!-- 步骤1 -->
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center text-xs font-semibold">
              1
            </div>
            <div class="flex-1 bg-neutral-950/50 rounded-lg p-3">
              <div class="font-medium text-sm mb-2">用户查询</div>
              <div class="bg-neutral-900 rounded px-3 py-2 text-xs font-mono text-neutral-300">
                "找一下关于AI技术的产品文档，最近一个月上传的"
              </div>
            </div>
          </div>

          <!-- 步骤2 -->
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-xs font-semibold">
              2
            </div>
            <div class="flex-1 bg-neutral-950/50 rounded-lg p-3">
              <div class="font-medium text-sm mb-2">查询向量化</div>
              <div class="bg-neutral-900 rounded px-3 py-2 text-xs font-mono text-neutral-300">
                query_vector = embed("AI技术的产品文档")<br/>
                # 生成768维查询向量
              </div>
            </div>
          </div>

          <!-- 步骤3 -->
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center text-xs font-semibold">
              3
            </div>
            <div class="flex-1 bg-neutral-950/50 rounded-lg p-3">
              <div class="font-medium text-sm mb-2">向量相似度搜索</div>
              <div class="bg-neutral-900 rounded px-3 py-2 text-xs font-mono text-neutral-300">
                results = milvus.search(<br/>
                &nbsp;&nbsp;vector=query_vector,<br/>
                &nbsp;&nbsp;top_k=100,  # 召回前100个<br/>
                &nbsp;&nbsp;metric="cosine"<br/>
                )
              </div>
            </div>
          </div>

          <!-- 步骤4 -->
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-semibold">
              4
            </div>
            <div class="flex-1 bg-neutral-950/50 rounded-lg p-3">
              <div class="font-medium text-sm mb-2">元数据过滤</div>
              <div class="bg-neutral-900 rounded px-3 py-2 text-xs font-mono text-neutral-300">
                filtered = postgres.filter(<br/>
                &nbsp;&nbsp;asset_ids=[r.asset_id for r in results],<br/>
                &nbsp;&nbsp;type="document",<br/>
                &nbsp;&nbsp;uploaded_at > now() - 30days<br/>
                )
              </div>
            </div>
          </div>

          <!-- 步骤5 -->
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-semibold">
              5
            </div>
            <div class="flex-1 bg-neutral-950/50 rounded-lg p-3">
              <div class="font-medium text-sm mb-2">结果合并返回</div>
              <div class="bg-neutral-900 rounded px-3 py-2 text-xs text-neutral-300">
                <div class="space-y-2">
                  <div class="flex items-center justify-between">
                    <span>📄 产品需求文档_v2.pdf</span>
                    <AppBadge size="sm" variant="success">相似度: 0.95</AppBadge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>📄 AI功能设计方案.docx</span>
                    <AppBadge size="sm" variant="success">相似度: 0.89</AppBadge>
                  </div>
                  <div class="flex items-center justify-between">
                    <span>📄 技术架构说明.pdf</span>
                    <AppBadge size="sm" variant="success">相似度: 0.87</AppBadge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 性能优化 -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-gradient-to-br from-primary-500/10 to-primary-600/10 rounded-lg p-4 border border-primary-500/20">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">⚡</span>
            <h4 class="font-semibold text-sm">索引优化</h4>
          </div>
          <ul class="space-y-1.5 text-xs text-neutral-300">
            <li>• HNSW图索引，检索<10ms</li>
            <li>• IVF_FLAT预过滤</li>
            <li>• 分区存储，按时间/类型</li>
            <li>• 定期索引重建</li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-secondary-500/10 to-secondary-600/10 rounded-lg p-4 border border-secondary-500/20">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">💾</span>
            <h4 class="font-semibold text-sm">缓存策略</h4>
          </div>
          <ul class="space-y-1.5 text-xs text-neutral-300">
            <li>• Redis缓存热门查询</li>
            <li>• 向量结果缓存1小时</li>
            <li>• 元数据缓存24小时</li>
            <li>• LRU淘汰策略</li>
          </ul>
        </div>

        <div class="bg-gradient-to-br from-accent-500/10 to-accent-600/10 rounded-lg p-4 border border-accent-500/20">
          <div class="flex items-center gap-2 mb-3">
            <span class="text-2xl">🔄</span>
            <h4 class="font-semibold text-sm">数据同步</h4>
          </div>
          <ul class="space-y-1.5 text-xs text-neutral-300">
            <li>• 事件驱动更新</li>
            <li>• 最终一致性保证</li>
            <li>• 批量写入优化</li>
            <li>• 定期一致性检查</li>
          </ul>
        </div>
      </div>

      <!-- 技术栈 -->
      <div class="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
        <div class="flex items-start gap-3">
          <div class="text-2xl">🛠️</div>
          <div class="flex-1">
            <h4 class="font-semibold text-sm mb-3">完整技术栈</h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <div class="text-xs text-neutral-400 mb-1">向量数据库</div>
                <AppBadge size="sm">Milvus 2.3</AppBadge>
              </div>
              <div>
                <div class="text-xs text-neutral-400 mb-1">元数据库</div>
                <AppBadge size="sm">PostgreSQL 15</AppBadge>
              </div>
              <div>
                <div class="text-xs text-neutral-400 mb-1">对象存储</div>
                <AppBadge size="sm">MinIO / S3</AppBadge>
              </div>
              <div>
                <div class="text-xs text-neutral-400 mb-1">缓存</div>
                <AppBadge size="sm">Redis 7</AppBadge>
              </div>
              <div>
                <div class="text-xs text-neutral-400 mb-1">消息队列</div>
                <AppBadge size="sm">Kafka</AppBadge>
              </div>
              <div>
                <div class="text-xs text-neutral-400 mb-1">任务调度</div>
                <AppBadge size="sm">Celery</AppBadge>
              </div>
              <div>
                <div class="text-xs text-neutral-400 mb-1">分布式计算</div>
                <AppBadge size="sm">Ray 2.7</AppBadge>
              </div>
              <div>
                <div class="text-xs text-neutral-400 mb-1">监控</div>
                <AppBadge size="sm">Prometheus</AppBadge>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import AppCard from '@/components/atoms/AppCard.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
</script>

