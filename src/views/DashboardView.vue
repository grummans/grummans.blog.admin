<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-gray-100">Dashboard</h1>
      <p class="mt-2 text-gray-600 dark:text-gray-400">Welcome back! Here's what's happening with your blog.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Posts</p>
            <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalPosts }}</p>
          </div>
          <div class="p-3 bg-primary-100 dark:bg-primary-900/20 rounded-lg">
            <svg class="w-8 h-8 text-primary-600 dark:text-primary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 flex items-center text-sm">
          <span class="text-green-600 dark:text-green-400 font-medium">{{ stats.publishedPosts }} published</span>
          <span class="mx-2 text-gray-400">•</span>
          <span class="text-gray-600 dark:text-gray-400">{{ stats.draftPosts }} draft</span>
        </div>
      </div>

      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Total Views</p>
            <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalViews.toLocaleString() }}</p>
          </div>
          <div class="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Across all published posts
        </div>
      </div>

      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Comments</p>
            <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ stats.totalComments }}</p>
          </div>
          <div class="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
          User engagement
        </div>
      </div>

      <div class="card hover:shadow-md transition-shadow">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Reading Time</p>
            <p class="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{{ avgReadingTime }} min</p>
          </div>
          <div class="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Per article
        </div>
      </div>
    </div>

    <!-- Recent Posts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Recent Posts -->
      <div class="card">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100">Recent Posts</h2>
          <router-link to="/posts" class="text-sm text-primary-600 dark:text-primary-400 hover:underline">
            View all
          </router-link>
        </div>

        <div class="space-y-3">
          <div
            v-for="post in recentPosts"
            :key="post.id"
            class="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
            @click="$router.push(`/posts/${post.id}`)"
          >
            <!-- Featured Image -->
            <img
              v-if="post.featuredImage"
              :src="post.featuredImage"
              :alt="post.title"
              class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
            />
            <div v-else class="w-16 h-16 bg-gray-200 dark:bg-dark-600 rounded-lg flex-shrink-0 flex items-center justify-center">
              <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>

            <!-- Post Info -->
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {{ post.title }}
              </h3>
              <div class="mt-1 flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-500">
                <span class="flex items-center">
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  {{ post.views.toLocaleString() }}
                </span>
                <span>{{ formatDate(post.updatedAt) }}</span>
              </div>
            </div>

            <!-- Status Badge -->
            <span
              :class="[
                'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium flex-shrink-0',
                post.status === 'published'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : post.status === 'draft'
                  ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  : 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
              ]"
            >
              {{ post.status === 'published' ? 'Pub' : post.status === 'draft' ? 'Draft' : 'Sch' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Views Chart -->
      <div class="card">
        <h2 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Top Posts by Views</h2>
        
        <!-- Column Chart -->
        <div class="h-80 flex items-end justify-between gap-2 px-4">
          <div
            v-for="(post, index) in topPosts"
            :key="post.id"
            class="flex-1 flex flex-col items-center group cursor-pointer"
            @click="$router.push(`/posts/${post.id}`)"
          >
            <!-- Bar -->
            <div class="w-full flex flex-col justify-end" style="height: 280px">
              <div
                class="w-full rounded-t-lg transition-all duration-300 hover:opacity-80 relative"
                :class="[
                  index === 0 ? 'bg-primary-600 dark:bg-primary-500' : 
                  index === 1 ? 'bg-primary-500 dark:bg-primary-600' : 
                  index === 2 ? 'bg-primary-400 dark:bg-primary-700' : 
                  index === 3 ? 'bg-primary-300 dark:bg-primary-800' : 
                  'bg-primary-200 dark:bg-primary-900'
                ]"
                :style="{ height: `${(post.views / maxViews) * 100}%` }"
              >
                <!-- Value on hover -->
                <div class="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  <span class="text-xs font-bold text-gray-900 dark:text-gray-100 bg-white dark:bg-dark-800 px-2 py-1 rounded shadow-lg border border-gray-200 dark:border-dark-700">
                    {{ post.views.toLocaleString() }} views
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Label -->
            <div class="mt-2 text-center w-full">
              <p class="text-xs font-medium text-gray-900 dark:text-gray-100 truncate" :title="post.title">
                {{ post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{ (post.views / 1000).toFixed(1) }}K
              </p>
            </div>
          </div>
        </div>

        <!-- Legend -->
        <div class="mt-6 pt-4 border-t border-gray-200 dark:border-dark-700">
          <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Least views</span>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded bg-primary-200 dark:bg-primary-900"></div>
              <div class="w-3 h-3 rounded bg-primary-400 dark:bg-primary-700"></div>
              <div class="w-3 h-3 rounded bg-primary-600 dark:bg-primary-500"></div>
            </div>
            <span>Most views</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockPosts, mockDashboardStats } from '@/mock/data'

const stats = mockDashboardStats

const recentPosts = computed(() => {
  return mockPosts
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5)
})

const topPosts = computed(() => {
  return mockPosts
    .filter(post => post.status === 'published')
    .sort((a, b) => b.views - a.views)
    .slice(0, 5)
})

const maxViews = computed(() => {
  return Math.max(...topPosts.value.map(post => post.views))
})

const avgReadingTime = computed(() => {
  const total = mockPosts.reduce((sum, post) => sum + post.readingTime, 0)
  return Math.round(total / mockPosts.length)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`
  return date.toLocaleDateString()
}
</script>
