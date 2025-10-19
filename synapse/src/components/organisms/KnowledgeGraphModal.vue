<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        @click.self="close"
      >
        <div class="relative w-full max-w-7xl h-[90vh] bg-gradient-to-br from-neutral-900 via-neutral-900 to-purple-900/20 rounded-2xl shadow-2xl border border-neutral-800 flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between px-6 py-4 border-b border-neutral-800">
            <div>
              <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                知识图谱
              </h2>
              <p class="text-sm text-neutral-400 mt-1">
                实体关系可视化 - {{ graphData.statistics.totalNodes }} 个节点 · {{ graphData.statistics.totalEdges }} 条关系
              </p>
            </div>
            <button
              @click="close"
              class="w-10 h-10 rounded-lg bg-neutral-800/50 hover:bg-neutral-700/50 text-neutral-400 hover:text-white transition-all flex items-center justify-center"
            >
              <span class="text-2xl">×</span>
            </button>
          </div>

          <!-- Controls -->
          <div class="flex items-center gap-4 px-6 py-3 border-b border-neutral-800 bg-neutral-900/50">
            <div class="flex items-center gap-2">
              <button
                @click="resetView"
                class="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all"
              >
                🔄 重置视图
              </button>
              <button
                @click="togglePhysics"
                class="px-3 py-1.5 text-xs font-medium rounded-lg transition-all"
                :class="physicsEnabled 
                  ? 'bg-primary-500 text-white' 
                  : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'"
              >
                {{ physicsEnabled ? '⏸️ 暂停动画' : '▶️ 启动动画' }}
              </button>
            </div>

            <!-- Filter by Type -->
            <div class="flex items-center gap-2 flex-1">
              <span class="text-xs text-neutral-400">筛选类型:</span>
              <button
                v-for="type in nodeTypes"
                :key="type.value"
                @click="toggleTypeFilter(type.value)"
                class="px-2 py-1 text-xs font-medium rounded transition-all"
                :class="selectedTypes.includes(type.value)
                  ? 'text-white shadow-lg'
                  : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50'"
                :style="selectedTypes.includes(type.value) ? { backgroundColor: type.color } : {}"
              >
                {{ type.label }}
              </button>
            </div>

            <!-- Relationship Type Filter -->
            <div class="flex items-center gap-2">
              <span class="text-xs text-neutral-400">关系:</span>
              <div class="flex items-center gap-2 text-xs">
                <button
                  @click="toggleEdgeTypeFilter('depends_on')"
                  class="px-2 py-1 rounded transition-all flex items-center gap-1"
                  :class="selectedEdgeTypes.includes('depends_on')
                    ? 'bg-primary-500 text-white shadow-lg'
                    : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50'"
                >
                  <div class="w-3 h-0.5 bg-current"></div>
                  <span>依赖</span>
                </button>
                <button
                  @click="toggleEdgeTypeFilter('solves')"
                  class="px-2 py-1 rounded transition-all flex items-center gap-1"
                  :class="selectedEdgeTypes.includes('solves')
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50'"
                >
                  <div class="w-3 h-0.5 bg-current"></div>
                  <span>解决</span>
                </button>
                <button
                  @click="toggleEdgeTypeFilter('causes')"
                  class="px-2 py-1 rounded transition-all flex items-center gap-1"
                  :class="selectedEdgeTypes.includes('causes')
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-neutral-800/50 text-neutral-400 hover:bg-neutral-700/50'"
                >
                  <div class="w-3 h-0.5 bg-current"></div>
                  <span>影响</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Graph Canvas -->
          <div class="flex-1 relative overflow-hidden">
            <div
              ref="graphContainer"
              class="w-full h-full cursor-grab active:cursor-grabbing"
              @mousedown="startPan"
              @mousemove="pan"
              @mouseup="endPan"
              @mouseleave="endPan"
              @wheel="zoom"
            >
              <svg
                class="w-full h-full"
                :viewBox="`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`"
              >
                <defs>
                  <!-- Arrow markers for directed edges -->
                  <!-- 依赖 - 蓝色 -->
                  <marker
                    id="arrow-6366f1"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M0,0 L0,12 L12,6 z" fill="#6366f1" />
                  </marker>
                  
                  <!-- 解决 - 绿色 -->
                  <marker
                    id="arrow-10b981"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M0,0 L0,12 L12,6 z" fill="#10b981" />
                  </marker>
                  
                  <!-- 影响 - 红色 -->
                  <marker
                    id="arrow-ef4444"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M0,0 L0,12 L12,6 z" fill="#ef4444" />
                  </marker>
                  
                  <!-- 实现 - 紫色 -->
                  <marker
                    id="arrow-8b5cf6"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M0,0 L0,12 L12,6 z" fill="#8b5cf6" />
                  </marker>
                  
                  <!-- 相关 - 灰色 -->
                  <marker
                    id="arrow-94a3b8"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M0,0 L0,12 L12,6 z" fill="#94a3b8" />
                  </marker>
                  
                  <!-- 竞争 - 橙色 -->
                  <marker
                    id="arrow-f59e0b"
                    markerWidth="12"
                    markerHeight="12"
                    refX="10"
                    refY="6"
                    orient="auto"
                    markerUnits="userSpaceOnUse"
                  >
                    <path d="M0,0 L0,12 L12,6 z" fill="#f59e0b" />
                  </marker>
                  
                  <!-- Glow effect -->
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>

                <!-- Edges -->
                <g class="edges">
                  <g
                    v-for="edge in visibleEdges"
                    :key="edge.id"
                    class="edge-group"
                  >
                    <line
                      :x1="getEdgePoints(edge).x1"
                      :y1="getEdgePoints(edge).y1"
                      :x2="getEdgePoints(edge).x2"
                      :y2="getEdgePoints(edge).y2"
                      :stroke="getEdgeColor(edge)"
                      :stroke-width="(edge.weight || 1) * 3"
                      stroke-opacity="0.9"
                      :marker-end="`url(#arrow-${getEdgeColor(edge).replace('#', '')})`"
                      class="transition-all duration-300"
                    />
                    <!-- Edge label -->
                    <text
                      :x="(getNodePosition(edge.source).x + getNodePosition(edge.target).x) / 2"
                      :y="(getNodePosition(edge.source).y + getNodePosition(edge.target).y) / 2"
                      class="text-xs fill-white pointer-events-none select-none"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      opacity="0.8"
                    >
                      {{ edge.label }}
                    </text>
                  </g>
                </g>

                <!-- Nodes -->
                <g class="nodes">
                  <g
                    v-for="node in visibleNodes"
                    :key="node.id"
                    class="node-group cursor-pointer transition-all duration-300"
                    :class="{ 'opacity-100': selectedNode?.id === node.id, 'opacity-80 hover:opacity-100': selectedNode?.id !== node.id }"
                    @click="selectNode(node)"
                    @mouseenter="hoverNode = node"
                    @mouseleave="hoverNode = null"
                  >
                    <!-- Node circle -->
                    <circle
                      :cx="node.x"
                      :cy="node.y"
                      :r="node.size / 2"
                      :fill="node.color"
                      :class="{ 'filter-glow': selectedNode?.id === node.id || hoverNode?.id === node.id }"
                      :filter="selectedNode?.id === node.id ? 'url(#glow)' : ''"
                      stroke="white"
                      :stroke-width="selectedNode?.id === node.id ? 3 : 1"
                      stroke-opacity="0.5"
                    />
                    
                    <!-- Node label -->
                    <text
                      :x="node.x"
                      :y="node.y + node.size / 2 + 12"
                      class="text-xs fill-white font-medium pointer-events-none select-none"
                      text-anchor="middle"
                      dominant-baseline="hanging"
                    >
                      {{ node.label }}
                    </text>
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <!-- Node Details Panel -->
          <Transition name="slide-up">
            <div
              v-if="selectedNode"
              class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-neutral-900 to-neutral-900/95 border-t border-neutral-800 p-6 backdrop-blur-sm"
            >
              <div class="flex items-start justify-between gap-6">
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <div
                      class="w-3 h-3 rounded-full"
                      :style="{ backgroundColor: selectedNode.color }"
                    ></div>
                    <h3 class="text-lg font-semibold text-white">{{ selectedNode.label }}</h3>
                    <span class="px-2 py-0.5 text-xs rounded bg-neutral-800 text-neutral-300">
                      {{ getNodeTypeLabel(selectedNode.type) }}
                    </span>
                  </div>
                  <p class="text-sm text-neutral-400 mb-4">{{ selectedNode.description }}</p>
                  
                  <div class="grid grid-cols-3 gap-4">
                    <div>
                      <div class="text-xs text-neutral-500 mb-1">连接数</div>
                      <div class="text-lg font-semibold text-primary-400">
                        {{ getNodeConnections(selectedNode.id) }}
                      </div>
                    </div>
                    <div v-if="selectedNode.metadata">
                      <div class="text-xs text-neutral-500 mb-1">附加信息</div>
                      <div class="text-sm text-neutral-300">
                        {{ Object.entries(selectedNode.metadata).map(([k, v]) => `${k}: ${v}`).join(', ') }}
                      </div>
                    </div>
                  </div>
                </div>
                
                <button
                  @click="selectedNode = null"
                  class="px-3 py-1.5 text-sm rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-all"
                >
                  关闭
                </button>
              </div>
            </div>
          </Transition>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { KnowledgeGraphData, KnowledgeGraphNode, KnowledgeGraphEdge } from '@/api/mock/mockData'

interface Props {
  modelValue: boolean
  graphData: KnowledgeGraphData
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Node types configuration
const nodeTypes = [
  { value: 'product', label: '产品', color: '#6366f1' },
  { value: 'feature', label: '功能', color: '#8b5cf6' },
  { value: 'technology', label: '技术', color: '#14b8a6' },
  { value: 'problem', label: '问题', color: '#ef4444' },
  { value: 'solution', label: '解决方案', color: '#10b981' },
  { value: 'company', label: '公司', color: '#ec4899' },
  { value: 'person', label: '人物', color: '#f59e0b' }
]

// State
const selectedTypes = ref<string[]>(nodeTypes.map(t => t.value))
const selectedEdgeTypes = ref<string[]>(['depends_on', 'solves', 'causes', 'implements', 'related_to', 'competes_with'])
const selectedNode = ref<KnowledgeGraphNode | null>(null)
const hoverNode = ref<KnowledgeGraphNode | null>(null)
const physicsEnabled = ref(false) // 默认关闭物理引擎，减少性能问题

// View state
const viewBox = ref({ x: -400, y: -300, width: 800, height: 600 })
const isPanning = ref(false)
const lastMousePos = ref({ x: 0, y: 0 })
const graphContainer = ref<HTMLElement | null>(null)

// Initialize node positions
const nodesWithPositions = ref<KnowledgeGraphNode[]>([])

const initializePositions = () => {
  const centerX = 0
  const centerY = 0
  const radius = 200

  nodesWithPositions.value = props.graphData.nodes.map((node, index) => {
    const angle = (index / props.graphData.nodes.length) * 2 * Math.PI
    return {
      ...node,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    }
  })
}

// Computed
const visibleNodes = computed(() => {
  return nodesWithPositions.value.filter(node => selectedTypes.value.includes(node.type))
})

const visibleEdges = computed(() => {
  const visibleNodeIds = new Set(visibleNodes.value.map(n => n.id))
  return props.graphData.edges.filter(
    edge => visibleNodeIds.has(edge.source) && 
            visibleNodeIds.has(edge.target) &&
            selectedEdgeTypes.value.includes(edge.type)
  )
})

const getNodePosition = (nodeId: string) => {
  const node = nodesWithPositions.value.find(n => n.id === nodeId)
  return node ? { x: node.x || 0, y: node.y || 0 } : { x: 0, y: 0 }
}

// 计算线条的起点和终点，确保不被节点遮挡
const getEdgePoints = (edge: KnowledgeGraphEdge) => {
  const sourceNode = nodesWithPositions.value.find(n => n.id === edge.source)
  const targetNode = nodesWithPositions.value.find(n => n.id === edge.target)
  
  if (!sourceNode || !targetNode) {
    return { x1: 0, y1: 0, x2: 0, y2: 0 }
  }
  
  const sx = sourceNode.x || 0
  const sy = sourceNode.y || 0
  const tx = targetNode.x || 0
  const ty = targetNode.y || 0
  
  // 计算方向向量
  const dx = tx - sx
  const dy = ty - sy
  const distance = Math.sqrt(dx * dx + dy * dy) || 1
  
  // 单位向量
  const ux = dx / distance
  const uy = dy / distance
  
  // 从节点边缘开始，留出节点半径的空间
  const sourceRadius = (sourceNode.size || 40) / 2 + 2
  const targetRadius = (targetNode.size || 40) / 2 + 12 // 多留一些空间给箭头
  
  return {
    x1: sx + ux * sourceRadius,
    y1: sy + uy * sourceRadius,
    x2: tx - ux * targetRadius,
    y2: ty - uy * targetRadius
  }
}

const getNodeConnections = (nodeId: string) => {
  return props.graphData.edges.filter(
    edge => edge.source === nodeId || edge.target === nodeId
  ).length
}

const getNodeTypeLabel = (type: string) => {
  return nodeTypes.find(t => t.value === type)?.label || type
}

// Methods
const close = () => {
  emit('update:modelValue', false)
}

const toggleTypeFilter = (type: string) => {
  const index = selectedTypes.value.indexOf(type)
  if (index > -1) {
    selectedTypes.value.splice(index, 1)
  } else {
    selectedTypes.value.push(type)
  }
}

const toggleEdgeTypeFilter = (edgeType: string) => {
  const index = selectedEdgeTypes.value.indexOf(edgeType)
  if (index > -1) {
    selectedEdgeTypes.value.splice(index, 1)
  } else {
    selectedEdgeTypes.value.push(edgeType)
  }
}

// 根据边类型获取颜色
const getEdgeColor = (edge: KnowledgeGraphEdge) => {
  const typeColorMap: Record<string, string> = {
    'depends_on': '#6366f1',    // 蓝色 - 依赖
    'solves': '#10b981',         // 绿色 - 解决
    'causes': '#ef4444',         // 红色 - 影响/导致
    'implements': '#8b5cf6',     // 紫色 - 实现
    'related_to': '#94a3b8',     // 灰色 - 相关
    'competes_with': '#f59e0b',  // 橙色 - 竞争
    'mentions': '#94a3b8'        // 灰色 - 提及
  }
  return edge.color || typeColorMap[edge.type] || '#94a3b8'
}

// 根据边类型获取标签
const getEdgeTypeLabel = (type: string) => {
  const labelMap: Record<string, string> = {
    'depends_on': '依赖',
    'solves': '解决',
    'causes': '影响',
    'implements': '实现',
    'related_to': '相关',
    'competes_with': '竞争',
    'mentions': '提及'
  }
  return labelMap[type] || type
}

const selectNode = (node: KnowledgeGraphNode) => {
  selectedNode.value = selectedNode.value?.id === node.id ? null : node
}

const resetView = () => {
  viewBox.value = { x: -400, y: -300, width: 800, height: 600 }
  initializePositions()
  // 重置稳定性计数器
  stabilityCounter = 0
}

const togglePhysics = () => {
  physicsEnabled.value = !physicsEnabled.value
  
  if (physicsEnabled.value) {
    // 启动物理引擎时，重置稳定性计数器并重新启动动画
    stabilityCounter = 0
    if (!animationFrameId) {
      lastFrameTime = performance.now()
      animate(lastFrameTime)
    }
  }
}

// Pan and zoom
const startPan = (e: MouseEvent) => {
  isPanning.value = true
  lastMousePos.value = { x: e.clientX, y: e.clientY }
}

const pan = (e: MouseEvent) => {
  if (!isPanning.value) return
  
  const dx = (e.clientX - lastMousePos.value.x) * (viewBox.value.width / (graphContainer.value?.clientWidth || 1))
  const dy = (e.clientY - lastMousePos.value.y) * (viewBox.value.height / (graphContainer.value?.clientHeight || 1))
  
  viewBox.value.x -= dx
  viewBox.value.y -= dy
  
  lastMousePos.value = { x: e.clientX, y: e.clientY }
}

const endPan = () => {
  isPanning.value = false
}

const zoom = (e: WheelEvent) => {
  e.preventDefault()
  const scale = e.deltaY > 0 ? 1.1 : 0.9
  const newWidth = viewBox.value.width * scale
  const newHeight = viewBox.value.height * scale
  
  viewBox.value.x -= (newWidth - viewBox.value.width) / 2
  viewBox.value.y -= (newHeight - viewBox.value.height) / 2
  viewBox.value.width = newWidth
  viewBox.value.height = newHeight
}

// Physics simulation
let animationFrameId: number | null = null
let lastFrameTime = 0
const targetFPS = 30 // 限制帧率，减少CPU占用
const frameInterval = 1000 / targetFPS

// 稳定性检测
let stabilityCounter = 0
const stabilityThreshold = 50 // 连续50帧稳定后停止
const movementThreshold = 0.1 // 移动小于此值认为稳定

const applyForces = () => {
  if (!physicsEnabled.value) return

  const nodes = nodesWithPositions.value
  const edges = props.graphData.edges

  // Force parameters
  const repulsionStrength = 1000
  const attractionStrength = 0.01
  const damping = 0.9
  const centeringStrength = 0.001

  let totalMovement = 0

  nodes.forEach(node => {
    let fx = 0
    let fy = 0

    // Repulsion between all nodes
    nodes.forEach(other => {
      if (node.id === other.id) return
      const dx = (node.x || 0) - (other.x || 0)
      const dy = (node.y || 0) - (other.y || 0)
      const distance = Math.sqrt(dx * dx + dy * dy) || 1
      const force = repulsionStrength / (distance * distance)
      fx += (dx / distance) * force
      fy += (dy / distance) * force
    })

    // Attraction along edges
    edges.forEach(edge => {
      if (edge.source === node.id) {
        const target = nodes.find(n => n.id === edge.target)
        if (target) {
          const dx = (target.x || 0) - (node.x || 0)
          const dy = (target.y || 0) - (node.y || 0)
          fx += dx * attractionStrength * (edge.weight || 1)
          fy += dy * attractionStrength * (edge.weight || 1)
        }
      } else if (edge.target === node.id) {
        const source = nodes.find(n => n.id === edge.source)
        if (source) {
          const dx = (source.x || 0) - (node.x || 0)
          const dy = (source.y || 0) - (node.y || 0)
          fx += dx * attractionStrength * (edge.weight || 1)
          fy += dy * attractionStrength * (edge.weight || 1)
        }
      }
    })

    // Centering force
    fx -= (node.x || 0) * centeringStrength
    fy -= (node.y || 0) * centeringStrength

    // 保存旧位置
    const oldX = node.x || 0
    const oldY = node.y || 0

    // Update position
    node.x = ((node.x || 0) + fx) * damping
    node.y = ((node.y || 0) + fy) * damping

    // 计算移动距离
    const movement = Math.sqrt((node.x - oldX) ** 2 + (node.y - oldY) ** 2)
    totalMovement += movement
  })

  // 检测稳定性
  if (totalMovement < movementThreshold) {
    stabilityCounter++
    if (stabilityCounter > stabilityThreshold) {
      // 系统已稳定，自动暂停物理引擎
      physicsEnabled.value = false
      console.log('知识图谱已稳定，自动停止物理模拟')
    }
  } else {
    stabilityCounter = 0
  }
}

const animate = (currentTime: number) => {
  if (!physicsEnabled.value) {
    // 物理引擎关闭时，停止动画循环
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
    return
  }

  // 帧率限制
  const elapsed = currentTime - lastFrameTime
  if (elapsed > frameInterval) {
    applyForces()
    lastFrameTime = currentTime - (elapsed % frameInterval)
  }

  animationFrameId = requestAnimationFrame(animate)
}

// Lifecycle
onMounted(() => {
  initializePositions()
  // 默认不启动物理模拟，避免死机
  // 用户可以手动点击"启动动画"按钮
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
})

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    initializePositions()
    // 重置稳定性计数器
    stabilityCounter = 0
  } else {
    // 关闭模态框时停止动画
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
      animationFrameId = null
    }
  }
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.filter-glow {
  filter: drop-shadow(0 0 8px currentColor);
}

.edge-group:hover line {
  stroke-opacity: 1 !important;
  stroke-width: 6 !important;
}

.edge-group:hover text {
  opacity: 1 !important;
  font-weight: 600;
}

.node-group:hover circle {
  stroke-width: 2;
}
</style>

