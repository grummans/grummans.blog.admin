<template>
  <div class="tiptap-editor">
    <PromptDialog
      :visible="showLinkPrompt"
      title="Add Link"
      message="Paste or type the URL for this link"
      placeholder="https://example.com"
      :initial-value="pendingLinkUrl"
      confirm-text="Apply"
      cancel-text="Cancel"
      @confirm="applyLink"
      @cancel="showLinkPrompt = false"
    />

    <!-- Toolbar -->
    <div v-if="editor" class="editor-toolbar">
      <!-- Text Formatting -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBold().run()"
          :class="{ 'is-active': editor.isActive('bold') }"
          class="toolbar-btn"
          title="Bold (Ctrl+B)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z" />
          </svg>
        </button>
        
        <button
          @click="editor.chain().focus().toggleItalic().run()"
          :class="{ 'is-active': editor.isActive('italic') }"
          class="toolbar-btn"
          title="Italic (Ctrl+I)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 4h4m-4 16h4m-1-16l-2 16" />
          </svg>
        </button>
        
        <button
          @click="editor.chain().focus().toggleStrike().run()"
          :class="{ 'is-active': editor.isActive('strike') }"
          class="toolbar-btn"
          title="Strikethrough"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12h18M9 5l6 14M15 5l-6 14" />
          </svg>
        </button>
        
        <button
          @click="editor.chain().focus().toggleCode().run()"
          :class="{ 'is-active': editor.isActive('code') }"
          class="toolbar-btn"
          title="Inline Code"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </button>
      </div>

      <div class="toolbar-divider" />

      <!-- Headings -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleHeading({ level: 1 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 1 }) }"
          class="toolbar-btn"
          title="Heading 1"
        >
          H1
        </button>
        
        <button
          @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 2 }) }"
          class="toolbar-btn"
          title="Heading 2"
        >
          H2
        </button>
        
        <button
          @click="editor.chain().focus().toggleHeading({ level: 3 }).run()"
          :class="{ 'is-active': editor.isActive('heading', { level: 3 }) }"
          class="toolbar-btn"
          title="Heading 3"
        >
          H3
        </button>
      </div>

      <div class="toolbar-divider" />

      <!-- Lists -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().toggleBulletList().run()"
          :class="{ 'is-active': editor.isActive('bulletList') }"
          class="toolbar-btn"
          title="Bullet List"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        
        <button
          @click="editor.chain().focus().toggleOrderedList().run()"
          :class="{ 'is-active': editor.isActive('orderedList') }"
          class="toolbar-btn"
          title="Numbered List"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18M3 12h18M3 20h18" />
          </svg>
        </button>
        
        <button
          @click="editor.chain().focus().toggleBlockquote().run()"
          :class="{ 'is-active': editor.isActive('blockquote') }"
          class="toolbar-btn"
          title="Blockquote"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </button>
        
        <button
          @click="editor.chain().focus().toggleCodeBlock().run()"
          :class="{ 'is-active': editor.isActive('codeBlock') }"
          class="toolbar-btn"
          title="Code Block"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <div class="toolbar-divider" />

      <!-- Link & Media -->
      <div class="toolbar-group">
        <button
          @click="setLink"
          :class="{ 'is-active': editor.isActive('link') }"
          class="toolbar-btn"
          title="Add Link"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        </button>
        
        <button
          @click="addImage"
          class="toolbar-btn"
          title="Add Image"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
        
        <button
          @click="addFile"
          class="toolbar-btn"
          title="Upload File (PDF, Documents, etc.)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      <div class="toolbar-divider" />

      <!-- Undo/Redo -->
      <div class="toolbar-group">
        <button
          @click="editor.chain().focus().undo().run()"
          :disabled="!editor.can().undo()"
          class="toolbar-btn"
          title="Undo (Ctrl+Z)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
          </svg>
        </button>
        
        <button
          @click="editor.chain().focus().redo().run()"
          :disabled="!editor.can().redo()"
          class="toolbar-btn"
          title="Redo (Ctrl+Y)"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 10H11a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Editor Content -->
    <div class="relative">
      <editor-content :editor="editor" class="editor-content" />
      
      <!-- Upload indicator -->
      <div v-if="uploading" class="absolute inset-0 bg-dark-50/80 dark:bg-dark-900/80 flex items-center justify-center backdrop-blur-sm">
        <div class="text-center">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-2"></div>
          <p class="text-sm text-dark-600 dark:text-dark-400">Uploading file...</p>
        </div>
      </div>
    </div>

    <!-- Character Count -->
    <div v-if="editor" class="editor-footer">
      <span class="text-xs text-dark-600 dark:text-dark-400">
        {{ editor.storage.characterCount.characters() }} characters
        • {{ editor.storage.characterCount.words() }} words
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onBeforeUnmount, watch } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CharacterCount from '@tiptap/extension-character-count'
import { mediaService } from '@/services/mediaService'
import PromptDialog from '@/components/common/PromptDialog.vue'
import { useToast } from '@/composables/useToast'

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

const uploading = ref(false)
const uploadProgress = ref(0)
const showLinkPrompt = ref(false)
const pendingLinkUrl = ref('')

const editor = useEditor({
  content: props.modelValue,
  extensions: [
    StarterKit,
    Image,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: {
        class: 'text-primary-600 dark:text-primary-400 underline hover:text-primary-700',
      },
    }),
    Placeholder.configure({
      placeholder: props.placeholder,
    }),
    CharacterCount,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[400px] p-4',
    },
    // Handle dropped files
    handleDrop(view, event, slice, moved) {
      if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length > 0) {
        event.preventDefault()
        const files = Array.from(event.dataTransfer.files)
        
        files.forEach(file => {
          const category = mediaService.getFileCategory(file)
          if (category === 'image') {
            uploadAndInsertImage(file, view.state.selection.from)
          } else {
            uploadAndInsertFile(file, view.state.selection.from)
          }
        })
        
        return files.length > 0
      }
      return false
    },
    // Handle pasted files
    handlePaste(view, event) {
      const items = event.clipboardData?.items
      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i]
          if (item && item.type.startsWith('image/')) {
            event.preventDefault()
            const file = item.getAsFile()
            if (file) {
              uploadAndInsertImage(file, view.state.selection.from)
            }
            return true
          }
        }
      }
      return false
    },
  },
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

// Watch for external changes
watch(() => props.modelValue, (value) => {
  const isSame = editor.value?.getHTML() === value
  if (!isSame && editor.value) {
    editor.value.commands.setContent(value)
  }
})

// Link functions
const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href
  pendingLinkUrl.value = previousUrl ?? ''
  showLinkPrompt.value = true
}

const applyLink = (url: string) => {
  const value = url.trim()

  if (!value) {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run()
    showLinkPrompt.value = false
    return
  }

  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: value }).run()
  showLinkPrompt.value = false
}

// Upload and insert image
const uploadAndInsertImage = async (file: File, pos?: number) => {
  // Validate image
  const validation = mediaService.validateImage(file)
  if (!validation.valid) {
    toast.error(validation.error || 'Invalid image file')
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    // Upload to server and get URL
    const url = await mediaService.upload(file, (percent) => {
      uploadProgress.value = percent
    })
    
    // Insert image into editor
    if (pos !== undefined) {
      editor.value?.chain().focus().insertContentAt(pos, {
        type: 'image',
        attrs: { src: url, alt: file.name }
      }).run()
    } else {
      editor.value?.chain().focus().setImage({ src: url, alt: file.name }).run()
    }
  } catch (error: any) {
    console.error('Image upload failed:', error)
    toast.error(error.message || 'Failed to upload image')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Upload and insert file (non-image)
const uploadAndInsertFile = async (file: File, pos?: number) => {
  // Validate file
  const validation = mediaService.validateFile(file)
  if (!validation.valid) {
    toast.error(validation.error || 'Invalid file')
    return
  }

  uploading.value = true
  uploadProgress.value = 0

  try {
    // Upload to server and get URL
    const url = await mediaService.upload(file, (percent) => {
      uploadProgress.value = percent
    })
    
    const category = mediaService.getFileCategory(file)
    const fileSize = mediaService.formatFileSize(file.size)
    
    // Create a nice file link with icon
    const fileIcon = getFileIcon(category)
    const linkText = `${fileIcon} ${file.name} (${fileSize})`
    
    if (pos !== undefined) {
      editor.value?.chain().focus().insertContentAt(pos, `<p><a href="${url}" target="_blank" rel="noopener noreferrer" class="file-link">${linkText}</a></p>`).run()
    } else {
      editor.value?.chain().focus().insertContent(`<p><a href="${url}" target="_blank" rel="noopener noreferrer" class="file-link">${linkText}</a></p>`).run()
    }
  } catch (error: any) {
    console.error('File upload failed:', error)
    toast.error(error.message || 'Failed to upload file')
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

// Get icon for file type
const getFileIcon = (category: string): string => {
  const icons: Record<string, string> = {
    document: '📄',
    video: '🎥',
    audio: '🎵',
    archive: '📦',
    other: '📎'
  }
  return icons[category] || '📎'
}

// Add image via file picker
const addImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.multiple = false
  
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      uploadAndInsertImage(file)
    }
  }
  
  input.click()
}

// Add file via file picker (documents, videos, etc.)
const addFile = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar,.7z,.mp4,.mov,.avi,.mp3,.wav'
  input.multiple = false
  
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) {
      uploadAndInsertFile(file)
    }
  }
  
  input.click()
}

onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<style scoped>
.tiptap-editor {
  @apply border border-dark-300 dark:border-dark-700 rounded-lg bg-dark-50 dark:bg-dark-900 overflow-hidden;
}

.editor-toolbar {
  @apply flex items-center gap-1 p-2 border-b border-dark-300 dark:border-dark-700 bg-dark-100 dark:bg-dark-900 flex-wrap;
}

.toolbar-group {
  @apply flex items-center gap-1;
}

.toolbar-divider {
  @apply w-px h-6 bg-dark-300 dark:bg-dark-600 mx-1;
}

.toolbar-btn {
  @apply px-2 py-1.5 rounded text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 transition-colors font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed;
}

.toolbar-btn.is-active {
  @apply bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400;
}

.editor-content {
  @apply bg-dark-50 dark:bg-dark-900;
}

.editor-footer {
  @apply px-4 py-2 border-t border-dark-300 dark:border-dark-700 bg-dark-100 dark:bg-dark-900;
}

/* TipTap prose styling */
:deep(.ProseMirror) {
  @apply focus:outline-none;
}

:deep(.ProseMirror p.is-editor-empty:first-child::before) {
  @apply text-dark-500 dark:text-dark-500;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

:deep(.ProseMirror img) {
  @apply rounded-lg max-w-full h-auto my-4;
}

:deep(.ProseMirror code) {
  @apply bg-dark-100 dark:bg-dark-700 px-1.5 py-0.5 rounded text-sm;
}

:deep(.ProseMirror pre) {
  @apply bg-zinc-900 dark:bg-zinc-950 text-stone-100 p-4 rounded-lg overflow-x-auto;
}

:deep(.ProseMirror pre code) {
  @apply bg-transparent p-0;
}

:deep(.ProseMirror blockquote) {
  @apply border-l-4 border-dark-300 dark:border-dark-600 pl-4 italic text-dark-700 dark:text-dark-300;
}

:deep(.ProseMirror a.file-link) {
  @apply inline-flex items-center gap-2 px-3 py-2 bg-dark-100 dark:bg-dark-700 rounded-lg hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors no-underline text-dark-900 dark:text-dark-100;
}
</style>
