<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Categories</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Organize your posts by categories</p>
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
          class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-dark-600"
        >
          <!-- Icon -->
          <div class="w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>

          <!-- Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ category.name }}
            </h3>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ category.description }}
            </p>
            <div class="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
              <span>Slug: {{ category.slug }}</span>
              <span>•</span>
              <span>{{ category.postCount }} posts</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-2">
            <button
              @click="openEditModal(category)"
              class="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
              title="Edit"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteCategory(category)"
              class="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              v-model="formData.description"
              rows="3"
              class="input resize-none"
              placeholder="Brief description of this category"
            />
          </div>

          <div class="flex justify-end gap-3 pt-4">
            <button
              type="button"
              @click="showModal = false"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ editingCategory ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockCategories } from '@/mock/data'
import type { Category } from '@/mock/data'

const categories = ref([...mockCategories])
const showModal = ref(false)
const editingCategory = ref<Category | null>(null)

const formData = ref({
  name: '',
  slug: '',
  description: '',
})

const openCreateModal = () => {
  editingCategory.value = null
  formData.value = {
    name: '',
    slug: '',
    description: '',
  }
  showModal.value = true
}

const openEditModal = (category: Category) => {
  editingCategory.value = category
  formData.value = {
    name: category.name,
    slug: category.slug,
    description: category.description,
  }
  showModal.value = true
}

const autoGenerateSlug = () => {
  if (!editingCategory.value) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const saveCategory = () => {
  if (editingCategory.value) {
    // Update existing
    const index = categories.value.findIndex(c => c.id === editingCategory.value!.id)
    if (index !== -1) {
      categories.value[index] = {
        ...categories.value[index]!,
        name: formData.value.name,
        slug: formData.value.slug,
        description: formData.value.description,
      }
    }
  } else {
    // Create new
    const newCategory: Category = {
      id: String(categories.value.length + 1),
      ...formData.value,
      postCount: 0,
    }
    categories.value.push(newCategory)
  }

  showModal.value = false
}

const deleteCategory = (category: Category) => {
  if (category.postCount > 0) {
    if (!confirm(`This category has ${category.postCount} posts. Delete anyway?`)) {
      return
    }
  } else {
    if (!confirm(`Delete "${category.name}"?`)) {
      return
    }
  }
  
  categories.value = categories.value.filter(c => c.id !== category.id)
}
</script>
