import { api } from './api'
import type { Post } from '@/mock/data'
import type { PostAttachment } from './attachmentService'

// Backend response types - Full DTO for detail view
export interface PostApiResponse {
  id: number
  title: string
  excerpt: string
  content?: string
  contentHtml?: string  // HTML content for TipTap editor
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
  attachments?: PostAttachment[]  // Post attachments from backend
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
    content: apiPost.contentHtml || apiPost.content || '',  // Prefer contentHtml for TipTap editor
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
  id?: number | null  // null = tạo mới, number = update existing
  title: string
  slug?: string
  content?: string
  excerpt?: string
  categoryId?: number | null  // 0 hoặc null = chưa chọn
  tagId?: number[]  // [] = chưa chọn tags
  authorUsername?: string
  metaTitle?: string
  metaDescription?: string
  readingTimeMinutes?: number
  isFeatured?: boolean
}

export interface UpdatePostDto extends Partial<CreatePostDto> {}

// Post Service
export const postService = {
  // Get all posts (with pagination and optional status filter)
  async getAll(page: number = 1, size: number = 100, status?: 'DRAFT' | 'PUBLISHED') {
    const response = await api.get<PaginatedPostsResponse>('/a/posts/list', {
      params: { page, size, status }
    })
    return response.data
  },

  // Get all posts content only
  async getAllContent(status?: 'DRAFT' | 'PUBLISHED') {
    const response = await this.getAll(1, 100, status)
    const apiPosts = response.content || []
    return apiPosts.map(mapApiResponseToPost).filter((post): post is Post => post !== null)
  },

  // Get all drafts
  async getDrafts(page: number = 1, size: number = 100) {
    const response = await api.get<PaginatedPostsResponse>('/a/posts/drafts', {
      params: { page, size }
    })
    return response.data
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

  /**
   * Save draft - Lưu nháp (không validate)
   * - id = null/undefined: Tạo draft mới
   * - id = number: Update draft hiện tại
   */
  async saveDraft(data: CreatePostDto, featuredImageFile?: File): Promise<SimplePostResponse | null> {
    const formData = new FormData()
    
    // Prepare post data
    const postData = {
      id: data.id ?? null,  // null = create new, number = update
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      excerpt: data.excerpt || '',
      categoryId: data.categoryId || 0,  // 0 = chưa chọn
      tagId: data.tagId || [],
      authorUsername: data.authorUsername,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      readingTimeMinutes: data.readingTimeMinutes,
      isFeatured: data.isFeatured === true,  // Explicit boolean, default false
    }
    
    // Append post data as JSON blob
    formData.append('post', new Blob([JSON.stringify(postData)], {
      type: 'application/json'
    }))
    
    // Append featured image file if provided
    if (featuredImageFile) {
      formData.append('featuredImage', featuredImageFile)
    }
    
    const response = await api.post<SimplePostResponse>('/a/posts/save-draft', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data || null
  },

  /**
   * Publish - Xuất bản bài viết (validate đầy đủ)
   * - id = null/undefined: Tạo mới và publish ngay
   * - id = number: Publish draft đã lưu trước đó
   * 
   * Required: title, slug, categoryId (>0), tagId (≥1)
   */
  async publish(data: CreatePostDto, featuredImageFile?: File): Promise<SimplePostResponse | null> {
    const formData = new FormData()
    
    // Prepare post data
    const postData = {
      id: data.id ?? null,  // null = create new, number = publish existing draft
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      excerpt: data.excerpt || '',
      categoryId: data.categoryId,
      tagId: data.tagId || [],
      authorUsername: data.authorUsername,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      readingTimeMinutes: data.readingTimeMinutes,
      isFeatured: data.isFeatured === true,  // Explicit boolean, default false
    }
    
    // Append post data as JSON blob
    formData.append('post', new Blob([JSON.stringify(postData)], {
      type: 'application/json'
    }))
    
    // Append featured image file if provided
    if (featuredImageFile) {
      formData.append('featuredImage', featuredImageFile)
    }
    
    const response = await api.post<SimplePostResponse>('/a/posts/publish', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data || null
  },

  /**
   * Update Published Post - Cập nhật bài đã xuất bản
   * - Chỉ dùng cho post có status = PUBLISHED
   * - Validate đầy đủ: title, slug, category, tags
   * - Giữ nguyên publishedAt, tự động update updatedAt
   * 
   * Note: Không cần id trong body (đã có trong URL path)
   */
  async updatePublished(postId: string | number, data: Omit<CreatePostDto, 'id'>, featuredImageFile?: File): Promise<SimplePostResponse | null> {
    const formData = new FormData()
    
    // Prepare post data - không cần id vì đã có trong URL
    const postData = {
      title: data.title,
      slug: data.slug,
      content: data.content || '',
      excerpt: data.excerpt || '',
      categoryId: data.categoryId,
      tagId: data.tagId || [],
      authorUsername: data.authorUsername,
      metaTitle: data.metaTitle,
      metaDescription: data.metaDescription,
      readingTimeMinutes: data.readingTimeMinutes,
      isFeatured: data.isFeatured === true,  // Explicit boolean, default false
    }
    
    // Append post data as JSON blob
    formData.append('post', new Blob([JSON.stringify(postData)], {
      type: 'application/json'
    }))
    
    // Append featured image file if provided (deletes old image if exists)
    if (featuredImageFile) {
      formData.append('featuredImage', featuredImageFile)
    }
    
    const response = await api.put<SimplePostResponse>(`/a/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    
    return response.data || null
  },

  // Delete post
  async delete(id: string) {
    const response = await api.delete(`/a/posts/${id}`)
    return response.data
  },
}
