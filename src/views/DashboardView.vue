<template>
  <div class="space-y-6">
    <section class="card">
      <p class="text-xs uppercase tracking-[0.08em] text-muted">Workspace</p>
      <h1 class="page-title text-2xl mt-2">Welcome Back</h1>
      <p class="text-muted mt-3 max-w-2xl">
        This space is optimized for writing and publishing. No analytics noise, just quick paths to create, revise, and organize your posts.
      </p>

      <div class="mt-6 flex flex-wrap gap-3">
        <router-link to="/posts/new" class="btn btn-primary">New Post</router-link>
        <router-link to="/posts" class="btn btn-secondary">Open Posts</router-link>
        <router-link to="/categories" class="btn btn-secondary">Categories</router-link>
        <router-link to="/tags" class="btn btn-secondary">Tags</router-link>
      </div>
    </section>

    <section class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <article class="card">
        <div class="flex items-center justify-between gap-3 mb-4">
          <h2 class="section-title">Drafts To Continue</h2>
          <router-link to="/posts" class="text-xs uppercase tracking-[0.08em] text-muted hover:text-heading">
            View all
          </router-link>
        </div>

        <div v-if="recentDrafts.length === 0" class="border border-dashed border-zinc-400 dark:border-zinc-700 p-4 text-sm text-muted">
          No drafts right now. Start a new post when inspiration hits.
        </div>

        <ul v-else class="space-y-2">
          <li v-for="post in recentDrafts" :key="post.id">
            <router-link
              :to="`/posts/${post.id}`"
              class="block border border-zinc-300 dark:border-zinc-700 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
            >
              <p class="text-sm text-heading font-semibold truncate">{{ post.title }}</p>
              <p class="text-xs text-muted mt-1">Updated {{ formatDate(post.updatedAt) }}</p>
            </router-link>
          </li>
        </ul>
      </article>

      <article class="card">
        <h2 class="section-title mb-4">Recently Edited</h2>

        <ul class="space-y-2">
          <li v-for="post in recentlyEdited" :key="post.id">
            <router-link
              :to="`/posts/${post.id}`"
              class="flex items-center justify-between gap-3 border border-zinc-300 dark:border-zinc-700 p-3 hover:bg-zinc-100 dark:hover:bg-zinc-800/70 transition-colors"
            >
              <div class="min-w-0">
                <p class="text-sm text-heading font-semibold truncate">{{ post.title }}</p>
                <p class="text-xs text-muted mt-1">{{ formatDate(post.updatedAt) }}</p>
              </div>
              <span class="badge-gray">{{ post.status }}</span>
            </router-link>
          </li>
        </ul>
      </article>
    </section>

    <section class="card">
      <h2 class="section-title mb-3">Writing Notes</h2>
      <ul class="space-y-2 text-sm text-muted">
        <li>Keep posts concise and publish iteratively.</li>
        <li>Use categories for structure, tags for discoverability.</li>
        <li>Review one old draft each week and decide: publish or archive.</li>
      </ul>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { mockPosts } from '@/mock/data'

const sortedByUpdatedAt = computed(() => {
  return [...mockPosts].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
})

const recentDrafts = computed(() => {
  return sortedByUpdatedAt.value.filter(post => post.status === 'draft').slice(0, 5)
})

const recentlyEdited = computed(() => {
  return sortedByUpdatedAt.value.slice(0, 5)
})

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days <= 0) return 'today'
  if (days === 1) return 'yesterday'
  if (days < 7) return `${days} days ago`
  return date.toLocaleDateString()
}
</script>
