<template>
  <div class="relative">
    <!-- Loading Overlay -->
    <LoadingOverlay :visible="loading" message="Loading tags..." />

    <!-- Delete Confirm Dialog -->
    <ConfirmDialog
      v-if="tagToDelete"
      :visible="showDeleteConfirm"
      title="Delete Tag"
      :message="`Are you sure you want to delete '${tagToDelete.name}'?${tagToDelete.postCount ? ` This tag is used in ${tagToDelete.postCount} post${tagToDelete.postCount > 1 ? 's' : ''}.` : ''}`"
      type="danger"
      confirmText="Yes, Delete"
      cancelText="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="page-title text-3xl">Tags</h1>
        <p class="mt-2 text-muted">Manage post tags for better organization</p>
      </div>
      <button
        @click="openCreateModal"
        class="btn btn-primary"
      >
        <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Tag
      </button>
    </div>

    <!-- Search -->
    <div class="card mb-6">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search tags..."
        class="input text-sm"
      />
    </div>

    <!-- Tags Grid -->
    <div class="card">
      <div class="flex flex-wrap gap-3">
        <div
          v-for="tag in filteredTags"
          :key="tag.id"
          class="group relative inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-full transition-colors cursor-pointer"
          @click="viewTagPosts(tag)"
        >
          <span class="font-medium text-heading">{{ tag.name }}</span>
          <span class="text-xs text-muted">{{ tag.postCount ?? 0 }} posts</span>
          
          <!-- Actions (shown on hover) -->
          <div class="flex gap-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="openEditModal(tag)"
              class="p-1 hover:bg-gray-300 dark:hover:bg-dark-500 rounded"
              title="Edit"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click.stop="deleteTag(tag)"
              class="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
              title="Delete"
            >
              <svg class="w-3.5 h-3.5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredTags.length === 0" class="w-full text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No tags found</h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">
            {{ searchQuery ? 'Try a different search term.' : 'Create your first tag.' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Create/Edit Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click="showModal = false"
    >
      <div
        class="bg-white dark:bg-dark-800 rounded-lg max-w-md w-full p-6"
        @click.stop
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {{ editingTag ? 'Edit Tag' : 'Create Tag' }}
        </h2>

        <form @submit.prevent="saveTag" class="space-y-4">
          <div>
            <label class="label">
              Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="input"
              placeholder="Tag name"
              @input="autoGenerateSlug"
            />
          </div>

          <div>
            <label class="label">
              Slug *
            </label>
            <input
              v-model="formData.slug"
              type="text"
              required
              class="input"
              placeholder="tag-slug"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="btn btn-secondary"
              :disabled="saving"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="saving"
            >
              {{ saving ? 'Saving...' : (editingTag ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { tagService, generateSlug, type Tag, type TagRequest } from '@/services/tagService'
import { useToast } from '@/composables/useToast'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const router = useRouter()
const toast = useToast()

const tags = ref<Tag[]>([])
const searchQuery = ref('')
const showModal = ref(false)
const editingTag = ref<Tag | null>(null)
const editingTagId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const showDeleteConfirm = ref(false)
const tagToDelete = ref<Tag | null>(null)

const formData = ref<TagRequest>({
  name: '',
  slug: '',
})

const filteredTags = computed(() => {
  if (!searchQuery.value) return tags.value

  const query = searchQuery.value.toLowerCase()
  return tags.value.filter(tag =>
    tag.name.toLowerCase().includes(query) ||
    tag.slug.toLowerCase().includes(query)
  )
})

// Load tags from API
const loadTags = async () => {
  loading.value = true
  try {
    tags.value = await tagService.getAll()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load tags')
    console.error('Error loading tags:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingTag.value = null
  editingTagId.value = null
  formData.value = {
    name: '',
    slug: '',
  }
  showModal.value = true
}

const openEditModal = async (tag: Tag) => {
  editingTagId.value = tag.id
  
  loading.value = true
  try {
    const fullTag = await tagService.getById(tag.id)
    editingTag.value = fullTag
    formData.value = {
      name: fullTag.name,
      slug: fullTag.slug,
    }
    showModal.value = true
  } catch (error: any) {
    toast.error(error.message || 'Failed to load tag details')
  } finally {
    loading.value = false
  }
}

const autoGenerateSlug = () => {
  if (!editingTag.value) {
    formData.value.slug = generateSlug(formData.value.name)
  }
}

const saveTag = async () => {
  // Validate
  if (!formData.value.name.trim()) {
    toast.warning('Tag name is required')
    return
  }
  if (!formData.value.slug.trim()) {
    toast.warning('Tag slug is required')
    return
  }

  saving.value = true
  try {
    if (editingTagId.value) {
      // Update existing
      await tagService.update(editingTagId.value, formData.value)
      toast.success('Tag updated successfully')
    } else {
      // Create new
      await tagService.create(formData.value)
      toast.success('Tag created successfully')
    }
    
    showModal.value = false
    await loadTags()
  } catch (error: any) {
    toast.error(error.message || 'Failed to save tag')
    console.error('Error saving tag:', error)
  } finally {
    saving.value = false
  }
}

const deleteTag = (tag: Tag) => {
  tagToDelete.value = tag
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!tagToDelete.value) return
  
  showDeleteConfirm.value = false
  try {
    await tagService.delete(tagToDelete.value.id)
    toast.success('Tag deleted successfully')
    await loadTags()
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete tag')
  } finally {
    tagToDelete.value = null
  }
}

// Load on mount
onMounted(() => {
  loadTags()
})

// Navigate to posts filtered by tag
const viewTagPosts = (tag: Tag) => {
  router.push({
    path: '/posts',
    query: { tag: String(tag.id) }
  })
}
</script>
