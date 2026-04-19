<template>
  <div class="md-editor-wrapper">
    <MdEditor
      v-model="internalValue"
      :theme="isDark ? 'dark' : 'light'"
      language="en-US"
      @onUploadImg="onUploadImg"
      class="custom-md-editor"
      :toolbars="toolbars"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { mediaService } from '@/services/mediaService'
import { useToast } from '@/composables/useToast'
import type { ToolbarNames } from 'md-editor-v3'

interface Props {
  modelValue: string
  placeholder?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Start writing your post...'
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const toast = useToast()

const internalValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  if (val !== internalValue.value) {
    internalValue.value = val
  }
})

watch(internalValue, (val) => {
  emit('update:modelValue', val)
})

const isDark = ref(document.documentElement.classList.contains('dark'))

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.attributeName === 'class') {
      isDark.value = document.documentElement.classList.contains('dark')
    }
  })
})

onMounted(() => {
  observer.observe(document.documentElement, { attributes: true })
})

onUnmounted(() => {
  observer.disconnect()
})

const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  const urls = await Promise.all(
    files.map(async (file) => {
      const validation = mediaService.validateImage(file)
      if (!validation.valid) {
        toast.error(validation.error || 'Invalid image file')
        return ''
      }
      try {
        const url = await mediaService.upload(file)
        return url
      } catch (error: any) {
        toast.error(error.message || 'Failed to upload image')
        return ''
      }
    })
  )
  callback(urls.filter(url => url !== ''))
}

const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'htmlPreview',
  'catalog',
]
</script>

<style scoped>
.md-editor-wrapper {
  @apply rounded-lg overflow-hidden border border-dark-300 dark:border-dark-700;
}
.custom-md-editor {
  min-height: 400px;
}
</style>
