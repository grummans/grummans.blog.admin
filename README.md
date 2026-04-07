# Blog Admin Panel

> A modern blog administration panel inspired by Ghost CMS, built with Vue 3 + TypeScript + Tailwind CSS

## ✨ Features

### ✅ Fully Implemented
- 🌓 **Dark Mode** - Full dark mode support with smooth transitions
- 📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- 🔐 **Authentication** - Login page with mock authentication
- 📊 **Dashboard** - Analytics overview with stats, charts, and recent posts
- 📝 **Posts Management** - Complete CRUD with list, filter, and search
- ✍️ **Rich Text Editor** - TipTap editor with Markdown support, formatting tools, and image insertion
- 📷 **Media Library** - Upload, manage, and organize media files with grid/list view
- 🏷️ **Categories Management** - Create, edit, and delete categories
- 🔖 **Tags Management** - Full tags CRUD operations
- ⚙️ **Settings Panel** - General, appearance, and profile settings
- 🎨 **Modern UI** - Clean, professional interface inspired by Ghost CMS
- 🧭 **Navigation** - Smooth routing and sidebar navigation

### 🚧 Coming Soon (Backend Phase)
- Backend integration (Spring Boot + PostgreSQL)
- Real authentication & user management
- API endpoints for all CRUD operations
- File upload to server
- Database persistence
- User roles & permissions

## 🛠 Tech Stack

- **Frontend Framework:** Vue 3 (Composition API)
- **Type Safety:** TypeScript
- **Styling:** Tailwind CSS v3
- **Routing:** Vue Router
- **State Management:** Pinia
- **Build Tool:** Vite
- **Backend (Planned):** Java Spring Boot
- **Database (Planned):** PostgreSQL

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Access the App

1. Open browser at `http://localhost:5173`
2. You'll see the login page
3. Use demo credentials:
   - **Email:** `admin@blog.com`
   - **Password:** `admin123`

## 📁 Project Structure

```
blog_admin_panel/
├── src/
│   ├── assets/              # Static assets & styles
│   ├── components/          
│   │   ├── common/          # Reusable components
│   │   ├── dashboard/       # Dashboard widgets
│   │   ├── editor/          # Editor components (TODO)
│   │   └── layout/          # Layout components (Sidebar, Header)
│   ├── views/               # Page components
│   │   ├── posts/           # Post-related views
│   │   ├── DashboardView.vue
│   │   ├── LoginView.vue
│   │   └── ...
│   ├── composables/         # Vue composables
│   │   └── useDarkMode.ts   # Dark mode logic
│   ├── stores/              # Pinia stores (TODO)
│   ├── router/              # Vue Router configuration
│   ├── mock/                # Mock data
│   │   └── data.ts          # Mock posts, users, stats
│   └── utils/               # Helper functions
├── public/                  # Public assets
└── ...config files
```

## 🎨 Design Features

### Color Scheme
- **Primary:** Blue (`#0ea5e9`)
- **Dark Mode:** Custom dark palette for comfortable reading
- **Transitions:** Smooth color transitions on theme change

### UI Components
- Custom button styles (`.btn`, `.btn-primary`, `.btn-secondary`)
- Card components (`.card`)
- Form inputs (`.input`)
- Status badges (Published, Draft, Scheduled)

## 📊 Mock Data

The app currently uses mock data to demonstrate UI:

- **5 sample posts** with different statuses
- **1 admin user** profile
- **Dashboard statistics** (views, posts, comments)
- **Categories & Tags** for post organization

## 🔮 Roadmap

### Phase 1: Core Features ✅ COMPLETED
- [x] Project setup
- [x] Dark mode
- [x] Authentication UI
- [x] Dashboard
- [x] Posts list
- [x] Rich text editor (TipTap)
- [x] Media manager
- [x] Categories management
- [x] Tags management
- [x] Settings panel

### Phase 2: Backend Integration
- [ ] Spring Boot API
- [ ] PostgreSQL setup
- [ ] Real authentication
- [ ] CRUD operations

### Phase 3: Advanced Features (Future)
- [ ] SEO optimization tools
- [ ] Analytics integration (Google Analytics)
- [ ] Comments system
- [ ] Newsletter integration
- [ ] Multi-language support
- [ ] Social media sharing
- [ ] Export/Import functionality

## 🤝 Contributing

This is a personal project but suggestions are welcome!

## 📝 License

MIT License

---
