<template>
  <div>
    <PromptDialog
      :visible="showAvatarPrompt"
      title="Change Avatar"
      message="Enter a valid avatar image URL"
      placeholder="https://example.com/avatar.jpg"
      :initial-value="profileSettings.avatar"
      confirm-text="Apply"
      cancel-text="Cancel"
      @confirm="applyAvatarUrl"
      @cancel="showAvatarPrompt = false"
    />

    <h1 class="page-title text-3xl mb-8">Settings</h1>

    <div class="space-y-6">
      <!-- General Settings -->
      <div class="card">
        <h2 class="text-xl text-heading mb-6">General Settings</h2>
        
        <form @submit.prevent="saveGeneral" class="space-y-6">
          <div>
            <label class="label">
              Site Title
            </label>
            <input
              v-model="generalSettings.siteTitle"
              type="text"
              class="input"
              placeholder="My Awesome Blog"
            />
          </div>

          <div>
            <label class="label">
              Site Description
            </label>
            <textarea
              v-model="generalSettings.siteDescription"
              rows="3"
              class="input resize-none"
              placeholder="A brief description of your blog"
            />
          </div>

          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">
              Save Changes
            </button>
          </div>
        </form>
      </div>

      <!-- Appearance -->
      <div class="card">
        <h2 class="text-xl text-heading mb-6">Appearance</h2>
        
        <div class="space-y-6">
          <div>
            <label class="label mb-4">
              Theme
            </label>
            <div class="grid grid-cols-3 gap-4">
              <button
                v-for="theme in themes"
                :key="theme.value"
                @click="appearanceSettings.theme = theme.value"
                :class="[
                  'p-4 rounded-lg border-2 transition-all text-left',
                  appearanceSettings.theme === theme.value
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-dark-700 hover:border-gray-300 dark:hover:border-dark-600'
                ]"
              >
                <div class="flex items-center gap-3 mb-2">
                  <component :is="theme.icon" class="w-5 h-5" />
                  <span class="font-medium text-gray-900 dark:text-gray-100">{{ theme.label }}</span>
                </div>
                <p class="text-xs text-gray-600 dark:text-gray-400">{{ theme.description }}</p>
              </button>
            </div>
          </div>

          <div>
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show reading time
              </span>
              <input
                v-model="appearanceSettings.showReadingTime"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          <div>
            <label class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show view count
              </span>
              <input
                v-model="appearanceSettings.showViewCount"
                type="checkbox"
                class="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
            </label>
          </div>

          <div class="flex justify-end pt-4">
            <button @click="saveAppearance" class="btn btn-primary">
              Save Appearance
            </button>
          </div>
        </div>
      </div>

      <!-- User Profile -->
      <div class="card">
        <h2 class="text-xl text-heading mb-6">User Profile</h2>
        
        <form @submit.prevent="saveProfile" class="space-y-6">
          <div class="flex items-start gap-6">
            <div>
              <img
                :src="profileSettings.avatar"
                alt="Avatar"
                class="w-24 h-24 rounded-full"
              />
              <button
                type="button"
                @click="changeAvatar"
                class="mt-2 text-sm text-primary-600 dark:text-primary-400 hover:underline"
              >
                Change Avatar
              </button>
            </div>

            <div class="flex-1 space-y-4">
              <div>
                <label class="label">
                  Display Name
                </label>
                <input
                  v-model="profileSettings.name"
                  type="text"
                  class="input"
                />
              </div>

              <div>
                <label class="label">
                  Email
                </label>
                <input
                  v-model="profileSettings.email"
                  type="email"
                  class="input"
                />
              </div>

              <div>
                <label class="label">
                  Bio
                </label>
                <textarea
                  v-model="profileSettings.bio"
                  rows="3"
                  class="input resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>
          </div>

          <div class="flex justify-end">
            <button type="submit" class="btn btn-primary">
              Update Profile
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { mockAuthors } from '@/mock/data'
import PromptDialog from '@/components/common/PromptDialog.vue'
import { useToast } from '@/composables/useToast'

const toast = useToast()

const generalSettings = ref({
  siteTitle: 'My Blog',
  siteDescription: 'A personal blog about technology and life',
})

const appearanceSettings = ref({
  theme: 'auto',
  showReadingTime: true,
  showViewCount: true,
})

const profileSettings = ref({
  ...mockAuthors[0]!,
})

const showAvatarPrompt = ref(false)

const themes = [
  {
    value: 'light',
    label: 'Light',
    description: 'Always use light theme',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`
    }
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always use dark theme',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`
    }
  },
  {
    value: 'auto',
    label: 'Auto',
    description: 'Follow system preference',
    icon: {
      template: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>`
    }
  }
]

const saveGeneral = () => {
  console.log('Saving general settings:', generalSettings.value)
  toast.success('General settings saved!')
}

const saveAppearance = () => {
  console.log('Saving appearance settings:', appearanceSettings.value)
  toast.success('Appearance settings saved!')
}

const saveProfile = () => {
  console.log('Saving profile:', profileSettings.value)
  toast.success('Profile updated!')
}

const changeAvatar = () => {
  showAvatarPrompt.value = true
}

const applyAvatarUrl = (url: string) => {
  const value = url.trim()
  if (!value) {
    toast.warning('Avatar URL cannot be empty')
    return
  }

  profileSettings.value.avatar = value
  showAvatarPrompt.value = false
  toast.success('Avatar updated!')
}

</script>
