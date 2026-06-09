<template>
  <div class="w-full">
    <label v-if="label" :for="inputId" class="block text-sm font-medium text-cursor-fg mb-1.5">
      {{ label }}
      <span v-if="required" class="text-error">*</span>
    </label>
    <div class="relative">
      <input
        :id="inputId"
        v-model="localValue"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="inputClasses"
        @input="handleInput"
        @blur="emit('blur')"
        @focus="emit('focus')"
      />
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 flex items-center pr-3">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="mt-1 text-sm text-error">{{ error }}</p>
    <p v-else-if="hint" class="mt-1 text-sm text-cursor-fg-muted">{{ hint }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

interface Props {
  modelValue?: string | number
  type?: string
  label?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
  error?: string
  hint?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string | number): void
  (e: 'blur'): void
  (e: 'focus'): void
}>()

const inputId = `input-${Math.random().toString(36).substr(2, 9)}`
const localValue = ref(props.modelValue)

const inputClasses = computed(() => {
  const base = 'block w-full rounded-cursor bg-cursor-input border px-3 py-2 text-sm text-cursor-fg placeholder-cursor-fg-subtle transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-0'
  const borderColor = props.error
    ? 'border-error focus:ring-error/20'
    : 'border-cursor-border focus:ring-cursor-accent/20 focus:border-cursor-accent'
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed bg-cursor-panel' : ''

  return `${base} ${borderColor} ${disabled}`
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>
