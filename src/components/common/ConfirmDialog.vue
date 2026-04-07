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
            <!-- Icon -->
            <div 
              v-if="icon" 
              class="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center"
              :class="iconBgClass"
            >
              <!-- Warning Icon -->
              <svg v-if="type === 'warning'" class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <!-- Info Icon -->
              <svg v-else-if="type === 'info'" class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <!-- Success Icon -->
              <svg v-else-if="type === 'success'" class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <!-- Danger Icon -->
              <svg v-else-if="type === 'danger'" class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <!-- Title -->
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100 text-center mb-2">
              {{ title }}
            </h3>

            <!-- Message -->
            <p class="text-sm text-gray-600 dark:text-gray-400 text-center mb-6">
              {{ message }}
            </p>

            <!-- Actions -->
            <div class="flex gap-3" :class="{ 'flex-row-reverse': confirmFirst }">
              <button
                @click="onConfirm"
                class="flex-1 btn"
                :class="confirmButtonClass"
                :disabled="loading"
              >
                <span v-if="loading" class="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
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
import { computed } from 'vue'

type DialogType = 'info' | 'warning' | 'success' | 'danger'

interface Props {
  visible: boolean
  title?: string
  message?: string
  type?: DialogType
  icon?: boolean
  confirmText?: string
  cancelText?: string
  confirmFirst?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Confirm',
  message: 'Are you sure you want to proceed?',
  type: 'info',
  icon: true,
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  confirmFirst: true,
  loading: false,
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

const iconBgClass = computed(() => {
  switch (props.type) {
    case 'warning':
      return 'bg-yellow-100 dark:bg-yellow-900/30'
    case 'success':
      return 'bg-amber-100 dark:bg-amber-900/30'
    case 'danger':
      return 'bg-red-100 dark:bg-red-900/30'
    default:
      return 'bg-blue-100 dark:bg-blue-900/30'
  }
})

const confirmButtonClass = computed(() => {
  switch (props.type) {
    case 'danger':
      return 'bg-red-600 hover:bg-red-700 text-white'
    case 'warning':
      return 'bg-yellow-600 hover:bg-yellow-700 text-white'
    case 'success':
      return 'bg-amber-600 hover:bg-amber-700 text-white'
    default:
      return 'btn-primary'
  }
})

const onConfirm = () => {
  emit('confirm')
}

const onCancel = () => {
  if (!props.loading) {
    emit('cancel')
  }
}
</script>
