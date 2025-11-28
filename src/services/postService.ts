import { api } from './api'
import type { Post } from '@/mock/data'

// Backend response types - Full DTO for detail view
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
  featuredImageUrl?: string | null
  isFeatured?: boolean
}

// Simple DTO for create/update responses
export interface SimplePostResponse {
  id: number
  title: string
  slug: string
  excerpt: string
  featuredImageUrl: string | null
  updatedAt: string
}

export interface PaginatedPostsResponse {
  page: number
  content: PostApiResponse[]
  size: number
  totalElements: number
  totalPages: number
}

// Map API response to frontend Post format
function mapApiResponseToPost(apiPost: PostApiResponse | null): Post | null {
  if (!apiPost) {
    return null
  }
  
  const status = apiPost.status?.toLowerCase() as 'draft' | 'published' | 'scheduled' || 'draft'
  
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
  
  // Map author from API - handle null author
  const author = apiPost.author ? {
    id: String(apiPost.author.id),
    name: apiPost.author.displayName,
    email: `${apiPost.author.username}@blog.com`,
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(apiPost.author.displayName)}&background=0ea5e9&color=fff`,
    bio: '',
    role: 'admin' as const,
  } : {
    id: '0',
    name: 'Unknown',
    email: 'unknown@blog.com',
    avatar: 'https://ui-avatars.com/api/?name=Unknown&background=0ea5e9&color=fff',
    bio: '',
    role: 'admin' as const,
  }
  
  return {
    id: String(apiPost.id || 0),
    title: apiPost.title || '',
    slug: apiPost.slug || '',
    content: apiPost.content || '',
    excerpt: apiPost.excerpt || '',
    featuredImage: apiPost.featuredImageUrl || null,
    status,
    publishedAt: apiPost.publishedAt || null,
    createdAt: apiPost.createdAt || apiPost.updatedAt || new Date().toISOString(),
    updatedAt: apiPost.updatedAt || new Date().toISOString(),
    author,
    category,
    tags,
    views: apiPost.viewCount || 0,
    readingTime: apiPost.readingTimeMinutes || 5,
    metaTitle: apiPost.metaTitle || '',
    metaDescription: apiPost.metaDescription || '',
    isFeatured: apiPost.isFeatured || false,
  }
}

export interface CreatePostDto {
  title: string
  slug?: string
  content: string
  excerpt?: string
  featuredImage?: string | null
  status?: 'draft' | 'published' | 'scheduled'
  categoryId?: number | null
  tagId?: number[]  // Backend expects tagId, not tagIds
  authorUsername?: string
  metaTitle?: string
  metaDescription?: string
  readingTimeMinutes?: number
  isFeatured?: boolean  // For highlighting important posts
}

export interface UpdatePostDto extends Partial<CreatePostDto> {
  id?: string
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
    return apiPosts.map(mapApiResponseToPost).filter((post): post is Post => post !== null)
  },

  // Get single post by ID
  async getById(id: string) {
    const response = await api.get<PostApiResponse>(`/a/posts/${id}`)
    const post = mapApiResponseToPost(response.data)
    if (!post) {
      throw new Error('Post not found')
    }
    return post
  },

  // Create new post with multipart/form-data support
  // Returns SimplePostResponse (lightweight) instead of full Post
  async create(data: CreatePostDto, featuredImageFile?: File): Promise<SimplePostResponse | null> {
    const formData = new FormData()
    
    // Convert status to uppercase for backend
    const postData = {
      ...data,
      status: data.status?.toUpperCase() || 'DRAFT',
    }
    
    // Append post data as JSON blob
    formData.append('post', new Blob([JSON.stringify(postData)], {
      type: 'application/json'
    }))
    
    // Append featured image file if provided
    if (featuredImageFile) {
      formData.append('featuredImage', featuredImageFile)
    }
    
    const response = await api.post<SimplePostResponse>('/a/posts/create', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    // Handle case where backend returns null or no data
    if (!response.data) {
      return null
    }
    
    return response.data
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
