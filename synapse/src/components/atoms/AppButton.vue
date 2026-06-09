<template>
  <button
    :class="buttonClasses"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <span v-if="loading" class="inline-block mr-1.5 animate-spin text-xs">⟳</span>
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

const emit = defineEmits<{
  (e: 'click', event: MouseEvent): void
}>()

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-cursor transition-colors duration-150 focus:outline-none focus:ring-1 focus:ring-cursor-accent disabled:opacity-40 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-cursor-accent hover:bg-cursor-accent-hover text-white border border-transparent',
    secondary: 'bg-cursor-panel hover:bg-cursor-elevated text-cursor-fg border border-cursor-border',
    outline: 'border border-cursor-border text-cursor-fg hover:bg-cursor-surface-hover bg-transparent',
    ghost: 'text-cursor-fg-muted hover:text-cursor-fg hover:bg-cursor-surface-hover bg-transparent border border-transparent'
  }

  const sizes = {
    sm: 'px-2.5 py-1 text-2xs',
    md: 'px-4 py-1.5 text-sm',
    lg: 'px-5 py-2 text-sm'
  }

  return `${base} ${variants[props.variant]} ${sizes[props.size]}`
})

const handleClick = (event: MouseEvent) => {
  if (!props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>
