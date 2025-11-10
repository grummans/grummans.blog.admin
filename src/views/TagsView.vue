<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Tags</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Manage post tags for better organization</p>
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
          class="group relative inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-full transition-colors"
        >
          <span class="font-medium text-gray-900 dark:text-gray-100">{{ tag.name }}</span>
          <span class="text-xs text-gray-500 dark:text-gray-400">{{ tag.postCount }}</span>
          
          <!-- Actions (shown on hover) -->
          <div class="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click="openEditModal(tag)"
              class="p-1 hover:bg-gray-300 dark:hover:bg-dark-500 rounded"
              title="Edit"
            >
              <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              @click="deleteTag(tag)"
              class="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
              title="Delete"
            >
              <svg class="w-3 h-3 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
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
            >
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
            >
              {{ editingTag ? 'Update' : 'Create' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockTags } from '@/mock/data'
import type { Tag } from '@/mock/data'

const tags = ref([...mockTags])
const searchQuery = ref('')
const showModal = ref(false)
const editingTag = ref<Tag | null>(null)

const formData = ref({
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

const openCreateModal = () => {
  editingTag.value = null
  formData.value = {
    name: '',
    slug: '',
  }
  showModal.value = true
}

const openEditModal = (tag: Tag) => {
  editingTag.value = tag
  formData.value = {
    name: tag.name,
    slug: tag.slug,
  }
  showModal.value = true
}

const autoGenerateSlug = () => {
  if (!editingTag.value) {
    formData.value.slug = formData.value.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
}

const saveTag = () => {
  if (editingTag.value) {
    // Update existing
    const index = tags.value.findIndex(t => t.id === editingTag.value!.id)
    if (index !== -1) {
      tags.value[index] = {
        ...tags.value[index]!,
        name: formData.value.name,
        slug: formData.value.slug,
      }
    }
  } else {
    // Create new
    const newTag: Tag = {
      id: String(tags.value.length + 1),
      ...formData.value,
      postCount: 0,
    }
    tags.value.push(newTag)
  }

  showModal.value = false
}

const deleteTag = (tag: Tag) => {
  if (tag.postCount > 0) {
    if (!confirm(`This tag is used in ${tag.postCount} posts. Delete anyway?`)) {
      return
    }
  } else {
    if (!confirm(`Delete "${tag.name}"?`)) {
      return
    }
  }
  
  tags.value = tags.value.filter(t => t.id !== tag.id)
}
</script>
