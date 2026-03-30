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
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      >
        <div class="bg-white dark:bg-dark-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4 max-w-sm mx-4">
          <div class="relative">
            <div class="w-16 h-16 border-4 border-primary-200 dark:border-primary-900 rounded-full"></div>
            <div class="absolute inset-0 w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <div class="text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ message }}
            </h3>
            <p v-if="subtitle" class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ subtitle }}
            </p>
            <p v-if="showTimer" class="text-xs text-gray-400 dark:text-gray-500 mt-3 font-mono">
              Elapsed: {{ elapsedTime }}s
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'

interface Props {
  visible: boolean
  message?: string
  subtitle?: string
  showTimer?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  message: 'Loading...',
  subtitle: 'Please wait, this may take a moment...',
  showTimer: true,
})

const elapsedTime = ref(0)
let elapsedTimer: ReturnType<typeof setInterval> | null = null

const startTimer = () => {
  elapsedTime.value = 0
  elapsedTimer = setInterval(() => {
    elapsedTime.value++
  }, 1000)
}

const stopTimer = () => {
  if (elapsedTimer) {
    clearInterval(elapsedTimer)
    elapsedTimer = null
  }
}

// Watch visible prop to start/stop timer
watch(() => props.visible, (newVal) => {
  if (newVal) {
    startTimer()
  } else {
    stopTimer()
  }
}, { immediate: true })

onUnmounted(() => {
  stopTimer()
})
</script>
