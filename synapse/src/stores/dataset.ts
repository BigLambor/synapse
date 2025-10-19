// 数据集管理 Store
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Domain } from '@/types/models'
import {
  DatasetStatus,
  ExportFormat,
  TrainingPlatform,
  AnnotationType,
  AnnotationStatus
} from '@/types/enums'

export const useDatasetStore = defineStore('dataset', () => {
  // ============================================
  // State
  // ============================================

  const datasets = ref<Domain.Dataset[]>([])
  const currentDataset = ref<Domain.Dataset | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)

  // 过滤器
  const filters = ref({
    status: null as DatasetStatus | null,
    category: null as string | null,
    searchQuery: ''
  })

  // 排序
  const sortBy = ref<'createdAt' | 'updatedAt' | 'name' | 'totalAssets'>('updatedAt')
  const sortOrder = ref<'asc' | 'desc'>('desc')

  // ============================================
  // Getters
  // ============================================

  /**
   * 过滤和排序后的数据集列表
   */
  const filteredDatasets = computed(() => {
    let result = [...datasets.value]

    // 应用过滤器
    if (filters.value.status) {
      result = result.filter((d) => d.status === filters.value.status)
    }

    if (filters.value.category) {
      result = result.filter((d) => d.category === filters.value.category)
    }

    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(query) ||
          d.description.toLowerCase().includes(query) ||
          d.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // 应用排序
    result.sort((a, b) => {
      const aValue = a[sortBy.value]
      const bValue = b[sortBy.value]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder.value === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
      }

      return 0
    })

    return result
  })

  /**
   * 数据集统计信息
   */
  const statistics = computed(() => ({
    total: datasets.value.length,
    draft: datasets.value.filter((d) => d.status === DatasetStatus.DRAFT).length,
    ready: datasets.value.filter((d) => d.status === DatasetStatus.READY).length,
    published: datasets.value.filter((d) => d.status === DatasetStatus.PUBLISHED).length,
    totalAssets: datasets.value.reduce((sum, d) => sum + d.totalAssets, 0),
    totalExports: datasets.value.reduce((sum, d) => sum + d.exports.length, 0),
    avgQuality:
      datasets.value.length > 0
        ? datasets.value.reduce((sum, d) => sum + d.quality.accuracy, 0) / datasets.value.length
        : 0
  }))

  /**
   * 可用的分类列表
   */
  const categories = computed(() => {
    const cats = new Set(datasets.value.map((d) => d.category))
    return Array.from(cats).sort()
  })

  // ============================================
  // Actions
  // ============================================

  /**
   * 获取所有数据集
   */
  const fetchDatasets = async () => {
    isLoading.value = true
    error.value = null

    try {
      // 模拟API调用延迟
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 从 Mock 数据加载
      const { mockDatasets } = await import('@/api/mock/mockData')
      datasets.value = mockDatasets

      return datasets.value
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 获取单个数据集详情
   */
  const fetchDatasetById = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const dataset = datasets.value.find((d) => d.id === id)
      if (dataset) {
        currentDataset.value = dataset
        return dataset
      }

      throw new Error(`Dataset ${id} not found`)
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 创建新数据集
   */
  const createDataset = async (config: Domain.DatasetCreateConfig): Promise<Domain.Dataset> => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 800))

      const now = new Date().toISOString()

      // 计算数据划分
      const splitRatio = config.splitRatio || {
        train: 0.8,
        validation: 0.1,
        test: 0.1
      }

      const totalAssets = config.assetIds.length
      const trainCount = Math.floor(totalAssets * splitRatio.train)
      const valCount = Math.floor(totalAssets * splitRatio.validation)
      const testCount = totalAssets - trainCount - valCount

      // 创建资产引用
      const assets: Domain.AssetReference[] = config.assetIds.map((assetId, index) => {
        let split: 'train' | 'validation' | 'test'
        if (index < trainCount) split = 'train'
        else if (index < trainCount + valCount) split = 'validation'
        else split = 'test'

        return {
          assetId,
          assetType: 'document' as any, // 需要从实际资产获取
          annotations: [],
          includedAt: now,
          split
        }
      })

      const newDataset: Domain.Dataset = {
        id: `dataset_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: config.name,
        description: config.description,
        version: '1.0.0',
        status: DatasetStatus.DRAFT,
        createdBy: 'current_user', // 从 userStore 获取
        createdAt: now,
        updatedAt: now,
        assets,
        totalAssets,
        splits: {
          train: { count: trainCount, percentage: splitRatio.train * 100 },
          validation: { count: valCount, percentage: splitRatio.validation * 100 },
          test: { count: testCount, percentage: splitRatio.test * 100 }
        },
        quality: {
          completeness: 0,
          consistency: 0,
          accuracy: 0,
          labelQuality: 0,
          diversity: 0,
          balance: 0
        },
        statistics: {
          totalSize: 0,
          avgFileSize: 0,
          minFileSize: 0,
          maxFileSize: 0,
          typeDistribution: {},
          labelDistribution: {},
          totalAnnotations: 0,
          avgAnnotationsPerAsset: 0
        },
        annotationConfig: config.annotationConfig,
        exports: [],
        tags: config.tags,
        category: config.category
      }

      datasets.value.unshift(newDataset)
      currentDataset.value = newDataset

      return newDataset
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 更新数据集
   */
  const updateDataset = async (id: string, updates: Partial<Domain.Dataset>) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 500))

      const index = datasets.value.findIndex((d) => d.id === id)
      if (index === -1) {
        throw new Error(`Dataset ${id} not found`)
      }

      datasets.value[index] = {
        ...datasets.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }

      if (currentDataset.value?.id === id) {
        currentDataset.value = datasets.value[index]
      }

      return datasets.value[index]
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 删除数据集
   */
  const deleteDataset = async (id: string) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const index = datasets.value.findIndex((d) => d.id === id)
      if (index === -1) {
        throw new Error(`Dataset ${id} not found`)
      }

      datasets.value.splice(index, 1)

      if (currentDataset.value?.id === id) {
        currentDataset.value = null
      }
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 评估数据集质量
   */
  const assessQuality = async (datasetId: string): Promise<Domain.QualityReport> => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const dataset = datasets.value.find((d) => d.id === datasetId)
      if (!dataset) {
        throw new Error(`Dataset ${datasetId} not found`)
      }

      // 模拟质量评估
      const quality: Domain.QualityMetrics = {
        completeness: 0.85 + Math.random() * 0.15,
        consistency: 0.8 + Math.random() * 0.2,
        accuracy: 0.9 + Math.random() * 0.1,
        labelQuality: 0.88 + Math.random() * 0.12,
        diversity: 0.75 + Math.random() * 0.25,
        balance: 0.7 + Math.random() * 0.3
      }

      const overallScore = Object.values(quality).reduce((a, b) => a + b, 0) / 6

      const report: Domain.QualityReport = {
        datasetId,
        generatedAt: new Date().toISOString(),
        overallScore: Math.round(overallScore * 100),
        metrics: quality,
        issues: [
          {
            severity: 'medium',
            type: 'class_imbalance',
            description: '某些类别的样本数量明显少于其他类别',
            affectedAssets: [],
            suggestedFix: '增加少数类别的样本或使用数据增强'
          }
        ],
        recommendations: [
          '建议增加10%的验证集样本',
          '某些标注需要人工复核',
          '考虑添加更多多样性的数据源'
        ]
      }

      // 更新数据集质量指标
      await updateDataset(datasetId, { quality })

      return report
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 导出数据集
   */
  const exportDataset = async (
    datasetId: string,
    config: Domain.DatasetExportConfig
  ): Promise<Domain.ExportRecord> => {
    isLoading.value = true
    error.value = null

    try {
      // 模拟导出处理时间
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const dataset = datasets.value.find((d) => d.id === datasetId)
      if (!dataset) {
        throw new Error(`Dataset ${datasetId} not found`)
      }

      // 创建导出记录
      const exportRecord: Domain.ExportRecord = {
        id: `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        exportedAt: new Date().toISOString(),
        exportedBy: 'current_user',
        format: config.format,
        platform: config.targetPlatform,
        fileSize: Math.floor(Math.random() * 500 + 100) * 1024 * 1024, // 100-600MB
        downloadUrl: `/downloads/${datasetId}_${config.format}.zip`,
        config
      }

      // 添加导出记录到数据集
      dataset.exports.unshift(exportRecord)
      await updateDataset(datasetId, { exports: dataset.exports })

      return exportRecord
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 添加标注到资产
   */
  const addAnnotation = async (
    datasetId: string,
    assetId: string,
    annotation: Omit<Domain.DatasetAnnotation, 'id' | 'createdAt'>
  ) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 300))

      const dataset = datasets.value.find((d) => d.id === datasetId)
      if (!dataset) {
        throw new Error(`Dataset ${datasetId} not found`)
      }

      const assetRef = dataset.assets.find((a) => a.assetId === assetId)
      if (!assetRef) {
        throw new Error(`Asset ${assetId} not found in dataset`)
      }

      const newAnnotation: Domain.DatasetAnnotation = {
        ...annotation,
        id: `annotation_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString()
      }

      assetRef.annotations.push(newAnnotation)
      await updateDataset(datasetId, { assets: dataset.assets })

      return newAnnotation
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 发布数据集
   */
  const publishDataset = async (datasetId: string) => {
    isLoading.value = true
    error.value = null

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      await updateDataset(datasetId, {
        status: DatasetStatus.PUBLISHED,
        publishedAt: new Date().toISOString()
      })
    } catch (e) {
      error.value = e as Error
      throw e
    } finally {
      isLoading.value = false
    }
  }

  /**
   * 设置过滤器
   */
  const setFilters = (newFilters: Partial<typeof filters.value>) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  /**
   * 设置排序
   */
  const setSorting = (field: typeof sortBy.value, order: typeof sortOrder.value) => {
    sortBy.value = field
    sortOrder.value = order
  }

  /**
   * 重置过滤器
   */
  const resetFilters = () => {
    filters.value = {
      status: null,
      category: null,
      searchQuery: ''
    }
  }

  /**
   * 清空当前数据集
   */
  const clearCurrentDataset = () => {
    currentDataset.value = null
  }

  // ============================================
  // Return
  // ============================================

  return {
    // State
    datasets,
    currentDataset,
    isLoading,
    error,
    filters,
    sortBy,
    sortOrder,

    // Getters
    filteredDatasets,
    statistics,
    categories,

    // Actions
    fetchDatasets,
    fetchDatasetById,
    createDataset,
    updateDataset,
    deleteDataset,
    assessQuality,
    exportDataset,
    addAnnotation,
    publishDataset,
    setFilters,
    setSorting,
    resetFilters,
    clearCurrentDataset
  }
})

