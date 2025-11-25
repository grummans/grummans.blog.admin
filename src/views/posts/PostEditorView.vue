<template>
  <div>
    <!-- Loading State -->
    <div v-if="loading" class="card text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-400">Loading post...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error && !isNewPost" class="card bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <div class="flex items-start gap-3">
        <svg class="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h3 class="text-red-800 dark:text-red-200 font-semibold">Error loading post</h3>
          <p class="text-red-600 dark:text-red-400 text-sm mt-1">{{ error }}</p>
          <button @click="loadPost" class="mt-3 text-sm text-red-700 dark:text-red-300 hover:underline">
            Try again
          </button>
        </div>
      </div>
    </div>

    <!-- Editor Content -->
    <div v-else>
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

        <!-- Category -->
        <div class="card">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">Category</h3>
          <select
            v-model="post.category"
            class="input text-sm"
          >
            <option :value="null">Select category...</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category"
            >
              {{ category.name }}
            </option>
          </select>
          <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Choose one primary category</p>
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
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-4">SEO Settings</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">URL Slug</label>
              <input
                v-model="post.slug"
                type="text"
                class="input text-sm"
                placeholder="post-slug"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Auto-generated from title if empty</p>
            </div>
            
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Meta Title
                <span class="text-gray-400">({{ post.metaTitle?.length || 0 }}/255)</span>
              </label>
              <input
                v-model="post.metaTitle"
                type="text"
                class="input text-sm"
                placeholder="Custom SEO title (optional)"
                maxlength="255"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Leave empty to use post title</p>
            </div>
            
            <div>
              <label class="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Meta Description
                <span class="text-gray-400">({{ post.metaDescription?.length || 0 }}/320)</span>
              </label>
              <textarea
                v-model="post.metaDescription"
                rows="3"
                class="input text-sm resize-none"
                placeholder="SEO description for search engines (optional)"
                maxlength="320"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Optimal length: 150-160 characters</p>
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TipTapEditor from '@/components/editor/TipTapEditor.vue'
import { postService } from '@/services/postService'
import { mockCategories, mockTags } from '@/mock/data'
import type { Post, Category, Tag } from '@/mock/data'

const route = useRoute()
const router = useRouter()

const isNewPost = computed(() => route.name === 'post-new')
const saving = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)
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
  category: null,
  tags: [],
  views: 0,
  readingTime: 5,
  metaTitle: '',
  metaDescription: '',
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
  if (!post.value.title || !post.value.content) {
    alert('Please fill in title and content')
    return
  }

  saving.value = true
  error.value = null
  post.value.status = 'draft'
  
  try {
    // Auto-generate slug if empty
    if (!post.value.slug) {
      post.value.slug = post.value.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Prepare data for API
    const postData = {
      title: post.value.title,
      slug: post.value.slug,
      content: post.value.content,
      excerpt: post.value.excerpt,
      featuredImage: post.value.featuredImage,
      status: 'draft' as const,
      categoryId: post.value.category?.id || null,
      tagIds: post.value.tags.map(tag => tag.id),
      metaTitle: post.value.metaTitle,
      metaDescription: post.value.metaDescription,
      readingTime: post.value.readingTime,
    }

    if (isNewPost.value) {
      const created = await postService.create(postData)
      post.value.id = created.id
      alert('Draft saved successfully!')
      router.push(`/posts/${created.id}`)
    } else {
      await postService.update(post.value.id, postData)
      alert('Draft saved successfully!')
    }
  } catch (err: any) {
    error.value = err.message || 'Failed to save draft'
    alert(error.value)
  } finally {
    saving.value = false
  }
}

const publish = async () => {
  if (!post.value.title || !post.value.content) {
    alert('Please fill in title and content')
    return
  }

  saving.value = true
  error.value = null
  
  try {
    // Auto-generate slug if empty
    if (!post.value.slug) {
      post.value.slug = post.value.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Prepare data for API
    const postData = {
      title: post.value.title,
      slug: post.value.slug,
      content: post.value.content,
      excerpt: post.value.excerpt,
      featuredImage: post.value.featuredImage,
      status: 'published' as const,
      categoryId: post.value.category?.id || null,
      tagIds: post.value.tags.map(tag => tag.id),
      metaTitle: post.value.metaTitle,
      metaDescription: post.value.metaDescription,
      readingTime: post.value.readingTime,
    }

    if (isNewPost.value) {
      await postService.create(postData)
      alert('Post published successfully!')
    } else {
      await postService.update(post.value.id, postData)
      alert('Post updated successfully!')
    }
    
    router.push('/posts')
  } catch (err: any) {
    error.value = err.message || 'Failed to publish post'
    alert(error.value)
  } finally {
    saving.value = false
  }
}

// Load post data
const loadPost = async () => {
  if (isNewPost.value) return
  
  loading.value = true
  error.value = null
  
  try {
    const postId = route.params.id as string
    const loadedPost = await postService.getById(postId)
    post.value = { ...loadedPost }
  } catch (err: any) {
    error.value = err.message || 'Failed to load post'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPost()
})
</script>
