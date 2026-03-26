import { api } from './api'

// Attachment types based on backend POST_ATTACHMENTS_API.md
export interface PostAttachment {
  id: number
  postId: number
  originalFileName: string
  storedFileName: string
  fileType: 'archive' | 'document' | 'image' | 'code' | 'other'
  mimeType: string
  fileSize: number
  storagePath: string
  altText: string | null
  displayOrder: number
  uploadedAt: string
  downloadUrl?: string
}

// File type icons mapping
export const FILE_TYPE_ICONS: Record<string, string> = {
  archive: '📦',
  document: '📄',
  image: '🖼️',
  code: '💻',
  other: '📎',
}

// File type colors for UI
export const FILE_TYPE_COLORS: Record<string, string> = {
  archive: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  document: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  image: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  code: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
}

// Allowed file extensions by type (matching backend)
export const ALLOWED_EXTENSIONS = {
  image: ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'],
  document: ['.pdf', '.doc', '.docx', '.txt', '.xls', '.xlsx', '.ppt', '.pptx'],
  archive: ['.zip', '.rar', '.7z', '.tar', '.gz'],
  code: ['.json', '.xml', '.yaml', '.yml', '.csv', '.sql', '.js', '.ts', '.py', '.java'],
}

// Max file sizes (in bytes)
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024,     // 10MB
  document: 20 * 1024 * 1024,  // 20MB
  archive: 100 * 1024 * 1024,  // 100MB
  code: 5 * 1024 * 1024,       // 5MB
}

// Helper functions
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  const ext = filename.lastIndexOf('.')
  return ext >= 0 ? filename.substring(ext).toLowerCase() : ''
}

export function getFileTypeFromExtension(filename: string): PostAttachment['fileType'] {
  const ext = getFileExtension(filename)
  
  for (const [type, extensions] of Object.entries(ALLOWED_EXTENSIONS)) {
    if (extensions.includes(ext)) {
      return type as PostAttachment['fileType']
    }
  }
  
  return 'other'
}

export function getFileIcon(fileType: PostAttachment['fileType']): string {
  return FILE_TYPE_ICONS[fileType] ?? FILE_TYPE_ICONS.other!
}

export function getFileTypeColor(fileType: PostAttachment['fileType']): string {
  return FILE_TYPE_COLORS[fileType] ?? FILE_TYPE_COLORS.other!
}

export function validateAttachment(file: File): { valid: boolean; error?: string } {
  const fileType = getFileTypeFromExtension(file.name)
  const maxSize = MAX_FILE_SIZES[fileType as keyof typeof MAX_FILE_SIZES] || MAX_FILE_SIZES.code
  
  // Check if file extension is allowed
  const ext = getFileExtension(file.name)
  const allExtensions = Object.values(ALLOWED_EXTENSIONS).flat()
  
  if (!allExtensions.includes(ext)) {
    return {
      valid: false,
      error: `File type "${ext}" is not allowed. Supported types: images, documents, archives, code files.`,
    }
  }
  
  // Check file size
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File size (${formatFileSize(file.size)}) exceeds maximum allowed size of ${formatFileSize(maxSize)} for ${fileType} files.`,
    }
  }
  
  return { valid: true }
}

// Attachment Service
export const attachmentService = {
  /**
   * Upload an attachment to a post
   * @param postId - The ID of the post
   * @param file - The file to upload
   * @param altText - Optional description for the attachment
   */
  async upload(postId: string | number, file: File, altText?: string): Promise<PostAttachment> {
    const formData = new FormData()
    formData.append('file', file)
    if (altText) {
      formData.append('altText', altText)
    }
    
    const response = await api.post<PostAttachment>(
      `/a/posts/${postId}/attachments`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
    
    return response.data
  },
  
  /**
   * Get all attachments for a post
   * @param postId - The ID of the post
   */
  async getAll(postId: string | number): Promise<PostAttachment[]> {
    const response = await api.get<PostAttachment[]>(`/a/posts/${postId}/attachments`)
    return response.data || []
  },
  
  /**
   * Delete an attachment
   * @param postId - The ID of the post
   * @param attachmentId - The ID of the attachment to delete
   */
  async delete(postId: string | number, attachmentId: number): Promise<void> {
    await api.delete(`/a/posts/${postId}/attachments/${attachmentId}`)
  },
  
  /**
   * Get download URL for an attachment
   * @param attachment - The attachment object
   */
  getDownloadUrl(attachment: PostAttachment): string {
    // Use downloadUrl if provided by backend, otherwise construct from storagePath
    if (attachment.downloadUrl) {
      return attachment.downloadUrl
    }
    
    // Construct URL from MinIO storage path
    const baseUrl = import.meta.env.VITE_MINIO_URL || 'https://minioconsole.grummans.me'
    return `${baseUrl}/posts/${attachment.storagePath}`
  },
}
