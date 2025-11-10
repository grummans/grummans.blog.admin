<template>
  <div>
    <!-- Header -->
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Media Library</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Upload and manage your media files</p>
      </div>
      <button
        @click="showUploadModal = true"
        class="btn btn-primary"
      >
        <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Upload Media
      </button>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search media..."
            class="input text-sm"
          />
        </div>
        <select v-model="filterType" class="input text-sm w-auto">
          <option value="">All Types</option>
          <option value="image">Images</option>
          <option value="video">Videos</option>
          <option value="document">Documents</option>
        </select>
        <div class="flex gap-2">
          <button
            @click="viewMode = 'grid'"
            :class="viewMode === 'grid' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600'"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            @click="viewMode = 'list'"
            :class="viewMode === 'list' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' : 'text-gray-600'"
            class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-700 transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Media Grid -->
    <div class="card">
      <!-- Grid View -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div
          v-for="media in filteredMedia"
          :key="media.id"
          class="group relative aspect-square bg-gray-100 dark:bg-dark-700 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
          @click="selectMedia(media)"
        >
          <img
            :src="media.url"
            :alt="media.name"
            class="w-full h-full object-cover"
          />
          
          <!-- Overlay -->
          <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-end p-3">
            <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <p class="text-xs font-medium truncate">{{ media.name }}</p>
              <p class="text-xs opacity-75">{{ formatFileSize(media.size) }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              @click.stop="copyUrl(media)"
              class="p-1.5 bg-white dark:bg-dark-800 rounded shadow-lg hover:bg-gray-100 dark:hover:bg-dark-700"
              title="Copy URL"
            >
              <svg class="w-4 h-4 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              @click.stop="deleteMedia(media)"
              class="p-1.5 bg-white dark:bg-dark-800 rounded shadow-lg hover:bg-red-100 dark:hover:bg-red-900/20"
              title="Delete"
            >
              <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- List View -->
      <div v-else class="space-y-2">
        <div
          v-for="media in filteredMedia"
          :key="media.id"
          class="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
          @click="selectMedia(media)"
        >
          <img
            :src="media.url"
            :alt="media.name"
            class="w-16 h-16 object-cover rounded"
          />
          <div class="flex-1 min-w-0">
            <p class="font-medium text-gray-900 dark:text-gray-100 truncate">{{ media.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ formatFileSize(media.size) }} • {{ formatDate(media.uploadedAt) }}
            </p>
          </div>
          <div class="flex gap-2">
            <button
              @click.stop="copyUrl(media)"
              class="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
              title="Copy URL"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
            <button
              @click.stop="deleteMedia(media)"
              class="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete"
            >
              <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMedia.length === 0" class="text-center py-12">
        <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No media files</h3>
        <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Upload your first media file to get started.</p>
        <button
          @click="showUploadModal = true"
          class="mt-4 btn btn-primary"
        >
          Upload Media
        </button>
      </div>
    </div>

    <!-- Upload Modal -->
    <div
      v-if="showUploadModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
      @click="showUploadModal = false"
    >
      <div
        class="bg-white dark:bg-dark-800 rounded-lg max-w-lg w-full p-6"
        @click.stop
      >
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Upload Media</h2>
        
        <div class="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-12 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p class="text-gray-600 dark:text-gray-400 mb-2">Drag and drop files here</p>
          <p class="text-sm text-gray-500 dark:text-gray-500 mb-4">or</p>
          <button
            @click="uploadFromUrl"
            class="btn btn-primary"
          >
            Add from URL
          </button>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            @click="showUploadModal = false"
            class="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Media Detail Modal -->
    <div
      v-if="selectedMediaItem"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
      @click="selectedMediaItem = null"
    >
      <div
        class="bg-white dark:bg-dark-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
        @click.stop
      >
        <div class="p-6">
          <div class="flex items-start justify-between mb-6">
            <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">{{ selectedMediaItem.name }}</h2>
            <button
              @click="selectedMediaItem = null"
              class="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <img
            :src="selectedMediaItem.url"
            :alt="selectedMediaItem.name"
            class="w-full rounded-lg mb-6"
          />

          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">URL</label>
              <div class="flex gap-2">
                <input
                  :value="selectedMediaItem.url"
                  readonly
                  class="input text-sm flex-1"
                />
                <button
                  @click="copyUrl(selectedMediaItem)"
                  class="btn btn-secondary"
                >
                  Copy
                </button>
              </div>
            </div>
            
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p class="text-gray-600 dark:text-gray-400">Size</p>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ formatFileSize(selectedMediaItem.size) }}</p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400">Type</p>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ selectedMediaItem.type }}</p>
              </div>
              <div>
                <p class="text-gray-600 dark:text-gray-400">Uploaded</p>
                <p class="font-medium text-gray-900 dark:text-gray-100">{{ formatDate(selectedMediaItem.uploadedAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { mockMedia } from '@/mock/data'
import type { Media } from '@/mock/data'

const searchQuery = ref('')
const filterType = ref('')
const viewMode = ref<'grid' | 'list'>('grid')
const showUploadModal = ref(false)
const selectedMediaItem = ref<Media | null>(null)

const media = ref([...mockMedia])

const filteredMedia = computed(() => {
  let result = [...media.value]

  // Filter by type
  if (filterType.value) {
    result = result.filter(m => m.type.startsWith(filterType.value))
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => m.name.toLowerCase().includes(query))
  }

  return result
})

const selectMedia = (mediaItem: Media) => {
  selectedMediaItem.value = mediaItem
}

const copyUrl = (mediaItem: Media) => {
  navigator.clipboard.writeText(mediaItem.url)
  alert('URL copied to clipboard!')
}

const deleteMedia = (mediaItem: Media) => {
  if (confirm(`Delete ${mediaItem.name}?`)) {
    media.value = media.value.filter(m => m.id !== mediaItem.id)
  }
}

const uploadFromUrl = () => {
  const url = window.prompt('Enter image URL:')
  if (url) {
    const newMedia: Media = {
      id: String(media.value.length + 1),
      url,
      name: url.split('/').pop() || 'image.jpg',
      size: 0,
      type: 'image/jpeg',
      uploadedAt: new Date().toISOString(),
    }
    media.value.unshift(newMedia)
    showUploadModal.value = false
  }
}

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
</script>
