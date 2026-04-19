<template>
  <div class="relative">
    <!-- Saving Overlay -->
    <LoadingOverlay 
      :visible="saving" 
      :message="savingMessage"
      subtitle="Please wait, this may take a moment..."
    />

    <!-- Publish Confirm Dialog -->
    <ConfirmDialog
      :visible="showPublishConfirm"
      title="Publish Post"
      message="Are you sure you want to publish this post? It will be visible to all readers."
      type="info"
      confirmText="Yes, Publish"
      cancelText="Cancel"
      @confirm="confirmPublish"
      @cancel="showPublishConfirm = false"
    />

    <!-- Update Confirm Dialog -->
    <ConfirmDialog
      :visible="showUpdateConfirm"
      title="Update Post"
      message="Are you sure you want to update this post? Changes will be visible to all readers immediately."
      type="info"
      confirmText="Yes, Update"
      cancelText="Cancel"
      @confirm="confirmUpdate"
      @cancel="showUpdateConfirm = false"
    />

    <!-- Loading State -->
    <div v-if="loading" class="card text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      <p class="mt-4 text-dark-600 dark:text-dark-400">Loading post...</p>
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
      <!-- Simple Header -->
      <div class="flex items-center gap-4 mb-6">
        <button
          @click="$router.back()"
          class="p-2 hover:bg-dark-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <div>
          <h1 class="text-2xl font-bold text-dark-900 dark:text-dark-100">
            {{ isNewPost ? 'Create New Post' : 'Edit Post' }}
          </h1>
          <!-- Change indicator -->
          <p v-if="hasChanges && !isNewPost" class="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
            <span class="inline-block w-2 h-2 bg-amber-500 rounded-full mr-1 animate-pulse"></span>
            Unsaved changes
          </p>
        </div>
      </div>

      <!-- Floating Action Bar -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        enter-to-class="translate-y-0 opacity-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="translate-y-0 opacity-100"
        leave-to-class="translate-y-2 opacity-0"
      >
        <div 
          v-if="showFloatingActions"
          class="fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-dark-50 dark:bg-dark-900 rounded-2xl shadow-2xl border border-dark-300 dark:border-dark-700 p-2"
        >
          <!-- Save Draft Button -->
          <button
            @click="saveDraft"
            class="px-4 py-2.5 rounded-xl font-medium text-dark-700 dark:text-dark-200 bg-dark-100 dark:bg-dark-700 hover:bg-dark-200 dark:hover:bg-dark-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="saving"
          >
            <span class="flex items-center gap-2">
              <svg v-if="!saving" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <div v-else class="w-4 h-4 border-2 border-dark-400 border-t-transparent rounded-full animate-spin"></div>
              {{ saving ? 'Saving...' : 'Save Draft' }}
            </span>
          </button>
          
          <!-- Publish Button -->
          <button
            v-if="post.status === 'draft' || isNewPost"
            @click="publish"
            class="px-5 py-2.5 rounded-xl font-medium text-white bg-primary-600 hover:bg-primary-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary-500/30"
            :disabled="saving"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Publish
            </span>
          </button>
          
          <!-- Update Button (for published posts) -->
          <button
            v-else
            @click="updatePost"
            class="px-5 py-2.5 rounded-xl font-medium text-white transition-all duration-200 shadow-lg disabled:cursor-not-allowed"
            :disabled="saving || !hasChanges"
            :class="hasChanges ? 'bg-primary-600 hover:bg-primary-700 shadow-primary-500/30' : 'bg-dark-400 dark:bg-dark-600 opacity-50'"
            :title="hasChanges ? 'Save your changes' : 'No changes to save'"
          >
            <span class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Update
            </span>
          </button>
        </div>
      </Transition>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Main Content -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Title -->
        <div class="card">
          <input
            v-model="post.title"
            type="text"
            placeholder="Post Title"
            class="w-full text-3xl font-bold bg-transparent border-none focus:outline-none text-dark-900 dark:text-dark-100 placeholder-dark-400"
          />
        </div>

        <!-- Excerpt -->
        <div class="card">
          <textarea
            v-model="post.excerpt"
            rows="3"
            placeholder="Write a short excerpt..."
            class="w-full bg-transparent border-none focus:outline-none text-dark-700 dark:text-dark-300 placeholder-dark-400 resize-none"
          />
        </div>

        <!-- Editor -->
        <div class="card p-0">
          <MdEditorWrapper
            v-model="post.content"
            placeholder="Tell your story..."
          />
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Status -->
        <div class="card">
          <h3 class="section-title mb-4">Status</h3>
          <select
            v-model="post.status"
            class="input text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="scheduled">Scheduled</option>
          </select>
        </div>

        <!-- Featured Post Toggle -->
        <div class="card">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="section-title">Featured Post</h3>
              <p class="text-xs text-muted mt-1">Highlight this post on the homepage</p>
            </div>
            <button
              @click="post.isFeatured = !post.isFeatured"
              :class="[
                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
                post.isFeatured ? 'bg-primary-600' : 'bg-dark-200 dark:bg-dark-600'
              ]"
              role="switch"
              :aria-checked="post.isFeatured"
            >
              <span
                :class="[
                  'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-dark-50 shadow ring-0 transition duration-200 ease-in-out',
                  post.isFeatured ? 'translate-x-5' : 'translate-x-0'
                ]"
              />
            </button>
          </div>
        </div>

        <!-- Featured Image -->
        <div class="card">
          <h3 class="section-title mb-4">Featured Image</h3>
          
          <div v-if="post.featuredImage" class="relative group">
            <img
              :src="post.featuredImage"
              alt="Featured"
              class="w-full h-40 object-cover rounded-lg"
            />
            <button
              @click="() => { post.featuredImage = null; featuredImageFile = null }"
              class="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div v-else class="border-2 border-dashed border-dark-300 dark:border-dark-600 rounded-lg p-8 text-center relative">
            <div v-if="uploadingFeatured" class="absolute inset-0 bg-dark-50/80 dark:bg-dark-900/80 flex items-center justify-center backdrop-blur-sm rounded-lg">
              <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            </div>
            <svg class="w-12 h-12 mx-auto text-dark-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <button
              @click="addFeaturedImage"
              :disabled="uploadingFeatured"
              class="text-sm text-primary-600 dark:text-primary-400 hover:underline disabled:opacity-50"
            >
              {{ uploadingFeatured ? 'Uploading...' : 'Click to upload featured image' }}
            </button>
            <p class="text-xs text-dark-600 dark:text-dark-400 mt-2">
              Or drag and drop (JPEG, PNG, GIF, WebP • Max 5MB)
            </p>
          </div>
        </div>

        <!-- Category -->
        <div class="card">
          <h3 class="section-title mb-4">Category</h3>
          <select
            v-model="selectedCategoryId"
            class="input text-sm"
          >
            <option value="">Select category...</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="String(category.id)"
            >
              {{ category.name }}
            </option>
          </select>
          <p class="form-hint">Choose one primary category</p>
        </div>

        <!-- Tags -->
        <div class="card">
          <h3 class="section-title mb-4">Tags</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="tag in post.tags"
              :key="tag.id"
              class="badge-gray"
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

        <!-- Attachments -->
        <AttachmentList
          ref="attachmentListRef"
          :postId="isNewPost ? null : post.id"
          :disabled="saving"
        />

        <!-- SEO -->
        <div class="card">
          <h3 class="section-title mb-4">SEO Settings</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-xs text-muted mb-1">URL Slug</label>
              <input
                v-model="post.slug"
                type="text"
                class="input text-sm"
                placeholder="post-slug"
              />
              <p class="form-hint">Auto-generated from title if empty</p>
            </div>
            
            <div>
              <label class="block text-xs text-muted mb-1">
                Meta Title
                <span class="text-dark-400">({{ post.metaTitle?.length || 0 }}/255)</span>
              </label>
              <input
                v-model="post.metaTitle"
                type="text"
                class="input text-sm"
                placeholder="Custom SEO title (optional)"
                maxlength="255"
              />
              <p class="form-hint">Leave empty to use post title</p>
            </div>
            
            <div>
              <label class="block text-xs text-muted mb-1">
                Meta Description
                <span class="text-dark-400">({{ post.metaDescription?.length || 0 }}/320)</span>
              </label>
              <textarea
                v-model="post.metaDescription"
                rows="3"
                class="input text-sm resize-none"
                placeholder="SEO description for search engines (optional)"
                maxlength="320"
              />
              <p class="form-hint">Optimal length: 150-160 characters</p>
            </div>
            
            <div>
              <label class="block text-xs text-dark-600 dark:text-dark-400 mb-1">Reading Time (min)</label>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MdEditorWrapper from '@/components/editor/MdEditorWrapper.vue'
import LoadingOverlay from '@/components/common/LoadingOverlay.vue'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import AttachmentList from '@/components/common/AttachmentList.vue'
import { postService, type CreatePostDto } from '@/services/postService'
import { mediaService } from '@/services/mediaService'
import { categoryService, type Category } from '@/services/categoryService'
import { tagService, type Tag } from '@/services/tagService'
import { useToast } from '@/composables/useToast'
import type { Post } from '@/mock/data'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const isNewPost = computed(() => route.name === 'post-new')
const saving = ref(false)
const savingMessage = ref('Saving...')
const loading = ref(false)
const error = ref<string | null>(null)
const selectedTag = ref('')
const showPublishConfirm = ref(false)
const showUpdateConfirm = ref(false)
const attachmentListRef = ref<InstanceType<typeof AttachmentList> | null>(null)

// Store original post state for change detection
const originalPost = ref<string>('')

const categories = ref<Category[]>([])
const allTags = ref<Tag[]>([])

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
  isFeatured: false,
})

// Helper function to safely convert id to number
const toNumberId = (id: string | number): number => {
  return typeof id === 'number' ? id : parseInt(String(id))
}

// Get a snapshot of post fields that we want to track for changes
const getPostSnapshot = () => ({
  title: post.value.title,
  slug: post.value.slug,
  content: post.value.content,
  excerpt: post.value.excerpt,
  featuredImage: post.value.featuredImage,
  category: post.value.category?.id || null,
  tags: post.value.tags.map(t => t.id).sort(),
  metaTitle: post.value.metaTitle,
  metaDescription: post.value.metaDescription,
  readingTime: post.value.readingTime,
  isFeatured: post.value.isFeatured,
})

// Check if post has unsaved changes (for published posts)
const hasChanges = computed(() => {
  if (isNewPost.value) return true  // New posts always allow save
  if (!originalPost.value) return false  // Not loaded yet
  
  // Also consider if a new featured image file was selected
  if (featuredImageFile.value) return true
  
  return JSON.stringify(getPostSnapshot()) !== originalPost.value
})

const availableTags = computed(() => {
  return allTags.value.filter(tag => !post.value.tags.find(t => String(t.id) === String(tag.id)))
})

// Computed for category selection - compare by id, not object reference
const selectedCategoryId = computed({
  get: () => post.value.category?.id || '',
  set: (id: string) => {
    if (!id) {
      post.value.category = null
    } else {
      const category = categories.value.find(c => String(c.id) === String(id))
      if (category) {
        // Map to Post.category type (id as string)
        post.value.category = {
          id: String(category.id),
          name: category.name,
          slug: category.slug,
          description: category.description || '',
          postCount: category.postCount || 0,
        }
      } else {
        post.value.category = null
      }
    }
  }
})

const addTag = () => {
  if (selectedTag.value) {
    const tag = allTags.value.find(t => String(t.id) === String(selectedTag.value))
    if (tag) {
      post.value.tags.push({
        id: String(tag.id),
        name: tag.name,
        slug: tag.slug,
        postCount: tag.postCount || 0
      })
      selectedTag.value = ''
    }
  }
}

const removeTag = (tag: any) => {
  post.value.tags = post.value.tags.filter(t => String(t.id) !== String(tag.id))
}

const uploadingFeatured = ref(false)

const featuredImageFile = ref<File | null>(null)

const addFeaturedImage = () => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  
  input.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return
    
    // Validate
    const validation = mediaService.validateImage(file)
    if (!validation.valid) {
      toast.error(validation.error || 'Invalid image')
      return
    }
    
    // Store file for later upload, create preview URL
    featuredImageFile.value = file
    post.value.featuredImage = URL.createObjectURL(file)
  }
  
  input.click()
}

const saveDraft = async () => {
  // Draft can be saved with minimal data
  if (!post.value.title) {
    toast.warning('Please fill in the title')
    return
  }

  saving.value = true
  savingMessage.value = 'Saving draft...'
  error.value = null
  
  try {
    // Auto-generate slug if empty
    if (!post.value.slug && post.value.title) {
      post.value.slug = post.value.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }

    // Prepare data for API
    const postData: CreatePostDto = {
      id: isNewPost.value ? undefined : parseInt(post.value.id),  // Include id for update
      title: post.value.title,
      slug: post.value.slug,
      content: post.value.content,
      excerpt: post.value.excerpt,
      categoryId: post.value.category ? toNumberId(post.value.category.id) : null,
      tagId: post.value.tags.map(tag => toNumberId(tag.id)),
      authorUsername: 'grummans',
      metaTitle: post.value.metaTitle,
      metaDescription: post.value.metaDescription,
      readingTimeMinutes: post.value.readingTime,
      isFeatured: post.value.isFeatured === true,  // Explicit boolean
    }

    savingMessage.value = isNewPost.value ? 'Creating draft...' : 'Updating draft...'
    const savedDraft = await postService.saveDraft(postData, featuredImageFile.value || undefined)
    featuredImageFile.value = null // Clear after upload
    
    // Upload pending attachments if any (for new drafts)
    if (savedDraft?.id && attachmentListRef.value?.hasPendingFiles()) {
      savingMessage.value = 'Uploading attachments...'
      const result = await attachmentListRef.value.uploadPendingFiles(String(savedDraft.id))
      if (result.failed > 0) {
        toast.warning(`${result.success} file(s) uploaded, ${result.failed} failed`)
      }
    }
    
    toast.success('Draft saved successfully!')
    router.push('/posts')
  } catch (err: any) {
    error.value = err.message || 'Failed to save draft'
    toast.error(error.value || 'An error occurred')
  } finally {
    saving.value = false
  }
}

// Show publish confirmation dialog
const publish = () => {
  // Validate required fields for publishing
  if (!post.value.title?.trim()) {
    toast.warning('Title is required for publishing')
    return
  }
  if (!post.value.slug?.trim()) {
    // Auto-generate if empty
    post.value.slug = post.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  if (!post.value.category) {
    toast.warning('Please select a category before publishing')
    return
  }
  if (!post.value.tags || post.value.tags.length === 0) {
    toast.warning('Please add at least one tag before publishing')
    return
  }
  showPublishConfirm.value = true
}

// Actually publish after confirmation
const confirmPublish = async () => {
  showPublishConfirm.value = false
  saving.value = true
  savingMessage.value = 'Publishing post...'
  error.value = null
  
  try {
    // Prepare data for API - same structure for both new and existing
    const postData: CreatePostDto = {
      id: isNewPost.value ? null : parseInt(post.value.id),  // null = create new, number = publish draft
      title: post.value.title,
      slug: post.value.slug,
      content: post.value.content,
      excerpt: post.value.excerpt,
      categoryId: post.value.category ? toNumberId(post.value.category.id) : null,
      tagId: post.value.tags.map(tag => toNumberId(tag.id)),
      authorUsername: 'grummans',
      metaTitle: post.value.metaTitle,
      metaDescription: post.value.metaDescription,
      readingTimeMinutes: post.value.readingTime,
      isFeatured: post.value.isFeatured === true,  // Explicit boolean
    }
    
    savingMessage.value = isNewPost.value ? 'Creating and publishing post...' : 'Publishing post...'
    const publishedPost = await postService.publish(postData, featuredImageFile.value || undefined)
    featuredImageFile.value = null
    
    // Upload pending attachments if any
    if (publishedPost?.id && attachmentListRef.value?.hasPendingFiles()) {
      savingMessage.value = 'Uploading attachments...'
      const result = await attachmentListRef.value.uploadPendingFiles(String(publishedPost.id))
      if (result.failed > 0) {
        toast.warning(`${result.success} file(s) uploaded, ${result.failed} failed`)
      }
    }
    
    toast.success('Post published successfully!')
    router.push('/posts')
  } catch (err: any) {
    error.value = err.message || 'Failed to publish post'
    toast.error(error.value || 'An error occurred')
  } finally {
    saving.value = false
  }
}

// Show update confirmation dialog
const updatePost = () => {
  // Validate required fields for updating published post
  if (!post.value.title?.trim()) {
    toast.warning('Title is required')
    return
  }
  if (!post.value.slug?.trim()) {
    // Auto-generate if empty
    post.value.slug = post.value.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
  if (!post.value.category) {
    toast.warning('Please select a category')
    return
  }
  if (!post.value.tags || post.value.tags.length === 0) {
    toast.warning('Please add at least one tag')
    return
  }
  showUpdateConfirm.value = true
}

// Actually update after confirmation - uses PUT /{postId} endpoint
const confirmUpdate = async () => {
  showUpdateConfirm.value = false
  saving.value = true
  savingMessage.value = 'Updating post...'
  error.value = null
  
  try {
    // For updating published post, use PUT /{postId}
    // Note: No id in body, it's in the URL path
    const postData = {
      title: post.value.title,
      slug: post.value.slug,
      content: post.value.content,
      excerpt: post.value.excerpt,
      categoryId: post.value.category ? toNumberId(post.value.category.id) : null,
      tagId: post.value.tags.map(tag => toNumberId(tag.id)),
      authorUsername: 'grummans',
      metaTitle: post.value.metaTitle,
      metaDescription: post.value.metaDescription,
      readingTimeMinutes: post.value.readingTime,
      isFeatured: post.value.isFeatured === true,  // Explicit boolean
    }

    await postService.updatePublished(post.value.id, postData, featuredImageFile.value || undefined)
    featuredImageFile.value = null
    
    toast.success('Post updated successfully!')
    router.push('/posts')
  } catch (err: any) {
    error.value = err.message || 'Failed to update post'
    toast.error(error.value || 'An error occurred')
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
    // Store original state for change detection
    originalPost.value = JSON.stringify(getPostSnapshot())
  } catch (err: any) {
    error.value = err.message || 'Failed to load post'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

// Load categories and tags
const loadCategoriesAndTags = async () => {
  try {
    const [loadedCategories, loadedTags] = await Promise.all([
      categoryService.getAll(),
      tagService.getAll()
    ])
    categories.value = loadedCategories
    allTags.value = loadedTags
  } catch (err: any) {
    console.error('Error loading categories/tags:', err)
    toast.error('Failed to load categories or tags')
  }
}

// Show/hide floating actions based on scroll position
const showFloatingActions = ref(false)

const handleScroll = () => {
  // Show floating buttons after scrolling down 100px
  showFloatingActions.value = window.scrollY > 100
}

onMounted(() => {
  loadPost()
  loadCategoriesAndTags()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
