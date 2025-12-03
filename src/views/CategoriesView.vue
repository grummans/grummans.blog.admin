<template>
  <div class="relative">
    <!-- Loading Overlay -->
    <LoadingOverlay :visible="loading" message="Loading categories..." />

    <!-- Delete Confirm Dialog -->
    <ConfirmDialog
      v-if="categoryToDelete"
      :visible="showDeleteConfirm"
      title="Delete Category"
      :message="`Are you sure you want to delete '${categoryToDelete.name}'?${categoryToDelete.postCount ? ` This category has ${categoryToDelete.postCount} post${categoryToDelete.postCount > 1 ? 's' : ''}.` : ''}`"
      type="danger"
      confirmText="Yes, Delete"
      cancelText="Cancel"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />

    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="page-title text-3xl">Categories</h1>
        <p class="mt-2 text-muted">Organize your posts by categories</p>
      </div>
      <button
        @click="openCreateModal"
        class="btn btn-primary"
      >
        <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Category
      </button>
    </div>

    <!-- Categories List -->
    <div class="card">
      <div class="space-y-4">
        <div
          v-for="category in categories"
          :key="category.id"
          class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-dark-600 cursor-pointer"
          @click="viewCategoryPosts(category)"
        >
          <!-- Icon -->
          <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg text-heading">
              {{ category.name }}
            </h3>
            <p class="text-sm text-muted">
              {{ category.description }}
            </p>
            <div class="mt-1 flex items-center gap-3 text-xs text-muted">
              <span>Slug: {{ category.slug }}</span>
              <span>•</span>
              <span>{{ category.postCount }} posts</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click.stop="openEditModal(category)"
              class="btn-icon-sm hover:bg-gray-200 dark:hover:bg-dark-600"
              title="Edit"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click.stop="deleteCategory(category)"
              class="btn-icon-sm hover:bg-red-100 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="categories.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No categories</h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Create your first category to organize posts.</p>
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
        class="bg-white dark:bg-dark-800 rounded-lg max-w-lg w-full p-6"
        @click.stop
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          {{ editingCategory ? 'Edit Category' : 'Create Category' }}
        </h2>

        <form @submit.prevent="saveCategory" class="space-y-4">
          <div>
            <label class="label">
              Name *
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              class="input"
              placeholder="Category name"
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
              placeholder="category-slug"
            />
          </div>

          <div>
            <label class="label">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="input resize-none"
              placeholder="Brief description of this category"
            />
          </div>

          <div>
            <label class="label">
              Color
            </label>
            <input
              v-model="formData.color"
              type="color"
              class="h-10 w-full rounded-lg cursor-pointer"
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
              {{ saving ? 'Saving...' : (editingCategory ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categoryService, generateSlug, type Category, type CategoryRequest } from '@/services/categoryService'
import { useToast } from '@/composables/useToast'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'

const router = useRouter()
const toast = useToast()

const categories = ref<Category[]>([])
const showModal = ref(false)
const editingCategory = ref<Category | null>(null)
const editingCategoryId = ref<number | null>(null)
const loading = ref(false)
const saving = ref(false)
const showDeleteConfirm = ref(false)
const categoryToDelete = ref<Category | null>(null)

const formData = ref<CategoryRequest>({
  name: '',
  slug: '',
  description: '',
  color: '#3B82F6',
})

// Load categories from API
const loadCategories = async () => {
  loading.value = true
  try {
    categories.value = await categoryService.getAll()
  } catch (error: any) {
    toast.error(error.message || 'Failed to load categories')
    console.error('Error loading categories:', error)
  } finally {
    loading.value = false
  }
}

const openCreateModal = () => {
  editingCategory.value = null
  editingCategoryId.value = null
  formData.value = {
    name: '',
    slug: '',
    description: '',
    color: '#3B82F6',
  }
  showModal.value = true
}

const openEditModal = async (category: Category) => {
  editingCategoryId.value = category.id
  
  loading.value = true
  try {
    const fullCategory = await categoryService.getById(category.id)
    editingCategory.value = fullCategory
    formData.value = {
      name: fullCategory.name,
      slug: fullCategory.slug,
      description: fullCategory.description || '',
      color: fullCategory.color || '#3B82F6',
    }
    showModal.value = true
  } catch (error: any) {
    toast.error(error.message || 'Failed to load category details')
  } finally {
    loading.value = false
  }
}

const autoGenerateSlug = () => {
  if (!editingCategory.value) {
    formData.value.slug = generateSlug(formData.value.name)
  }
}

const saveCategory = async () => {
  // Validate
  if (!formData.value.name.trim()) {
    toast.warning('Category name is required')
    return
  }
  if (!formData.value.slug.trim()) {
    toast.warning('Category slug is required')
    return
  }

  saving.value = true
  try {
    if (editingCategoryId.value) {
      // Update existing
      await categoryService.update(editingCategoryId.value, formData.value)
      toast.success('Category updated successfully')
    } else {
      // Create new
      await categoryService.create(formData.value)
      toast.success('Category created successfully')
    }
    
    showModal.value = false
    await loadCategories()
  } catch (error: any) {
    toast.error(error.message || 'Failed to save category')
    console.error('Error saving category:', error)
  } finally {
    saving.value = false
  }
}

const deleteCategory = (category: Category) => {
  categoryToDelete.value = category
  showDeleteConfirm.value = true
}

const confirmDelete = async () => {
  if (!categoryToDelete.value) return
  
  showDeleteConfirm.value = false
  try {
    await categoryService.delete(categoryToDelete.value.id)
    toast.success('Category deleted successfully')
    await loadCategories()
  } catch (error: any) {
    toast.error(error.message || 'Failed to delete category')
  } finally {
    categoryToDelete.value = null
  }
}

// Load on mount
onMounted(() => {
  loadCategories()
})

// Navigate to posts filtered by category
const viewCategoryPosts = (category: Category) => {
  router.push({
    path: '/posts',
    query: { category: String(category.id) }
  })
}
</script>
