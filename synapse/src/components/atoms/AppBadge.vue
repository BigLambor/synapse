<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md'
})

const badgeClasses = computed(() => {
  const base = 'inline-flex items-center font-medium rounded-cursor border'

  const variants = {
    default: 'bg-cursor-panel text-cursor-fg-muted border-cursor-border',
    success: 'bg-success/10 text-success border-success/30',
    warning: 'bg-warning/10 text-warning border-warning/30',
    error: 'bg-error/10 text-error border-error/30',
    info: 'bg-cursor-accent-muted text-cursor-accent border-cursor-accent/30'
  }

  const sizes = {
    sm: 'px-1.5 py-0.5 text-2xs',
    md: 'px-2 py-0.5 text-2xs',
    lg: 'px-2.5 py-1 text-xs'
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})
</script>
