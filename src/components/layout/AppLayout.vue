<template>
  <div class="min-h-screen bg-dark-50 dark:bg-dark-950 text-dark-900 dark:text-dark-100 transition-colors duration-200">
    <ConfirmDialog
      :visible="showLogoutConfirm"
      title="Logout"
      message="Are you sure you want to logout?"
      type="warning"
      confirmText="Logout"
      cancelText="Cancel"
      @confirm="confirmLogout"
      @cancel="showLogoutConfirm = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-dark-50 dark:bg-dark-900 border-r border-dark-300 dark:border-dark-800 transform transition-transform duration-200 ease-in-out lg:translate-x-0',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <!-- Logo -->
      <div class="h-16 flex items-center px-6 border-b border-dark-300 dark:border-dark-800">
        <router-link
          to="/dashboard"
          class="text-sm font-bold uppercase tracking-[0.12em] text-dark-900 dark:text-primary-400 hover:opacity-80 transition-opacity"
          @click="isSidebarOpen = false"
        >
          Blog Admin
        </router-link>
      </div>

      <!-- Navigation -->
      <nav class="px-4 py-4 space-y-1">
        <router-link
          v-for="item in navigation"
          :key="item.name"
          :to="item.href"
          class="flex items-center px-3 py-2 text-sm font-medium border-l-2 border-transparent transition-colors"
          :class="[
            $route.path === item.href
              ? 'bg-dark-100 dark:bg-dark-800 text-dark-900 dark:text-primary-400 border-l-primary-500'
              : 'text-dark-700 dark:text-dark-300 hover:bg-dark-100 dark:hover:bg-dark-800/70 hover:border-l-dark-500'
          ]"
        >
          <component :is="item.icon" class="w-4 h-4 mr-3" />
          {{ item.name }}
        </router-link>
      </nav>

      <!-- User Profile -->
      <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-dark-300 dark:border-dark-800 bg-dark-50 dark:bg-dark-900">
        <div class="relative">
          <button
            @click="isUserMenuOpen = !isUserMenuOpen"
            class="flex items-center w-full hover:bg-dark-100 dark:hover:bg-dark-800 p-2 border border-dark-300 dark:border-dark-700 transition-colors"
          >
            <img
              :src="currentUser.avatarUrl"
              :alt="currentUser.displayName"
              class="w-9 h-9 border border-dark-300 dark:border-dark-600"
            />
            <div class="ml-3 flex-1 min-w-0 text-left">
              <p class="text-xs font-semibold uppercase tracking-wide text-dark-900 dark:text-dark-100 truncate">
                {{ currentUser.displayName }}
              </p>
              <p class="text-[11px] text-dark-600 dark:text-dark-400 truncate">
                {{ currentUser.email }}
              </p>
            </div>
            <svg
              class="w-4 h-4 text-dark-500 transition-transform"
              :class="{ 'rotate-180': isUserMenuOpen }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <!-- Dropdown Menu -->
          <transition
            enter-active-class="transition ease-out duration-100"
            enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100"
            leave-to-class="transform opacity-0 scale-95"
          >
            <div
              v-if="isUserMenuOpen"
              class="absolute bottom-full left-0 right-0 mb-2 bg-dark-100 dark:bg-dark-950 border border-dark-300 dark:border-dark-700 overflow-hidden"
            >
              <router-link
                to="/settings"
                @click="isUserMenuOpen = false"
                class="flex items-center px-4 py-3 text-xs uppercase tracking-wide text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-800 transition-colors"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Edit Profile
              </router-link>
              
              <router-link
                to="/settings"
                @click="isUserMenuOpen = false"
                class="flex items-center px-4 py-3 text-xs uppercase tracking-wide text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-800 transition-colors border-t border-dark-300 dark:border-dark-700"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </router-link>

              <button
                @click="handleLogout"
                class="flex items-center w-full px-4 py-3 text-xs uppercase tracking-wide text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-dark-300 dark:border-dark-700"
              >
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </transition>
        </div>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Header -->
      <header class="sticky top-0 z-40 bg-dark-50/90 dark:bg-dark-950/90 backdrop-blur border-b border-dark-300 dark:border-dark-800">
        <div class="flex items-center justify-between h-16 px-4 sm:px-6">
          <!-- Mobile menu button -->
          <button
            @click="toggleSidebar"
            class="lg:hidden btn-icon"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <!-- Search -->
          <div class="flex-1 max-w-lg mx-4 hidden sm:block">
            <input
              type="search"
              placeholder="Search posts..."
              class="input text-sm"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center space-x-2">
            <!-- Dark Mode Toggle -->
            <button
              @click="toggleDarkMode"
              class="btn-icon"
              title="Toggle dark mode"
            >
              <svg v-if="!isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </button>

            <!-- New Post Button -->
            <router-link
              to="/posts/new"
              class="btn btn-primary hidden sm:inline-flex"
            >
              New Post
            </router-link>
          </div>
        </div>
        <div class="h-8 px-4 sm:px-6 flex items-center justify-between text-[11px] uppercase tracking-[0.08em] border-t border-dark-300 dark:border-dark-800 text-dark-600 dark:text-dark-400">
          <span>Normal</span>
          <span>{{ $route.name }}</span>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-4 sm:p-6 lg:p-8">
        <div class="border border-dark-300 dark:border-dark-800 bg-dark-50 dark:bg-dark-900 min-h-[calc(100vh-9rem)] p-4 sm:p-6">
          <slot />
        </div>
      </main>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div
      v-if="isSidebarOpen"
      @click="toggleSidebar"
      class="fixed inset-0 z-40 bg-dark-950/60 lg:hidden"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useDarkMode } from '@/composables/useDarkMode'
import ConfirmDialog from '@/components/common/ConfirmDialog.vue'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const { isDark, toggleDarkMode } = useDarkMode()
const authStore = useAuthStore()
const isSidebarOpen = ref(false)
const isUserMenuOpen = ref(false)
const showLogoutConfirm = ref(false)

const currentUser = computed(() => {
  return {
    avatarUrl: 'https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff',
    displayName: authStore.isAuthenticated ? 'Admin User' : 'Guest',
    email: authStore.isAuthenticated ? 'admin@blog.com' : 'login required',
  }
})

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const handleLogout = () => {
  isUserMenuOpen.value = false
  showLogoutConfirm.value = true
}

const confirmLogout = async () => {
  showLogoutConfirm.value = false

  try {
    await authStore.logout()
  } finally {
    await router.replace('/login')
  }
}

// Navigation items
const navigation = [
  {
    name: 'Posts',
    href: '/posts',
    icon: 'PostsIcon',
  },
  {
    name: 'Categories',
    href: '/categories',
    icon: 'CategoriesIcon',
  },
  {
    name: 'Tags',
    href: '/tags',
    icon: 'TagsIcon',
  },
  {
    name: 'Settings',
    href: '/settings',
    icon: 'SettingsIcon',
  },
]

// Simple icon components (inline)
const PostsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>`
}

const CategoriesIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>`
}

const TagsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>`
}

const SettingsIcon = {
  template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>`
}
</script>
