// API Response Types

export interface ApiResponse<T = any> {
  code: number
  message: string | null
  data: T
}

export interface PaginationParams {
  page?: number
  pageSize?: number
  search?: string
  status?: string
  sort?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
