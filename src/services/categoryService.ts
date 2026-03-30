import { api } from './api'
import type { ApiResponse } from '@/types/api'

// Category Types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  color?: string
  postCount?: number
}

export interface CategoryRequest {
  name: string
  slug: string
  description?: string
  color?: string
}

// Category Service
export const categoryService = {
  /**
   * Get all categories
   * GET /a/categories
   */
  getAll: async (): Promise<Category[]> => {
    try {
      const response = await api.get<Category[]>('/a/categories')
      return response.data || []
    } catch (error: any) {
      console.error('Error fetching categories:', error)
      throw new Error(error.message || 'Failed to fetch categories')
    }
  },

  /**
   * Create a new category
   * POST /a/categories/create
   */
  create: async (data: CategoryRequest): Promise<Category> => {
    try {
      const response = await api.post<Category>('/a/categories/create', data)
      return response.data
    } catch (error: any) {
      console.error('Error creating category:', error)
      throw new Error(error.message || 'Failed to create category')
    }
  },

  /**
   * Update an existing category
   * PUT /a/categories/{categoryId}/update
   */
  update: async (id: number, data: CategoryRequest): Promise<Category> => {
    try {
      const response = await api.put<Category>(`/a/categories/${id}/update`, data)
      return response.data
    } catch (error: any) {
      console.error('Error updating category:', error)
      throw new Error(error.message || 'Failed to update category')
    }
  },

  /**
   * Get category detail by ID
   * GET /a/categories/{categoryId}
   */
  getById: async (id: number): Promise<Category> => {
    try {
      const response = await api.get<Category>(`/a/categories/${id}`)
      return response.data
    } catch (error: any) {
      console.error('Error fetching category:', error)
      throw new Error(error.message || 'Failed to fetch category')
    }
  },

  /**
   * Delete a category
   * DELETE /a/categories/{categoryId}
   */
  delete: async (id: number): Promise<void> => {
    try {
      await api.delete(`/a/categories/${id}`)
    } catch (error: any) {
      console.error('Error deleting category:', error)
      throw new Error(error.message || 'Failed to delete category')
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
