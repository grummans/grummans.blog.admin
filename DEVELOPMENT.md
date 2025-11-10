# Development Guide

## 🎯 Mục tiêu dự án

Xây dựng một blog admin panel hiện đại lấy cảm hứng từ Ghost CMS, với đầy đủ tính năng quản lý blog chuyên nghiệp.

## 📦 Cài đặt và Chạy

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm run dev

# Build production
npm run build

# Preview production build
npm run preview
```

## 🔑 Demo Credentials

- **Email:** admin@blog.com
- **Password:** admin123 (hoặc bất kỳ password nào - hiện tại chỉ là mock)

## 🏗 Kiến trúc

### Cấu trúc thư mục

```
src/
├── assets/          # CSS và static files
├── components/      
│   ├── common/      # Button, Input, Modal... (TODO)
│   ├── dashboard/   # Dashboard widgets (TODO)
│   ├── editor/      # Editor components (TODO)
│   └── layout/      # AppLayout, Sidebar, Header
├── views/           # Page components
│   ├── posts/       # Post list & editor
│   ├── DashboardView.vue
│   ├── LoginView.vue
│   └── ...
├── composables/     # Vue composables
│   └── useDarkMode.ts
├── stores/          # Pinia stores (TODO)
├── router/          # Vue Router config
├── mock/            # Mock data
│   └── data.ts
└── utils/           # Helpers (TODO)
```

### Tech Stack

- **Vue 3** với Composition API và `<script setup>`
- **TypeScript** để type safety
- **Tailwind CSS v3** cho styling
- **Vite** cho build tool
- **Pinia** cho state management (chưa dùng nhiều)
- **Vue Router** cho routing

## 🎨 Styling Guide

### Tailwind Classes đã custom

Trong `src/assets/main.css`:

```css
/* Buttons */
.btn               // Base button
.btn-primary       // Primary action
.btn-secondary     // Secondary action

/* Card */
.card              // White/dark card with shadow

/* Input */
.input             // Form input với dark mode
```

### Dark Mode

Dark mode được implement qua:
- `composables/useDarkMode.ts` - Logic toggle và lưu preference
- Tailwind `dark:` variant - Styling
- `localStorage` - Lưu user preference

Usage:
```vue
<script setup>
import { useDarkMode } from '@/composables/useDarkMode'
const { isDark, toggleDarkMode } = useDarkMode()
</script>
```

### Color Palette

- **Primary:** `#0ea5e9` (blue-500)
- **Dark Background:** `#0f172a` (dark-900)
- **Dark Surface:** `#1e293b` (dark-800)

## 📝 Mock Data

File `src/mock/data.ts` chứa:

```typescript
export interface Post { ... }
export interface Author { ... }
export interface Category { ... }
export interface Tag { ... }

export const mockPosts: Post[]
export const mockAuthors: Author[]
export const mockCategories: Category[]
export const mockTags: Tag[]
export const mockDashboardStats: DashboardStats
```

## 🔐 Authentication Flow (Mock)

1. User truy cập app → redirect đến `/login`
2. Nhập email/password bất kỳ → set `localStorage.setItem('isAuthenticated', 'true')`
3. Router guard check authentication → allow access
4. Navigate to dashboard

## 🚀 Next Steps (TODO)

### Phase 1: Core Features
1. **Rich Text Editor**
   - Integrate TipTap hoặc Toast UI Editor
   - Markdown support
   - Visual blocks (như Ghost)
   - Image upload inline

2. **Media Library**
   - Grid view của images
   - Upload multiple files
   - Search và filter
   - Image optimization preview

3. **Categories & Tags Management**
   - CRUD operations
   - Assign to posts
   - View post count

4. **Complete Post Editor**
   - Full editor integration
   - Meta fields (SEO title, description)
   - Featured image upload
   - Publish/Schedule options
   - Preview mode

### Phase 2: Backend Integration
1. Setup Spring Boot API
2. PostgreSQL database
3. JWT authentication
4. RESTful endpoints
5. File upload service

### Phase 3: Advanced Features
1. User roles & permissions
2. Comments system
3. Analytics integration
4. SEO tools
5. Newsletter system

## 🐛 Known Issues

- TypeScript errors trong mock data (non-critical)
- Chưa có error handling
- Chưa có loading states
- Chưa có confirmation modals

## 💡 Tips

### Hot Reload Issues
Nếu hot reload không hoạt động, thử:
```bash
npm run dev -- --force
```

### Dark Mode Not Persisting
Check localStorage trong DevTools:
```javascript
localStorage.getItem('theme') // should be 'dark' or 'light'
```

### Tailwind Classes Not Working
1. Check `tailwind.config.js` content paths
2. Restart dev server
3. Clear browser cache

## 📚 Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Ghost CMS](https://ghost.org/) - Design inspiration
- [TipTap Editor](https://tiptap.dev/) - Rich text editor option

---

Happy coding! 🎉
