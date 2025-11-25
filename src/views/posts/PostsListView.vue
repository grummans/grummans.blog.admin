<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Posts</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-400">Manage your blog posts</p>
      </div>
      <router-link to="/posts/new" class="btn btn-primary">
        <svg class="w-5 h-5 mr-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        New Post
      </router-link>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="flex-1 min-w-[200px]">
          <input
            v-model="searchQuery"
            type="search"
            placeholder="Search posts..."
            class="input text-sm"
          />
        </div>
        <select v-model="filterStatus" class="input text-sm w-auto">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="scheduled">Scheduled</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="card text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading posts...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-red-800 dark:text-red-200 font-semibold">Error loading posts</h3>
          <p class="text-red-600 dark:text-red-400 text-sm mt-1">{{ error }}</p>
          <button @click="fetchPosts" class="mt-3 text-sm text-red-700 dark:text-red-300 hover:underline">
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-else class="card">
      <div class="space-y-4">
        <div
          v-for="post in paginatedPosts"
          :key="post.id"
          class="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-dark-600"
          @click="$router.push(`/posts/${post.id}`)"
        >
          <!-- Featured Image -->
          <img
            v-if="post.featuredImage"
            :src="post.featuredImage"
            :alt="post.title"
            class="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          />
          <div v-else class="w-24 h-24 bg-gray-200 dark:bg-dark-600 rounded-lg flex-shrink-0 flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>

          <!-- Post Info -->
          <div class="flex-1 min-w-0">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {{ post.title }}
            </h3>
            <p class="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {{ post.excerpt }}
            </p>
            
            <!-- Tags -->
            <div v-if="post.tags && post.tags.length > 0" class="mt-2 flex flex-wrap gap-2">
              <span
                v-for="tag in post.tags.slice(0, 3)"
                :key="tag.id"
                class="text-xs px-2 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 rounded"
              >
                {{ tag.name }}
              </span>
            </div>

            <!-- Meta -->
            <div class="mt-3 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span class="flex items-center">
                <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {{ post.views.toLocaleString() }}
              </span>
              <span>{{ post.readingTime }} min read</span>
              <span>Updated {{ formatDate(post.updatedAt) }}</span>
            </div>
          </div>

          <!-- Status & Actions -->
          <div class="flex flex-col items-end gap-2">
            <span
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                post.status === 'published'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : post.status === 'draft'
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              ]"
            >
              {{ post.status.charAt(0).toUpperCase() + post.status.slice(1) }}
            </span>
            
            <button
              @click.stop="deletePost(post.id)"
              class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Delete post"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Empty State -->
        <div v-if="filteredPosts.length === 0" class="text-center py-12">
          <svg class="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">No posts found</h3>
          <p class="mt-2 text-sm text-gray-600 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="mt-6 pt-6 border-t border-gray-200 dark:border-dark-700">
        <div class="flex items-center justify-between">
          <div class="text-sm text-gray-600 dark:text-gray-400">
            Showing {{ startItem }} to {{ endItem }} of {{ filteredPosts.length }} posts
          </div>
          
          <div class="flex items-center gap-2">
            <!-- Previous Button -->
            <button
              @click="currentPage--"
              :disabled="currentPage === 1"
              class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <!-- Page Numbers -->
            <button
              v-for="page in displayPages"
              :key="page"
              @click="currentPage = page"
              :class="[
                'px-3 py-2 text-sm rounded-lg transition-colors',
                page === currentPage
                  ? 'bg-primary-600 text-white'
                  : 'border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700'
              ]"
            >
              {{ page }}
            </button>

            <!-- Next Button -->
            <button
              @click="currentPage++"
              :disabled="currentPage === totalPages"
              class="px-3 py-2 text-sm rounded-lg border border-gray-300 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { postService } from '@/services/postService'
import type { Post } from '@/mock/data'

const searchQuery = ref('')
const filterStatus = ref('')
const currentPage = ref(1)
const itemsPerPage = 5 // 5 posts per page

// API state management
const posts = ref<Post[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Fetch posts from API
const fetchPosts = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await postService.getAllContent()
    // Ensure we have an array
    posts.value = Array.isArray(response) ? response : []
  } catch (err: any) {
    error.value = err.message || 'Failed to fetch posts'
    console.error('Error fetching posts:', err)
    posts.value = [] // Set to empty array on error
  } finally {
    loading.value = false
  }
}

const filteredPosts = computed(() => {
  // Ensure posts.value is an array
  if (!Array.isArray(posts.value)) {
    return []
  }
  
  let filteredList = [...posts.value]

  // Filter by status
  if (filterStatus.value) {
    filteredList = filteredList.filter(post => post.status === filterStatus.value)
  }

  // Filter by search query
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filteredList = filteredList.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.excerpt.toLowerCase().includes(query)
    )
  }

  return filteredList.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredPosts.value.length / itemsPerPage))

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredPosts.value.slice(start, end)
})

const startItem = computed(() => {
  if (filteredPosts.value.length === 0) return 0
  return (currentPage.value - 1) * itemsPerPage + 1
})

const endItem = computed(() => {
  const end = currentPage.value * itemsPerPage
  return end > filteredPosts.value.length ? filteredPosts.value.length : end
})

const displayPages = computed(() => {
  const pages = []
  const maxPagesToShow = 5
  
  if (totalPages.value <= maxPagesToShow) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    const halfMax = Math.floor(maxPagesToShow / 2)
    let startPage = currentPage.value - halfMax
    let endPage = currentPage.value + halfMax
    
    if (startPage < 1) {
      startPage = 1
      endPage = maxPagesToShow
    }
    
    if (endPage > totalPages.value) {
      endPage = totalPages.value
      startPage = totalPages.value - maxPagesToShow + 1
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
  }
  
  return pages
})

// Reset to page 1 when filters change
watch([searchQuery, filterStatus], () => {
  currentPage.value = 1
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}

const deletePost = async (id: string) => {
  if (confirm('Are you sure you want to delete this post?')) {
    try {
      await postService.delete(id)
      // Refresh the posts list after deletion
      await fetchPosts()
    } catch (err: any) {
      alert(err.message || 'Failed to delete post')
    }
  }
}

// Fetch posts on component mount
onMounted(() => {
  fetchPosts()
})
</script>
