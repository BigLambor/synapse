import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Asset {
  id: string
  type: 'video' | 'pdf' | 'image' | 'patent' | 'document'
  title: string
  source?: string
  uploadedAt: string
  metadata: {
    duration?: number
    resolution?: string
    transcription?: string
    keyMoments?: Array<{
      timestamp: number
      label: string
      sentiment: 'positive' | 'negative' | 'neutral'
    }>
    [key: string]: any
  }
  features: {
    embedding: number[]
    tags: string[]
    entities: Array<{
      type: string
      name: string
      mentions: number
    }>
  }
  processingStatus: {
    stage: 'uploading' | 'processing' | 'completed' | 'failed'
    progress: number
    startedAt?: string
    completedAt?: string
    error?: string
  }
}

export const useAssetsStore = defineStore('assets', () => {
  // State
  const assets = ref<Asset[]>([])
  const uploadQueue = ref<File[]>([])
  const uploadProgress = ref<Record<string, number>>({})

  // Getters
  const totalAssets = computed(() => assets.value.length)
  const processingAssets = computed(() => 
    assets.value.filter(a => a.processingStatus.stage === 'processing')
  )
  const completedAssets = computed(() => 
    assets.value.filter(a => a.processingStatus.stage === 'completed')
  )
  const assetsByType = computed(() => {
    const byType: Record<string, Asset[]> = {}
    assets.value.forEach(asset => {
      if (!byType[asset.type]) {
        byType[asset.type] = []
      }
      byType[asset.type].push(asset)
    })
    return byType
  })

  // Actions
  function addAsset(asset: Asset) {
    assets.value.push(asset)
  }

  function updateAsset(assetId: string, updates: Partial<Asset>) {
    const index = assets.value.findIndex(a => a.id === assetId)
    if (index > -1) {
      assets.value[index] = { ...assets.value[index], ...updates }
    }
  }

  function updateProcessingStatus(
    assetId: string, 
    status: Partial<Asset['processingStatus']>
  ) {
    const asset = assets.value.find(a => a.id === assetId)
    if (asset) {
      asset.processingStatus = { ...asset.processingStatus, ...status }
    }
  }

  function removeAsset(assetId: string) {
    const index = assets.value.findIndex(a => a.id === assetId)
    if (index > -1) {
      assets.value.splice(index, 1)
    }
  }

  function addToUploadQueue(files: File[]) {
    uploadQueue.value.push(...files)
  }

  function clearUploadQueue() {
    uploadQueue.value = []
    uploadProgress.value = {}
  }

  function setUploadProgress(fileId: string, progress: number) {
    uploadProgress.value[fileId] = progress
  }

  return {
    // State
    assets,
    uploadQueue,
    uploadProgress,
    // Getters
    totalAssets,
    processingAssets,
    completedAssets,
    assetsByType,
    // Actions
    addAsset,
    updateAsset,
    updateProcessingStatus,
    removeAsset,
    addToUploadQueue,
    clearUploadQueue,
    setUploadProgress
  }
})
