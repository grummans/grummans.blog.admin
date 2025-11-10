# 🚀 Quick Start Guide

## Chạy Project trong 3 Bước

### 1. Cài đặt Dependencies
```bash
cd e:\personal-project\blog_admin_panel
npm install
```

### 2. Chạy Development Server
```bash
npm run dev
```

### 3. Mở Browser
```
http://localhost:5173
```

---

## 🔑 Login

Sử dụng bất kỳ email/password nào:
- **Email:** `admin@blog.com` (hoặc bất kỳ)
- **Password:** `admin123` (hoặc bất kỳ)

---

## 📱 Tính Năng Chính

### Dashboard (/)
- Xem statistics tổng quan
- Recent posts
- Quick actions

### Posts (/posts)
- Danh sách tất cả posts
- Search & filter
- Click để edit

### Create/Edit Post (/posts/new hoặc /posts/:id)
- Rich text editor với TipTap
- Upload featured image
- Chọn categories & tags
- Set status (Draft/Published/Scheduled)
- SEO fields

### Media Library (/media)
- Grid/List view toggle
- Upload từ URL
- Copy URL, delete actions
- Search & filter

### Categories (/categories)
- Create, edit, delete categories
- Auto-generate slug
- View post count

### Tags (/tags)
- Manage tags
- Search tags
- Post count tracking

### Settings (/settings)
- General settings (site info)
- Appearance (theme, display)
- User profile
- Logout / Clear data

---

## 🎨 Dark Mode

Toggle dark mode từ:
- Header (khi đã login)
- Login page

Dark mode được lưu vào localStorage!

---

## 💾 Data Persistence

**Lưu ý:** Hiện tại data chỉ lưu trong memory (mock data).

Khi refresh page:
- Login state được lưu trong localStorage
- Mock data sẽ reset về mặc định

Để thay đổi mock data, edit file:
```
src/mock/data.ts
```

---

## 🛠 Development Commands

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check
```

---

## 📁 Cấu Trúc Quan Trọng

```
src/
├── components/
│   ├── editor/
│   │   └── TipTapEditor.vue    # Rich text editor
│   └── layout/
│       └── AppLayout.vue       # Main layout
├── views/
│   ├── DashboardView.vue
│   ├── LoginView.vue
│   ├── posts/
│   │   ├── PostsListView.vue
│   │   └── PostEditorView.vue
│   ├── MediaView.vue
│   ├── CategoriesView.vue
│   ├── TagsView.vue
│   └── SettingsView.vue
├── composables/
│   └── useDarkMode.ts          # Dark mode logic
├── mock/
│   └── data.ts                 # Mock data
└── router/
    └── index.ts                # Routes config
```

---

## 🐛 Troubleshooting

### Port đã được sử dụng?
```bash
# Vite sẽ tự động chọn port khác (5174, 5175...)
# Hoặc specify port:
npm run dev -- --port 3000
```

### Dark mode không hoạt động?
- Clear localStorage
- Hard refresh (Ctrl+F5)

### Tailwind classes không work?
- Restart dev server
- Check console for errors

### TypeScript errors?
- Non-critical, app vẫn chạy được
- Chủ yếu là mock data type issues

---

## 🎯 Testing Checklist

### ✅ Login Flow
- [ ] Login với bất kỳ credentials
- [ ] Redirect to dashboard
- [ ] Dark mode toggle works

### ✅ Posts
- [ ] View posts list
- [ ] Search posts
- [ ] Filter by status
- [ ] Click to edit
- [ ] Create new post
- [ ] Rich editor works
- [ ] Add featured image
- [ ] Select categories/tags
- [ ] Save draft
- [ ] Publish post

### ✅ Media
- [ ] Switch grid/list view
- [ ] Upload from URL
- [ ] Copy URL
- [ ] Delete media
- [ ] View detail

### ✅ Categories
- [ ] Create category
- [ ] Edit category
- [ ] Delete category
- [ ] Auto-slug generation

### ✅ Tags
- [ ] Create tag
- [ ] Edit tag
- [ ] Delete tag
- [ ] Search tags

### ✅ Settings
- [ ] Update site info
- [ ] Change theme
- [ ] Update profile
- [ ] Logout works

---

## 💡 Tips

### Keyboard Shortcuts trong Editor
- **Ctrl+B** - Bold
- **Ctrl+I** - Italic
- **Ctrl+Z** - Undo
- **Ctrl+Y** - Redo

### Dark Mode
- Automatically follows system preference
- Manual toggle saves to localStorage
- Smooth transitions

### Best Practices
- Save draft frequently
- Use meaningful slugs
- Organize with categories & tags
- Test on mobile view

---

## 📞 Need Help?

Check these files:
- `README.md` - Full documentation
- `DEVELOPMENT.md` - Development guide
- `COMPLETED.md` - Feature checklist

---

**Enjoy your new Blog Admin Panel! 🎉**
