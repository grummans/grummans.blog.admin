<template>
  <div>
    <!-- Header -->
    <div class="mb-6 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {{ isNewPost ? 'Create New Post' : 'Edit Post' }}
        </h1>
      </div>

      <div class="flex items-center gap-3">
        <button
          @click="saveDraft"
          class="btn btn-secondary"
          :disabled="saving"
        >
          {{ saving ? 'Saving...' : 'Save Draft' }}
        </button>
        <button
          @click="publish"
          class="btn btn-primary"
          :disabled="saving"
        >
          {{ post.status === 'published' ? 'Update' : 'Publish' }}
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="card">
          <input
            v-model="post.title"
            type="text"
            placeholder="Post Title"
            class="w-full text-3xl font-bold bg-transparent border-none focus:outline-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
        </div>

        <!-- Excerpt -->
        <div class="card">
          <textarea
            v-model="post.excerpt"
            rows="3"
            placeholder="Write a short excerpt..."
            class="w-full bg-transparent border-none focus:outline-none text-gray-700 dark:text-gray-300 placeholder-gray-400 resize-none"
          />
        </div>

        <!-- Editor -->
        <div class="card p-0">
          <TipTapEditor
            v-model="post.content"
            placeholder="Tell your story..."
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Status -->
        <div class="card">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Status</h3>
          <select
            v-model="post.status"
            class="input text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <!-- Featured Image -->
        <div class="card">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Featured Image</h3>
          
          <div v-if="post.featuredImage" class="relative group">
            <img
              :src="post.featuredImage"
              alt="Featured"
              class="w-full h-40 object-cover rounded-lg"
            />
            <button
              @click="post.featuredImage = null"
              class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-else class="border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg p-8 text-center">
            <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <button
              @click="addFeaturedImage"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              Add featured image
            </button>
          </div>
        </div>

        <!-- Categories -->
        <div class="card">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Categories</h3>
          <div class="space-y-2">
            <label
              v-for="category in categories"
              :key="category.id"
              class="flex items-center"
            >
              <input
                type="checkbox"
                :value="category"
                v-model="post.categories"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ category.name }}</span>
            </label>
          </div>
        </div>

        <!-- Tags -->
        <div class="card">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in post.tags"
              :key="tag.id"
              class="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
            >
              {{ tag.name }}
              <button
                @click="removeTag(tag)"
                class="hover:text-red-600"
              >
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </span>
          </div>
          
          <select
            v-model="selectedTag"
            @change="addTag"
            class="input text-sm"
          >
            <option value="">Add tag...</option>
            <option
              v-for="tag in availableTags"
              :key="tag.id"
              :value="tag.id"
            >
              {{ tag.name }}
            </option>
          </select>
        </div>

        <!-- SEO -->
        <div class="card">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">SEO</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Slug</label>
              <input
                v-model="post.slug"
                type="text"
                class="input text-sm"
                placeholder="post-slug"
              />
            </div>
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">Reading Time (min)</label>
              <input
                v-model.number="post.readingTime"
                type="number"
                class="input text-sm"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TipTapEditor from '@/components/editor/TipTapEditor.vue'
import { mockPosts, mockCategories, mockTags } from '@/mock/data'
import type { Post, Category, Tag } from '@/mock/data'

const route = useRoute()
const router = useRouter()

const isNewPost = computed(() => route.name === 'post-new')
const saving = ref(false)
const selectedTag = ref('')

const categories = mockCategories
const allTags = mockTags

const post = ref<Post>({
  id: '',
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featuredImage: null,
  status: 'draft',
  publishedAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: {
    id: '1',
    name: 'Admin User',
    email: 'admin@blog.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff',
    bio: 'Blog administrator',
    role: 'admin',
  },
  categories: [],
  tags: [],
  views: 0,
  readingTime: 5,
})

const availableTags = computed(() => {
  return allTags.filter(tag => !post.value.tags.find(t => t.id === tag.id))
})

const addTag = () => {
  if (selectedTag.value) {
    const tag = allTags.find(t => t.id === selectedTag.value)
    if (tag) {
      post.value.tags.push(tag)
      selectedTag.value = ''
    }
  }
}

const removeTag = (tag: Tag) => {
  post.value.tags = post.value.tags.filter(t => t.id !== tag.id)
}

const addFeaturedImage = () => {
  const url = window.prompt('Enter image URL:')
  if (url) {
    post.value.featuredImage = url
  }
}

const saveDraft = async () => {
  saving.value = true
  post.value.status = 'draft'
  
  // Simulate API call
  setTimeout(() => {
    console.log('Saved draft:', post.value)
    saving.value = false
    alert('Draft saved successfully!')
  }, 1000)
}

const publish = async () => {
  if (!post.value.title || !post.value.content) {
    alert('Please fill in title and content')
    return
  }

  saving.value = true
  
  if (post.value.status !== 'published') {
    post.value.status = 'published'
    post.value.publishedAt = new Date().toISOString()
  }
  
  post.value.updatedAt = new Date().toISOString()
  
  // Auto-generate slug if empty
  if (!post.value.slug) {
    post.value.slug = post.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  // Simulate API call
  setTimeout(() => {
    console.log('Published post:', post.value)
    saving.value = false
    alert('Post published successfully!')
    router.push('/posts')
  }, 1000)
}

onMounted(() => {
  if (!isNewPost.value) {
    // Load existing post
    const existingPost = mockPosts.find(p => p.id === route.params.id)
    if (existingPost) {
      post.value = { ...existingPost }
    }
  }
})
</script>
