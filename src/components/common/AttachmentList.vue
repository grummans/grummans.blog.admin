<template>
  <div class="card">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
        📎 Attachments
        <span v-if="totalCount > 0" class="text-gray-500 dark:text-gray-400 font-normal">
          ({{ totalCount }})
        </span>
      </h3>
      <button
        v-if="!disabled"
        @click="openFileDialog"
        :disabled="uploading"
        class="text-xs text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ uploading ? 'Uploading...' : '+ Add file' }}
      </button>
    </div>

    <!-- Loading State (only for existing posts) -->
    <div v-if="loading && postId" class="text-center py-6">
      <div class="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Loading attachments...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="totalCount === 0" class="text-center py-6">
      <div class="text-gray-400 dark:text-gray-500 mb-2">
        <svg class="w-10 h-10 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </div>
      <p class="text-xs text-gray-500 dark:text-gray-400 mb-3">
        No attachments yet
      </p>
      <button
        v-if="!disabled"
        @click="openFileDialog"
        :disabled="uploading"
        class="text-xs text-primary-600 dark:text-primary-400 hover:underline"
      >
        Upload your first file
      </button>
    </div>

    <!-- Combined Attachments List (Pending + Uploaded) -->
    <div v-else class="space-y-2">
      <!-- Pending Files (New post or newly added) -->
      <div
        v-for="(pendingFile, index) in pendingFiles"
        :key="'pending-' + index"
        class="group flex items-center gap-3 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
      >
        <!-- File Icon with Pending Badge -->
        <div class="relative flex-shrink-0">
          <div
            :class="[
              'w-8 h-8 rounded-lg flex items-center justify-center text-sm',
              getFileTypeColor(getFileTypeFromExtension(pendingFile.name))
            ]"
          >
            {{ getFileIcon(getFileTypeFromExtension(pendingFile.name)) }}
          </div>
          <span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white dark:border-dark-800" title="Pending upload"></span>
        </div>

        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 dark:text-gray-100 truncate" :title="pendingFile.name">
            {{ pendingFile.name }}
          </p>
          <p class="text-xs text-amber-600 dark:text-amber-400">
            {{ formatFileSize(pendingFile.size) }}
            <span class="mx-1">•</span>
            <span class="italic">Will upload on save</span>
          </p>
        </div>

        <!-- Remove Button -->
        <button
          v-if="!disabled"
          @click="removePendingFile(index)"
          class="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/40"
          title="Remove"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Uploaded Attachments -->
      <div
        v-for="attachment in attachments"
        :key="attachment.id"
        class="group flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors"
      >
        <!-- File Icon -->
        <div
          :class="[
            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm',
            getFileTypeColor(attachment.fileType)
          ]"
        >
          {{ getFileIcon(attachment.fileType) }}
        </div>

        <!-- File Info -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-gray-900 dark:text-gray-100 truncate" :title="attachment.originalFileName">
            {{ attachment.originalFileName }}
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            {{ formatFileSize(attachment.fileSize) }}
            <span class="mx-1">•</span>
            {{ formatDate(attachment.uploadedAt) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <!-- Download Button -->
          <a
            :href="getDownloadUrl(attachment)"
            target="_blank"
            download
            class="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600"
            title="Download"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
          </a>

          <!-- Delete Button -->
          <button
            v-if="!disabled"
            @click="confirmDelete(attachment)"
            :disabled="deleting === attachment.id"
            class="p-1.5 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 disabled:opacity-50"
            title="Delete"
          >
            <svg v-if="deleting !== attachment.id" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Upload Progress -->
    <div v-if="uploading" class="mt-3 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
      <div class="flex items-center gap-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
        <span class="text-sm text-primary-700 dark:text-primary-300">
          Uploading {{ uploadingFileName }}...
        </span>
      </div>
    </div>

    <!-- Pending Files Notice -->
    <div v-if="pendingFiles.length > 0 && !uploading" class="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
      <p class="text-xs text-amber-700 dark:text-amber-300">
        <strong>{{ pendingFiles.length }} file(s)</strong> will be uploaded when you save the post.
      </p>
    </div>

    <!-- Supported Files Hint -->
    <div v-if="totalCount > 0" class="mt-3 pt-3 border-t border-gray-100 dark:border-dark-700">
      <p class="text-xs text-gray-400 dark:text-gray-500">
        Supports: Images, PDFs, Documents, Archives, Code files
      </p>
    </div>

    <!-- Delete Confirmation Dialog -->
    <ConfirmDialog
      :visible="showDeleteConfirm"
      title="Delete Attachment"
      :message="`Are you sure you want to delete '${attachmentToDelete?.originalFileName}'? This action cannot be undone.`"
      type="danger"
      confirmText="Delete"
      cancelText="Cancel"
      @confirm="deleteAttachment"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import {
  attachmentService,
  formatFileSize,
  getFileIcon,
  getFileTypeColor,
  getFileTypeFromExtension,
  validateAttachment,
  type PostAttachment,
} from '@/services/attachmentService'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  postId: string | null
  disabled?: boolean
}>()

const emit = defineEmits<{
  (e: 'update', attachments: PostAttachment[]): void
  (e: 'pending-change', files: File[]): void
}>()

const toast = useToast()

// State
const attachments = ref<PostAttachment[]>([])
const pendingFiles = ref<File[]>([])  // Files waiting to be uploaded (for new posts)
const loading = ref(false)
const uploading = ref(false)
const uploadingFileName = ref('')
const deleting = ref<number | null>(null)
const showDeleteConfirm = ref(false)
const attachmentToDelete = ref<PostAttachment | null>(null)

// Computed
const totalCount = computed(() => attachments.value.length + pendingFiles.value.length)

// Format date helper
function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

// Get download URL
function getDownloadUrl(attachment: PostAttachment): string {
  return attachmentService.getDownloadUrl(attachment)
}

// Load attachments (only for existing posts)
async function loadAttachments() {
  if (!props.postId) {
    attachments.value = []
    return
  }
  
  loading.value = true
  try {
    attachments.value = await attachmentService.getAll(props.postId)
    emit('update', attachments.value)
  } catch (error: any) {
    console.error('Failed to load attachments:', error)
    // Don't show error toast if it's just empty
    if (error.response?.status !== 404) {
      toast.error('Failed to load attachments')
    }
  } finally {
    loading.value = false
  }
}

// Open file dialog
function openFileDialog() {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = true
  input.accept = '.jpg,.jpeg,.png,.gif,.webp,.svg,.bmp,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx,.zip,.rar,.7z,.tar,.gz,.json,.xml,.yaml,.yml,.csv,.sql,.js,.ts,.py,.java'
  
  input.onchange = async (e) => {
    const files = (e.target as HTMLInputElement).files
    if (!files || files.length === 0) return
    
    for (const file of Array.from(files)) {
      await handleFileAdd(file)
    }
  }
  
  input.click()
}

// Handle file add - either queue for later or upload immediately
async function handleFileAdd(file: File) {
  // Validate file first
  const validation = validateAttachment(file)
  if (!validation.valid) {
    toast.error(validation.error || 'Invalid file')
    return
  }
  
  if (props.postId) {
    // Existing post - upload immediately
    await uploadFile(file)
  } else {
    // New post - queue for later upload
    pendingFiles.value.push(file)
    emit('pending-change', pendingFiles.value)
    toast.info(`"${file.name}" will be uploaded when you save the post`)
  }
}

// Upload single file (for existing posts)
async function uploadFile(file: File) {
  if (!props.postId) return
  
  uploading.value = true
  uploadingFileName.value = file.name
  
  try {
    const attachment = await attachmentService.upload(props.postId, file)
    attachments.value.push(attachment)
    emit('update', attachments.value)
    toast.success(`Uploaded "${file.name}" successfully`)
  } catch (error: any) {
    console.error('Failed to upload attachment:', error)
    toast.error(error.message || `Failed to upload "${file.name}"`)
  } finally {
    uploading.value = false
    uploadingFileName.value = ''
  }
}

// Upload all pending files (called from parent after post is created)
async function uploadPendingFiles(postId: string): Promise<{ success: number; failed: number }> {
  let success = 0
  let failed = 0
  
  for (const file of pendingFiles.value) {
    uploading.value = true
    uploadingFileName.value = file.name
    
    try {
      const attachment = await attachmentService.upload(postId, file)
      attachments.value.push(attachment)
      success++
    } catch (error: any) {
      console.error(`Failed to upload ${file.name}:`, error)
      failed++
    }
  }
  
  uploading.value = false
  uploadingFileName.value = ''
  pendingFiles.value = []
  emit('pending-change', [])
  emit('update', attachments.value)
  
  return { success, failed }
}

// Remove pending file
function removePendingFile(index: number) {
  const file = pendingFiles.value[index]
  if (file) {
    pendingFiles.value.splice(index, 1)
    emit('pending-change', pendingFiles.value)
    toast.info(`Removed "${file.name}" from queue`)
  }
}

// Get pending files (for parent component)
function getPendingFiles(): File[] {
  return pendingFiles.value
}

// Check if has pending files
function hasPendingFiles(): boolean {
  return pendingFiles.value.length > 0
}

// Clear pending files
function clearPendingFiles() {
  pendingFiles.value = []
  emit('pending-change', [])
}

// Confirm delete
function confirmDelete(attachment: PostAttachment) {
  attachmentToDelete.value = attachment
  showDeleteConfirm.value = true
}

// Delete attachment
async function deleteAttachment() {
  if (!attachmentToDelete.value || !props.postId) return
  
  const attachment = attachmentToDelete.value
  showDeleteConfirm.value = false
  deleting.value = attachment.id
  
  try {
    await attachmentService.delete(props.postId, attachment.id)
    attachments.value = attachments.value.filter(a => a.id !== attachment.id)
    emit('update', attachments.value)
    toast.success(`Deleted "${attachment.originalFileName}"`)
  } catch (error: any) {
    console.error('Failed to delete attachment:', error)
    toast.error(error.message || 'Failed to delete attachment')
  } finally {
    deleting.value = null
    attachmentToDelete.value = null
  }
}

// Watch for postId changes
watch(() => props.postId, (newId, oldId) => {
  if (newId && newId !== oldId) {
    loadAttachments()
  } else if (!newId) {
    attachments.value = []
  }
})

// Load on mount if postId is available
onMounted(() => {
  if (props.postId) {
    loadAttachments()
  }
})

// Expose methods to parent component
defineExpose({
  refresh: loadAttachments,
  uploadPendingFiles,
  getPendingFiles,
  hasPendingFiles,
  clearPendingFiles,
})
</script>
