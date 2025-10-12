<template>
  <AppCard variant="elevated">
    <template #header>
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-xl font-semibold mb-1">🌌 向量空间可视化</h2>
          <p class="text-sm text-neutral-400">3D空间中的特征向量分布 - 相似内容聚集在一起</p>
        </div>
        <div class="flex gap-2">
          <AppButton size="sm" variant="ghost" @click="rotateView">
            🔄 旋转
          </AppButton>
          <AppButton size="sm" variant="ghost" @click="resetView">
            🎯 重置
          </AppButton>
          <AppButton size="sm" variant="ghost" @click="toggleClusters">
            {{ showClusters ? '隐藏' : '显示' }}聚类
          </AppButton>
        </div>
      </div>
    </template>

    <div class="space-y-4">
      <!-- 3D可视化区域 -->
      <div ref="canvasContainer" class="relative bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-lg overflow-hidden border border-neutral-800" style="height: 500px">
        <!-- Three.js Canvas将在这里渲染 -->

        <!-- 图例 -->
        <div class="absolute bottom-4 left-4 bg-neutral-900/95 backdrop-blur-sm rounded-lg p-4 border border-neutral-800">
          <h4 class="text-sm font-semibold mb-3">数据类型</h4>
          <div class="space-y-2">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
              <span class="text-xs">文档 ({{ clusterStats.documents }})</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-pink-500 shadow-lg shadow-pink-500/50"></div>
              <span class="text-xs">图片 ({{ clusterStats.images }})</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-purple-500 shadow-lg shadow-purple-500/50"></div>
              <span class="text-xs">音频 ({{ clusterStats.audios }})</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
              <span class="text-xs">视频 ({{ clusterStats.videos }})</span>
            </div>
          </div>
        </div>

        <!-- 统计信息 -->
        <div class="absolute top-4 right-4 bg-neutral-900/95 backdrop-blur-sm rounded-lg p-4 border border-neutral-800">
          <div class="space-y-2 text-xs">
            <div class="flex items-center justify-between gap-4">
              <span class="text-neutral-400">总向量数：</span>
              <span class="font-semibold text-primary-400">{{ totalVectors.toLocaleString() }}</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-neutral-400">降维方法：</span>
              <span class="font-semibold">t-SNE</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-neutral-400">原始维度：</span>
              <span class="font-semibold">768</span>
            </div>
            <div class="flex items-center justify-between gap-4">
              <span class="text-neutral-400">显示维度：</span>
              <span class="font-semibold">3D</span>
            </div>
          </div>
        </div>

        <!-- 聚类信息 (可切换) -->
        <div v-if="showClusters" class="absolute bottom-4 right-4 bg-neutral-900/95 backdrop-blur-sm rounded-lg p-4 border border-neutral-800 max-w-xs">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>🎯</span>
            <span>发现的聚类</span>
          </h4>
          <div class="space-y-3">
            <div
              v-for="cluster in clusters"
              :key="cluster.id"
              class="text-xs"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-medium">{{ cluster.label }}</span>
                <AppBadge size="sm" variant="info">{{ cluster.count }}</AppBadge>
              </div>
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="tag in cluster.topTags"
                  :key="tag"
                  class="px-1.5 py-0.5 bg-neutral-800 rounded text-[10px] text-neutral-400"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 向量示例展示 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 原始向量 -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>📊</span>
            <span>向量表示示例</span>
          </h4>
          <div class="space-y-3">
            <div>
              <div class="text-xs text-neutral-400 mb-2">768维特征向量（部分展示）</div>
              <div class="bg-neutral-950 rounded p-3 font-mono text-[10px] text-neutral-300 overflow-x-auto">
                <div class="space-y-1">
                  <div>[0.0234, -0.1234, 0.5678, 0.0123, -0.3456, ...]</div>
                  <div class="text-neutral-600">// 维度 0-7</div>
                  <div class="mt-2">[0.2341, 0.1122, -0.0987, 0.4321, 0.1111, ...]</div>
                  <div class="text-neutral-600">// 维度 758-767</div>
                </div>
              </div>
            </div>
            <div class="grid grid-cols-3 gap-2 text-center text-xs">
              <div>
                <div class="text-neutral-400">最小值</div>
                <div class="font-semibold text-blue-400">-0.98</div>
              </div>
              <div>
                <div class="text-neutral-400">平均值</div>
                <div class="font-semibold text-green-400">0.02</div>
              </div>
              <div>
                <div class="text-neutral-400">最大值</div>
                <div class="font-semibold text-red-400">0.95</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 相似度计算 -->
        <div class="bg-neutral-900/50 rounded-lg p-4 border border-neutral-800">
          <h4 class="text-sm font-semibold mb-3 flex items-center gap-2">
            <span>🔍</span>
            <span>相似度计算</span>
          </h4>
          <div class="space-y-3">
            <div class="bg-neutral-950 rounded p-3">
              <div class="text-xs text-neutral-400 mb-2">余弦相似度公式</div>
              <div class="font-mono text-xs text-center py-2">
                <div class="text-neutral-300">
                  similarity = (A · B) / (||A|| × ||B||)
                </div>
              </div>
              <div class="text-[10px] text-neutral-500 mt-2">
                值域: [-1, 1]，越接近1表示越相似
              </div>
            </div>
            
            <div class="space-y-2">
              <div class="text-xs text-neutral-400">示例：查询相似度</div>
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-neutral-300">文档A ↔ 文档B</span>
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div class="h-full bg-green-500" style="width: 95%"></div>
                    </div>
                    <span class="font-semibold text-green-400 w-10 text-right">0.95</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-neutral-300">文档A ↔ 图片C</span>
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div class="h-full bg-yellow-500" style="width: 68%"></div>
                    </div>
                    <span class="font-semibold text-yellow-400 w-10 text-right">0.68</span>
                  </div>
                </div>
                <div class="flex items-center justify-between text-xs">
                  <span class="text-neutral-300">文档A ↔ 音频D</span>
                  <div class="flex items-center gap-2">
                    <div class="w-16 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div class="h-full bg-red-500" style="width: 23%"></div>
                    </div>
                    <span class="font-semibold text-red-400 w-10 text-right">0.23</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 技术说明 -->
      <div class="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
        <div class="flex items-start gap-3">
          <div class="text-2xl">💡</div>
          <div class="flex-1">
            <h4 class="font-semibold text-sm mb-2">为什么需要向量化？</h4>
            <div class="text-xs text-neutral-300 space-y-2 leading-relaxed">
              <p>
                <strong class="text-primary-400">1. 语义理解：</strong>
                将文本、图片、音视频转换为数学向量，AI能理解其语义含义，而不只是字面匹配。
              </p>
              <p>
                <strong class="text-secondary-400">2. 相似度计算：</strong>
                在向量空间中，距离近的点表示内容相似。支持"找相似内容"而不只是"精确搜索"。
              </p>
              <p>
                <strong class="text-accent-400">3. 跨模态检索：</strong>
                统一的向量空间让不同类型的数据可比较，实现"用文字搜图片"、"用图片找视频"等功能。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import AppCard from '@/components/atoms/AppCard.vue'
import AppButton from '@/components/atoms/AppButton.vue'
import AppBadge from '@/components/atoms/AppBadge.vue'
import { mockVectorPoints } from '@/api/mock/mockData'

const canvasContainer = ref<HTMLDivElement | null>(null)
const showClusters = ref(true)
const totalVectors = ref(1247)

const clusterStats = ref({
  documents: 456,
  images: 389,
  audios: 168,
  videos: 234
})

const clusters = ref([
  {
    id: 'c1',
    label: '产品设计文档',
    count: 89,
    topTags: ['需求', 'UI', '用户体验']
  },
  {
    id: 'c2',
    label: '技术架构资料',
    count: 145,
    topTags: ['系统架构', 'API', '数据库']
  },
  {
    id: 'c3',
    label: '营销素材',
    count: 78,
    topTags: ['宣传', '品牌', '活动']
  },
  {
    id: 'c4',
    label: '培训教程',
    count: 56,
    topTags: ['教学', '操作指南', '最佳实践']
  }
])

// Three.js 变量
let scene: THREE.Scene
let camera: THREE.PerspectiveCamera
let renderer: THREE.WebGLRenderer
let controls: OrbitControls
let animationId: number
let particles: THREE.Points

// 颜色映射
const colorMap = {
  document: 0x3b82f6, // blue-500
  image: 0xec4899,    // pink-500
  audio: 0xa855f7,    // purple-500
  video: 0x10b981     // green-500
}

// 初始化3D场景
const initThreeScene = () => {
  if (!canvasContainer.value) return

  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight

  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a0a)

  // 创建相机
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 15
  camera.position.y = 5

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
  canvasContainer.value.appendChild(renderer.domElement)

  // 添加控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5

  // 添加环境光
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // 添加点光源
  const pointLight = new THREE.PointLight(0xffffff, 1)
  pointLight.position.set(10, 10, 10)
  scene.add(pointLight)

  // 创建粒子系统
  createParticles()

  // 添加网格辅助线
  const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222)
  gridHelper.position.y = -10
  scene.add(gridHelper)

  // 开始动画循环
  animate()
}

// 创建粒子点
const createParticles = () => {
  const geometry = new THREE.BufferGeometry()
  const positions: number[] = []
  const colors: number[] = []
  const sizes: number[] = []

  // 根据数据类型设置颜色
  mockVectorPoints.forEach(point => {
    positions.push(...point.position)
    
    const color = new THREE.Color(colorMap[point.type])
    colors.push(color.r, color.g, color.b)
    
    // 随机大小增加视觉趣味
    sizes.push(Math.random() * 0.3 + 0.1)
  })

  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

  // 创建着色器材质
  const material = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;
      
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        
        // 添加轻微的脉动效果
        float pulse = sin(time * 2.0 + position.x * 0.5) * 0.1 + 1.0;
        gl_PointSize = size * pulse * 50.0 * (300.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        // 创建圆形粒子
        vec2 center = gl_PointCoord - vec2(0.5);
        float dist = length(center);
        
        if (dist > 0.5) discard;
        
        // 添加发光效果
        float alpha = 1.0 - (dist * 2.0);
        alpha = pow(alpha, 2.0);
        
        gl_FragColor = vec4(vColor, alpha);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate)
  
  // 更新时间
  if (particles && particles.material instanceof THREE.ShaderMaterial) {
    particles.material.uniforms.time.value += 0.01
  }
  
  controls.update()
  renderer.render(scene, camera)
}

// 旋转视图
const rotateView = () => {
  controls.autoRotate = !controls.autoRotate
}

// 重置视图
const resetView = () => {
  camera.position.set(0, 5, 15)
  controls.target.set(0, 0, 0)
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
  controls.update()
}

// 切换聚类显示
const toggleClusters = () => {
  showClusters.value = !showClusters.value
}

// 处理窗口大小变化
const handleResize = () => {
  if (!canvasContainer.value) return
  
  const width = canvasContainer.value.clientWidth
  const height = canvasContainer.value.clientHeight
  
  camera.aspect = width / height
  camera.updateProjectionMatrix()
  renderer.setSize(width, height)
}

// 生命周期钩子
onMounted(() => {
  initThreeScene()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
  if (renderer) {
    renderer.dispose()
  }
  if (canvasContainer.value && renderer.domElement) {
    canvasContainer.value.removeChild(renderer.domElement)
  }
})
</script>

