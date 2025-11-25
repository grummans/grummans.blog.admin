import { api } from './api'
import type { Post } from '@/mock/data'
import { mockAuthors, mockCategories, mockTags } from '@/mock/data'

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
  categoryId: number | null
  tagId: number[]
  slug: string
  metaTitle: string
  metaDescription: string
  authorId: string
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
  
  // Find category and tags from mock data (will be replaced with real API later)
  const category = mockCategories.find(c => c.id === String(apiPost.categoryId)) || null
  const tags = apiPost.tagId?.map(tagId => 
    mockTags.find(t => t.id === String(tagId))
  ).filter(Boolean) as any[] || []
  
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
    author: mockAuthors[0] || {
      id: '1',
      name: 'Admin',
      email: 'admin@blog.com',
      avatar: 'https://ui-avatars.com/api/?name=Admin&background=0ea5e9&color=fff',
      bio: 'Admin user',
      role: 'admin' as const,
    },
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
