<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-5 py-4 border-b border-cursor-border bg-cursor-panel">
      <slot name="header" />
    </div>
    <div class="p-5">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-5 py-4 border-t border-cursor-border bg-cursor-panel">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'default' | 'elevated' | 'outlined'
  hoverable?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hoverable: false
})

const cardClasses = computed(() => {
  const base = 'rounded-cursor overflow-hidden transition-all duration-150 border border-cursor-border bg-cursor-surface shadow-cursor'

  const variants = {
    default: '',
    elevated: 'shadow-cursor-lg',
    outlined: 'shadow-none'
  }

  const hover = props.hoverable ? 'hover:border-cursor-accent/40 hover:shadow-cursor-lg cursor-pointer' : ''

  return `${base} ${variants[props.variant]} ${hover}`
})
</script>
