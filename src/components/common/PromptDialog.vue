<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition-opacity duration-200"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="visible"
        class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/55 backdrop-blur-sm"
        @click.self="onCancel"
      >
        <Transition
          enter-active-class="transition-all duration-200"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div
            v-if="visible"
            class="bg-stone-50 dark:bg-zinc-900 rounded-2xl p-6 shadow-2xl max-w-md mx-4 w-full"
          >
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {{ title }}
            </h3>

            <p v-if="message" class="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {{ message }}
            </p>

            <input
              ref="inputEl"
              v-model="inputValue"
              :placeholder="placeholder"
              class="input"
              @keydown.enter="onConfirm"
            />

            <div class="flex gap-3 mt-5">
              <button
                @click="onConfirm"
                class="flex-1 btn btn-primary"
                :disabled="loading"
              >
                {{ confirmText }}
              </button>
              <button
                @click="onCancel"
                class="flex-1 btn btn-secondary"
                :disabled="loading"
              >
                {{ cancelText }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

interface Props {
  visible: boolean
  title?: string
  message?: string
  placeholder?: string
  initialValue?: string
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Input',
  message: '',
  placeholder: '',
  initialValue: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  loading: false,
})

const emit = defineEmits<{
  confirm: [value: string]
  cancel: []
}>()

const inputValue = ref('')
const inputEl = ref<HTMLInputElement | null>(null)

watch(
  () => props.visible,
  async (visible) => {
    if (visible) {
      inputValue.value = props.initialValue
      await nextTick()
      inputEl.value?.focus()
      inputEl.value?.select()
    }
  },
  { immediate: true }
)

const onConfirm = () => {
  emit('confirm', inputValue.value)
}

const onCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}
</script>
