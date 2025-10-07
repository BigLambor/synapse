import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface SearchQuery {
  type: 'text' | 'image' | 'semantic'
  content: string | File
  filters?: {
    assetTypes?: string[]
    dateRange?: { start: string; end: string }
    minRelevance?: number
    tags?: string[]
  }
}

export interface SearchResult {
  id: string
  type: string
  title: string
  relevanceScore: number
  matchReason: string
  highlightedSnippet: string
  thumbnail?: string
  metadata: any
  [key: string]: any
}

export const useSearchStore = defineStore('search', () => {
  // State
  const currentQuery = ref<SearchQuery | null>(null)
  const results = ref<SearchResult[]>([])
  const searchHistory = ref<SearchQuery[]>([])
  const isSearching = ref(false)
  const filters = ref<SearchQuery['filters']>({})
  const sortBy = ref<'relevance' | 'date' | 'type'>('relevance')

  // Getters
  const filteredResults = computed(() => {
    let filtered = [...results.value]
    
    // 按相关度过滤
    if (filters.value?.minRelevance) {
      filtered = filtered.filter(r => r.relevanceScore >= filters.value.minRelevance!)
    }
    
    // 按资产类型过滤
    if (filters.value?.assetTypes && filters.value.assetTypes.length > 0) {
      filtered = filtered.filter(r => filters.value.assetTypes!.includes(r.type))
    }
    
    // 按标签过滤
    if (filters.value?.tags && filters.value.tags.length > 0) {
      filtered = filtered.filter(r => 
        r.metadata?.tags?.some((tag: string) => 
          filters.value.tags!.includes(tag)
        )
      )
    }
    
    // 排序
    if (sortBy.value === 'relevance') {
      filtered.sort((a, b) => b.relevanceScore - a.relevanceScore)
    } else if (sortBy.value === 'date') {
      filtered.sort((a, b) => 
        new Date(b.metadata?.uploadedAt || 0).getTime() - 
        new Date(a.metadata?.uploadedAt || 0).getTime()
      )
    } else if (sortBy.value === 'type') {
      filtered.sort((a, b) => a.type.localeCompare(b.type))
    }
    
    return filtered
  })

  const totalResults = computed(() => results.value.length)
  const hasResults = computed(() => results.value.length > 0)

  // Actions
  function setQuery(query: SearchQuery) {
    currentQuery.value = query
    // 添加到历史记录（最多保留10条）
    searchHistory.value.unshift(query)
    if (searchHistory.value.length > 10) {
      searchHistory.value = searchHistory.value.slice(0, 10)
    }
  }

  function setResults(newResults: SearchResult[]) {
    results.value = newResults
  }

  function clearResults() {
    results.value = []
    currentQuery.value = null
  }

  function setFilters(newFilters: SearchQuery['filters']) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function clearFilters() {
    filters.value = {}
  }

  function setSortBy(sort: 'relevance' | 'date' | 'type') {
    sortBy.value = sort
  }

  function setSearching(value: boolean) {
    isSearching.value = value
  }

  return {
    // State
    currentQuery,
    results,
    searchHistory,
    isSearching,
    filters,
    sortBy,
    // Getters
    filteredResults,
    totalResults,
    hasResults,
    // Actions
    setQuery,
    setResults,
    clearResults,
    setFilters,
    clearFilters,
    setSortBy,
    setSearching
  }
})
