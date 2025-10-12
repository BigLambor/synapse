# 开发指南

## 开发环境设置

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git
- VS Code（推荐）

### 推荐的VS Code扩展

```json
{
  "recommendations": [
    "vue.volar",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "lokalise.i18n-ally"
  ]
}
```

## 开发工作流

### 1. 克隆仓库

```bash
git clone <repository-url>
cd synapse
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 4. 开发新功能

```bash
# 创建功能分支
git checkout -b feature/new-feature

# 开发...

# 提交代码
git add .
git commit -m "feat: add new feature"
```

## 代码规范

### 命名约定

#### 文件命名

- **组件**: PascalCase - `Button.vue`, `SearchBar.vue`
- **Composables**: camelCase - `useSearch.ts`, `useUpload.ts`
- **Stores**: camelCase - `assets.ts`, `search.ts`
- **工具函数**: camelCase - `format.ts`, `validate.ts`

#### 变量命名

```typescript
// ✅ 好的命名
const userName = '张三'
const isLoading = true
const handleClick = () => {}

// ❌ 避免的命名
const data = '张三'
const flag = true
const func = () => {}
```

### Vue组件规范

#### Script Setup风格

```vue
<script setup lang="ts">
// 导入
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// Props定义
interface Props {
  title: string
  count?: number
}

const props = withDefaults(defineProps<Props>(), {
  count: 0
})

// Emits定义
const emit = defineEmits<{
  click: [event: MouseEvent]
  update: [value: string]
}>()

// 响应式数据
const isActive = ref(false)

// 计算属性
const displayTitle = computed(() => props.title.toUpperCase())

// 方法
function handleClick(event: MouseEvent) {
  emit('click', event)
}
</script>
```

#### 模板规范

```vue
<template>
  <!-- 使用语义化HTML -->
  <div class="component-name">
    <!-- 条件渲染 -->
    <div v-if="isActive">Active</div>
    <div v-else>Inactive</div>
    
    <!-- 列表渲染 -->
    <ul>
      <li v-for="item in items" :key="item.id">
        {{ item.name }}
      </li>
    </ul>
    
    <!-- 事件处理 -->
    <button @click="handleClick">
      Click me
    </button>
  </div>
</template>
```

#### 样式规范

```vue
<style scoped>
/* 使用Tailwind优先 */
/* 只在必要时使用自定义CSS */

.component-name {
  /* 自定义样式 */
}

/* 避免深度选择器，除非必要 */
:deep(.nested-component) {
  /* 样式 */
}
</style>
```

### TypeScript规范

#### 类型定义

```typescript
// ✅ 使用interface定义对象类型
interface User {
  id: string
  name: string
  email?: string
}

// ✅ 使用type定义联合类型
type Status = 'pending' | 'success' | 'error'

// ✅ 使用泛型
function processData<T>(data: T): T {
  return data
}

// ❌ 避免any
const data: any = {} // 不推荐

// ✅ 使用unknown代替
const data: unknown = {}
```

### Composables规范

```typescript
// useExample.ts
import { ref, computed } from 'vue'

export function useExample(initialValue: string) {
  // State
  const value = ref(initialValue)
  const isValid = ref(false)
  
  // Computed
  const displayValue = computed(() => value.value.toUpperCase())
  
  // Methods
  function update(newValue: string) {
    value.value = newValue
    isValid.value = newValue.length > 0
  }
  
  // 返回公共API
  return {
    // State
    value,
    isValid,
    // Computed
    displayValue,
    // Methods
    update
  }
}
```

### Store规范

```typescript
// stores/example.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useExampleStore = defineStore('example', () => {
  // State
  const items = ref<Item[]>([])
  const loading = ref(false)
  
  // Getters
  const itemCount = computed(() => items.value.length)
  
  // Actions
  async function fetchItems() {
    loading.value = true
    try {
      const data = await api.getItems()
      items.value = data
    } catch (error) {
      console.error('Failed to fetch items:', error)
    } finally {
      loading.value = false
    }
  }
  
  return {
    items,
    loading,
    itemCount,
    fetchItems
  }
})
```

## Git提交规范

### Commit Message格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type类型

- **feat**: 新功能
- **fix**: Bug修复
- **docs**: 文档更新
- **style**: 代码格式（不影响功能）
- **refaDirectorr**: 重构
- **perf**: 性能优化
- **test**: 测试相关
- **chore**: 构建/工具相关

### 示例

```bash
feat(search): add semantic search functionality

Implement semantic search using veDirectorr embeddings.
Support natural language queries.

Closes #123
```

## 调试技巧

### Vue Devtools

1. 安装Vue Devtools浏览器扩展
2. 在开发模式下自动启用
3. 可以检查组件树、Pinia状态、路由等

### 性能分析

```typescript
// 使用Performance API
performance.mark('search-start')
await searchAPI()
performance.mark('search-end')
performance.measure('search', 'search-start', 'search-end')
```

### 日志规范

```typescript
// ✅ 开发环境日志
if (import.meta.env.DEV) {
  console.log('Debug info:', data)
}

// ✅ 错误日志
console.error('Error occurred:', error)

// ✅ 警告日志
console.warn('Deprecated API used')

// ❌ 避免在生产环境输出日志
console.log('User data:', userData) // 可能泄露敏感信息
```

## 测试指南

### 单元测试

```typescript
// tests/unit/composables/useSearch.spec.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useSearch } from '@/composables/useSearch'

describe('useSearch', () => {
  beforeEach(() => {
    // 重置状态
  })
  
  it('should perform search', async () => {
    const { search, results } = useSearch()
    await search({ type: 'text', content: 'test' })
    expect(results.value.length).toBeGreaterThan(0)
  })
})
```

### E2E测试

```typescript
// tests/e2e/search.spec.ts
import { test, expect } from '@playwright/test'

test('should search and display results', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Exploration' }).click()
  await page.getByRole('searchbox').fill('test query')
  await page.getByRole('button', { name: 'Search' }).click()
  await expect(page.getByText('results found')).toBeVisible()
})
```

## 常见问题

### Q: TypeScript类型错误

```bash
# 清除缓存
rm -rf node_modules/.vite
npm run dev
```

### Q: 依赖版本冲突

```bash
# 删除node_modules和lock文件
rm -rf node_modules package-lock.json
npm install
```

### Q: 端口被占用

```bash
# 修改vite.config.ts中的端口
server: {
  port: 5174
}
```

## 性能优化建议

1. **使用v-show代替v-if**（频繁切换）
2. **使用computed代替method**（需要缓存）
3. **使用shallowRef**（大型不可变数据）
4. **使用defineAsyncComponent**（懒加载组件）
5. **避免在模板中使用复杂表达式**

## 代码审查清单

- [ ] 代码符合规范
- [ ] 添加了必要的注释
- [ ] 编写了单元测试
- [ ] TypeScript类型定义完整
- [ ] 无console.log残留
- [ ] 性能考虑（虚拟滚动、懒加载）
- [ ] 无障碍性（ARIA标签）
- [ ] 响应式设计
- [ ] 错误处理

---

**最后更新**: 2025-10-07
