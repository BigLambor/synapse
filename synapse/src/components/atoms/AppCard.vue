<template>
  <div :class="cardClasses">
    <div v-if="$slots.header" class="px-6 py-4 border-b border-neutral-700">
      <slot name="header" />
    </div>
    <div class="p-6">
      <slot />
    </div>
    <div v-if="$slots.footer" class="px-6 py-4 border-t border-neutral-700 bg-neutral-900/50">
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
  const base = 'rounded-xl overflow-hidden transition-shadow duration-200'
  
  const variants = {
    default: 'bg-neutral-800/50',
    elevated: 'bg-neutral-800/50 shadow-xl',
    outlined: 'bg-neutral-900/30 border border-neutral-700'
  }
  
  const hover = props.hoverable ? 'hover:shadow-2xl cursor-pointer' : ''
  
  return `${base} ${variants[props.variant]} ${hover}`
})
</script>

