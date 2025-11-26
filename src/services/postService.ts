import { api } from './api'
import type { Post } from '@/mock/data'

// Backend response types
export interface PostApiResponse {
  id: number
  title: string
  excerpt: string
  content?: string
  viewCount: number
  readingTimeMinutes: number
  updatedAt: string
  createdAt?: string
  publishedAt?: string
  status: 'DRAFT' | 'PUBLISHED' | 'SCHEDULED'
  category: {
    id: number
    name: string
    slug: string
  } | null
  tags: Array<{
    id: number
    name: string
    slug: string
  }>
  slug: string
  metaTitle: string
  metaDescription: string
  author: {
    id: number
    username: string
    displayName: string
  }
  featuredImage?: string | null
}

export interface PaginatedPostsResponse {
  page: number
  content: PostApiResponse[]
  size: number
  totalElements: number
  totalPages: number
}

// Map API response to frontend Post format
function mapApiResponseToPost(apiPost: PostApiResponse): Post {
  const status = apiPost.status.toLowerCase() as 'draft' | 'published' | 'scheduled'
  
  // Map category from API
  const category = apiPost.category ? {
    id: String(apiPost.category.id),
    name: apiPost.category.name,
    slug: apiPost.category.slug,
    description: '',
    postCount: 0,
  } : null
  
  // Map tags from API
  const tags = apiPost.tags?.map(tag => ({
    id: String(tag.id),
    name: tag.name,
    slug: tag.slug,
    postCount: 0,
  })) || []
  
  // Map author from API
  const author = {
    id: String(apiPost.author.id),
    name: apiPost.author.displayName,
    email: `${apiPost.author.username}@blog.com`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiPost.author.displayName)}&background=0ea5e9&color=fff`,
    bio: '',
    role: 'admin' as const,
  }
  
  return {
    id: String(apiPost.id),
    title: apiPost.title,
    slug: apiPost.slug,
    content: apiPost.content || '',
    excerpt: apiPost.excerpt,
    featuredImage: apiPost.featuredImage || null,
    status,
    publishedAt: apiPost.publishedAt || null,
    createdAt: apiPost.createdAt || apiPost.updatedAt,
    updatedAt: apiPost.updatedAt,
    author,
    category,
    tags,
    views: apiPost.viewCount,
    readingTime: apiPost.readingTimeMinutes,
    metaTitle: apiPost.metaTitle,
    metaDescription: apiPost.metaDescription,
  }
}

export interface CreatePostDto {
  title: string
  slug?: string
  content: string
  excerpt?: string
  featuredImage?: string | null
  status?: 'draft' | 'published' | 'scheduled'
  categoryId?: string | null
  tagIds?: string[]
  metaTitle?: string
  metaDescription?: string
  readingTime?: number
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  id: string
}

// Post Service
export const postService = {
  // Get all posts (with pagination)
  async getAll(page: number = 1, size: number = 100) {
    const response = await api.get<PaginatedPostsResponse>('/a/posts/list', {
      params: { page, size }
    })
    return response.data
  },

  // Get all posts content only
  async getAllContent() {
    const response = await this.getAll(1, 100)
    const apiPosts = response.content || []
    return apiPosts.map(mapApiResponseToPost)
  },

  // Get single post by ID
  async getById(id: string) {
    const response = await api.get<PostApiResponse>(`/a/posts/${id}`)
    return mapApiResponseToPost(response.data)
  },

  // Create new post
  async create(data: CreatePostDto) {
    const response = await api.post<PostApiResponse>('/a/posts/create', data)
    return mapApiResponseToPost(response.data)
  },

  // Update existing post
  async update(id: string, data: UpdatePostDto) {
    const response = await api.put<PostApiResponse>(`/a/posts/${id}`, data)
    return mapApiResponseToPost(response.data)
  },

  // Delete post
  async delete(id: string) {
    const response = await api.delete(`/a/posts/${id}`)
    return response.data
  },

  // Publish draft post
  async publish(id: string) {
    const response = await api.post<Post>(`/a/posts/${id}/publish`)
    return response.data
  },
}
