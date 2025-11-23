export interface Post {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string | null
  status: 'draft' | 'published' | 'scheduled'
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  author: Author
  category: Category | null
  tags: Tag[]
  views: number
  readingTime: number
  metaTitle?: string
  metaDescription?: string
}

export interface Author {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  role: 'admin' | 'editor' | 'author'
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  postCount: number
}

export interface Tag {
  id: string
  name: string
  slug: string
  postCount: number
}

export interface Media {
  id: string
  url: string
  name: string
  size: number
  type: string
  uploadedAt: string
}

export interface DashboardStats {
  totalPosts: number
  totalViews: number
  totalComments: number
  publishedPosts: number
  draftPosts: number
}

// Mock Authors
export const mockAuthors: Author[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@blog.com',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=0ea5e9&color=fff',
    bio: 'Blog administrator and content creator',
    role: 'admin',
  },
]

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Technology', slug: 'technology', description: 'Tech news and tutorials', postCount: 15 },
  { id: '2', name: 'Lifestyle', slug: 'lifestyle', description: 'Life tips and stories', postCount: 8 },
  { id: '3', name: 'Travel', slug: 'travel', description: 'Travel guides and experiences', postCount: 12 },
  { id: '4', name: 'Food', slug: 'food', description: 'Recipes and restaurant reviews', postCount: 6 },
]

// Mock Tags
export const mockTags: Tag[] = [
  { id: '1', name: 'JavaScript', slug: 'javascript', postCount: 10 },
  { id: '2', name: 'Vue.js', slug: 'vuejs', postCount: 8 },
  { id: '3', name: 'Web Development', slug: 'web-development', postCount: 15 },
  { id: '4', name: 'Tutorial', slug: 'tutorial', postCount: 12 },
  { id: '5', name: 'Tips', slug: 'tips', postCount: 7 },
]

// Mock Posts
export const mockPosts: Post[] = [
  {
    id: '1',
    title: 'Getting Started with Vue 3 and TypeScript',
    slug: 'getting-started-vue3-typescript',
    content: '# Getting Started with Vue 3 and TypeScript\n\nVue 3 brings many improvements...',
    excerpt: 'Learn how to set up a Vue 3 project with TypeScript from scratch.',
    featuredImage: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    status: 'published',
    publishedAt: '2025-11-05T10:00:00Z',
    createdAt: '2025-11-04T10:00:00Z',
    updatedAt: '2025-11-05T10:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[0]!,
    tags: [mockTags[0], mockTags[1], mockTags[3]],
    views: 1250,
    readingTime: 5,
  },
  {
    id: '2',
    title: 'Building a Dark Mode Toggle with Tailwind CSS',
    slug: 'dark-mode-tailwind-css',
    content: '# Building a Dark Mode Toggle\n\nDark mode is essential for modern web apps...',
    excerpt: 'A comprehensive guide to implementing dark mode in your web application.',
    featuredImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    status: 'published',
    publishedAt: '2025-11-03T14:30:00Z',
    createdAt: '2025-11-02T14:30:00Z',
    updatedAt: '2025-11-03T14:30:00Z',
    author: mockAuthors[0],
    category: mockCategories[0]!,
    tags: [mockTags[2], mockTags[3], mockTags[4]],
    views: 856,
    readingTime: 7,
  },
  {
    id: '3',
    title: 'Top 10 Productivity Tips for Developers',
    slug: 'productivity-tips-developers',
    content: '# Productivity Tips\n\nHere are my top 10 tips...',
    excerpt: 'Boost your productivity with these proven tips and techniques.',
    featuredImage: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
    status: 'published',
    publishedAt: '2025-11-01T09:00:00Z',
    createdAt: '2025-10-31T09:00:00Z',
    updatedAt: '2025-11-01T09:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[1]!,
    tags: [mockTags[4]],
    views: 2340,
    readingTime: 4,
  },
  {
    id: '4',
    title: 'My Journey Through Southeast Asia',
    slug: 'journey-southeast-asia',
    content: '# Southeast Asia Travel Guide\n\nMy 3-month adventure...',
    excerpt: 'A detailed travel guide covering Thailand, Vietnam, and Indonesia.',
    featuredImage: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    status: 'draft',
    publishedAt: null,
    createdAt: '2025-10-30T15:00:00Z',
    updatedAt: '2025-11-06T11:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[2]!,
    tags: [],
    views: 0,
    readingTime: 12,
  },
  {
    id: '5',
    title: 'The Ultimate Guide to Vietnamese Coffee',
    slug: 'vietnamese-coffee-guide',
    content: '# Vietnamese Coffee\n\nEverything you need to know...',
    excerpt: 'Discover the rich culture and unique brewing methods of Vietnamese coffee.',
    featuredImage: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800',
    status: 'scheduled',
    publishedAt: '2025-11-10T08:00:00Z',
    createdAt: '2025-11-05T16:00:00Z',
    updatedAt: '2025-11-06T10:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[3]!,
    tags: [],
    views: 0,
    readingTime: 6,
  },
  {
    id: '6',
    title: 'Mastering CSS Grid Layout in 2025',
    slug: 'mastering-css-grid-layout',
    content: '# CSS Grid Layout\n\nCSS Grid is a powerful layout system...',
    excerpt: 'Master CSS Grid with practical examples and best practices.',
    featuredImage: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800',
    status: 'published',
    publishedAt: '2025-10-28T11:00:00Z',
    createdAt: '2025-10-27T11:00:00Z',
    updatedAt: '2025-10-28T11:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[0]!,
    tags: [mockTags[2], mockTags[3]],
    views: 1580,
    readingTime: 8,
  },
  {
    id: '7',
    title: 'Healthy Breakfast Ideas for Busy Mornings',
    slug: 'healthy-breakfast-ideas',
    content: '# Healthy Breakfast Ideas\n\nStart your day right...',
    excerpt: 'Quick and nutritious breakfast recipes for busy professionals.',
    featuredImage: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800',
    status: 'published',
    publishedAt: '2025-10-25T07:30:00Z',
    createdAt: '2025-10-24T07:30:00Z',
    updatedAt: '2025-10-25T07:30:00Z',
    author: mockAuthors[0],
    category: mockCategories[3]!,
    tags: [mockTags[4]],
    views: 920,
    readingTime: 5,
  },
  {
    id: '8',
    title: 'Best Beaches in Bali: A Complete Guide',
    slug: 'best-beaches-bali-guide',
    content: '# Best Beaches in Bali\n\nDiscover Bali\'s stunning beaches...',
    excerpt: 'From hidden gems to popular spots, explore Bali\'s best beaches.',
    featuredImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    status: 'published',
    publishedAt: '2025-10-22T13:00:00Z',
    createdAt: '2025-10-21T13:00:00Z',
    updatedAt: '2025-10-22T13:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[2]!,
    tags: [],
    views: 3150,
    readingTime: 10,
  },
  {
    id: '9',
    title: 'Understanding React Hooks: A Deep Dive',
    slug: 'understanding-react-hooks',
    content: '# React Hooks\n\nReact Hooks revolutionized functional components...',
    excerpt: 'A comprehensive guide to understanding and using React Hooks effectively.',
    featuredImage: 'https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=800',
    status: 'published',
    publishedAt: '2025-10-20T15:30:00Z',
    createdAt: '2025-10-19T15:30:00Z',
    updatedAt: '2025-10-20T15:30:00Z',
    author: mockAuthors[0],
    category: mockCategories[0]!,
    tags: [mockTags[0], mockTags[3]],
    views: 2100,
    readingTime: 9,
  },
  {
    id: '10',
    title: 'Minimalist Living: Less is More',
    slug: 'minimalist-living-guide',
    content: '# Minimalist Living\n\nEmbrace simplicity and intentional living...',
    excerpt: 'Transform your life with minimalist principles and practices.',
    featuredImage: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800',
    status: 'published',
    publishedAt: '2025-10-18T09:00:00Z',
    createdAt: '2025-10-17T09:00:00Z',
    updatedAt: '2025-10-18T09:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[1]!,
    tags: [mockTags[4]],
    views: 1720,
    readingTime: 6,
  },
  {
    id: '11',
    title: 'TypeScript Best Practices for Large Projects',
    slug: 'typescript-best-practices',
    content: '# TypeScript Best Practices\n\nScaling TypeScript projects requires careful planning...',
    excerpt: 'Learn essential TypeScript patterns for maintaining large codebases.',
    featuredImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800',
    status: 'draft',
    publishedAt: null,
    createdAt: '2025-10-16T10:00:00Z',
    updatedAt: '2025-11-05T14:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[0]!,
    tags: [mockTags[0], mockTags[3]],
    views: 0,
    readingTime: 11,
  },
  {
    id: '12',
    title: 'Traditional Italian Pasta Recipes',
    slug: 'traditional-italian-pasta',
    content: '# Italian Pasta\n\nAuthentic recipes from Italy...',
    excerpt: 'Cook like a Italian nonna with these traditional pasta recipes.',
    featuredImage: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
    status: 'published',
    publishedAt: '2025-10-15T12:00:00Z',
    createdAt: '2025-10-14T12:00:00Z',
    updatedAt: '2025-10-15T12:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[3]!,
    tags: [],
    views: 2890,
    readingTime: 7,
  },
  {
    id: '13',
    title: 'Photography Tips for Travel Bloggers',
    slug: 'photography-tips-travel-bloggers',
    content: '# Travel Photography\n\nCapture stunning travel moments...',
    excerpt: 'Essential photography tips to elevate your travel blog content.',
    featuredImage: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800',
    status: 'published',
    publishedAt: '2025-10-12T14:30:00Z',
    createdAt: '2025-10-11T14:30:00Z',
    updatedAt: '2025-10-12T14:30:00Z',
    author: mockAuthors[0],
    category: mockCategories[2]!,
    tags: [mockTags[4]],
    views: 1450,
    readingTime: 8,
  },
  {
    id: '14',
    title: 'Building RESTful APIs with Node.js',
    slug: 'building-restful-apis-nodejs',
    content: '# RESTful APIs with Node.js\n\nLearn to build scalable APIs...',
    excerpt: 'A practical guide to creating RESTful APIs using Node.js and Express.',
    featuredImage: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800',
    status: 'scheduled',
    publishedAt: '2025-11-12T10:00:00Z',
    createdAt: '2025-10-10T16:00:00Z',
    updatedAt: '2025-11-04T09:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[0]!,
    tags: [mockTags[0], mockTags[2], mockTags[3]],
    views: 0,
    readingTime: 12,
  },
  {
    id: '15',
    title: 'Work-Life Balance in Tech Industry',
    slug: 'work-life-balance-tech',
    content: '# Work-Life Balance\n\nMaintaining balance in a demanding industry...',
    excerpt: 'Strategies for maintaining healthy work-life balance as a developer.',
    featuredImage: 'https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800',
    status: 'published',
    publishedAt: '2025-10-08T11:00:00Z',
    createdAt: '2025-10-07T11:00:00Z',
    updatedAt: '2025-10-08T11:00:00Z',
    author: mockAuthors[0],
    category: mockCategories[1]!,
    tags: [mockTags[4]],
    views: 3420,
    readingTime: 6,
  },
]

// Mock Media
export const mockMedia: Media[] = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800',
    name: 'vue-typescript.jpg',
    size: 245000,
    type: 'image/jpeg',
    uploadedAt: '2025-11-04T10:00:00Z',
  },
  {
    id: '2',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    name: 'dark-mode.jpg',
    size: 189000,
    type: 'image/jpeg',
    uploadedAt: '2025-11-02T14:30:00Z',
  },
]

// Mock Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalPosts: 15,
  totalViews: 21676,
  totalComments: 87,
  publishedPosts: 11,
  draftPosts: 2,
}
