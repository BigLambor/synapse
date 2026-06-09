<template>
  <div class="w-full">
    <div v-if="showLabel" class="flex items-center justify-between mb-1.5">
      <span class="text-2xs font-medium text-cursor-fg-muted">{{ label }}</span>
      <span class="text-2xs text-cursor-fg-muted">{{ value }}%</span>
    </div>

    <div class="w-full h-1 bg-cursor-border rounded-cursor overflow-hidden">
      <div
        class="h-full transition-all duration-300 ease-out"
        :class="progressColor"
        :style="{ width: value + '%' }"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  label?: string
  showLabel?: boolean
  animated?: boolean
  variant?: 'primary' | 'success' | 'warning' | 'error'
}

const props = withDefaults(defineProps<Props>(), {
  showLabel: true,
  animated: false,
  variant: 'primary'
})

const progressColor = computed(() => {
  const colors = {
    primary: 'bg-cursor-accent',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error'
  }
  return colors[props.variant]
})
</script>
