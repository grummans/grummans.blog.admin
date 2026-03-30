import { api } from './api'
import type { ApiResponse } from '@/types/api'

// Tag Types
export interface Tag {
  id: number
  name: string
  slug: string
  postCount?: number
}

export interface TagRequest {
  name: string
  slug: string
}

// Tag Service
export const tagService = {
  /**
   * Get all tags
   * GET /a/tags
   */
  getAll: async (): Promise<Tag[]> => {
    try {
      const response = await api.get<Tag[]>('/a/tags')
      return response.data || []
    } catch (error: any) {
      console.error('Error fetching tags:', error)
      throw new Error(error.message || 'Failed to fetch tags')
    }
  },

  /**
   * Create a new tag
   * POST /a/tags/create
   */
  create: async (data: TagRequest): Promise<Tag> => {
    try {
      const response = await api.post<Tag>('/a/tags/create', data)
      return response.data
    } catch (error: any) {
      console.error('Error creating tag:', error)
      throw new Error(error.message || 'Failed to create tag')
    }
  },

  /**
   * Update an existing tag
   * PUT /a/tags/{tagId}/update
   */
  update: async (id: number, data: TagRequest): Promise<Tag> => {
    try {
      const response = await api.put<Tag>(`/a/tags/${id}/update`, data)
      return response.data
    } catch (error: any) {
      console.error('Error updating tag:', error)
      throw new Error(error.message || 'Failed to update tag')
    }
  },

  /**
   * Get tag detail by ID
   * GET /a/tags/{tagId}
   */
  getById: async (id: number): Promise<Tag> => {
    try {
      const response = await api.get<Tag>(`/a/tags/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching tag:', error)
      throw new Error(error.message || 'Failed to fetch tag')
    }
  },

  /**
   * Delete a tag
   * DELETE /a/tags/{tagId}
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/a/tags/${id}`)
    } catch (error: any) {
      console.error('Error deleting tag:', error)
      throw new Error(error.message || 'Failed to delete tag')
    }
  },
}

/**
 * Generate URL-friendly slug from name
 */
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
