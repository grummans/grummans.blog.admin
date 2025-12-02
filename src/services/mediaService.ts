import { api } from './api'

export interface UploadResponse {
  url: string
  filename: string
  size: number
  mimeType: string
}

export const mediaService = {
  // Upload single file to content (for TipTap editor inline files)
  async upload(file: File, onProgress?: (percent: number) => void): Promise<string> {
    const formData = new FormData()
    formData.append('file', file) // Backend expects 'file' param name

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()

      // Track upload progress
      if (onProgress) {
        xhr.upload.addEventListener('progress', (e) => {
          if (e.lengthComputable) {
            const percentComplete = (e.loaded / e.total) * 100
            onProgress(percentComplete)
          }
        })
      }

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText)
            // Backend returns: { code: 200, message: "...", data: "http://..." }
            resolve(response.data)
          } catch (error) {
            reject(new Error('Invalid response format'))
          }
        } else {
          try {
            const errorResponse = JSON.parse(xhr.responseText)
            reject(new Error(errorResponse.message || 'Upload failed'))
          } catch {
            reject(new Error('Upload failed'))
          }
        }
      })

      xhr.addEventListener('error', () => reject(new Error('Network error')))
      xhr.addEventListener('abort', () => reject(new Error('Upload cancelled')))

      // Use /api prefix (Vite proxy will forward to localhost:8085)
      xhr.open('POST', '/api/file/upload-content-file')
      xhr.send(formData)
    })
  },

  // Upload multiple files
  async uploadMultiple(files: File[]): Promise<UploadResponse[]> {
    const formData = new FormData()
    files.forEach(file => {
      formData.append('files', file)
    })

    const response = await api.post<UploadResponse[]>('/media/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })

    return response.data
  },

  // Convert image to base64 (fallback if upload fails or for demo)
  async toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  // Validate image file
  validateImage(file: File): { valid: boolean; error?: string } {
    const maxSize = 10 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']

    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.',
      }
    }

    if (file.size > maxSize) {
      return {
        valid: false,
        error: 'File size exceeds 10MB limit.',
      }
    }

    return { valid: true }
  },

  // Validate any file (images, documents, videos, etc.) - matches backend rules
  validateFile(file: File): { valid: boolean; error?: string } {
    const category = this.getFileCategory(file)
    
    // Size limits per category (from backend FRONTEND_REQUIREMENTS.md)
    const sizeLimits: Record<string, number> = {
      image: 10 * 1024 * 1024,      // 10 MB
      document: 20 * 1024 * 1024,   // 20 MB
      archive: 100 * 1024 * 1024,   // 100 MB
      code: 5 * 1024 * 1024,        // 5 MB
      video: 20 * 1024 * 1024,      // 20 MB (conservative)
      audio: 10 * 1024 * 1024,      // 10 MB (conservative)
      other: 10 * 1024 * 1024,      // 10 MB default
    }

    const allowedExtensions = [
      // Images
      '.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico',
      // Documents
      '.pdf', '.doc', '.docx', '.txt', '.md', '.xls', '.xlsx', '.ppt', '.pptx',
      // Archives
      '.zip', '.rar', '.7z', '.tar', '.gz',
      // Code
      '.json', '.xml', '.yaml', '.yml', '.sql', '.csv',
    ]

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase()
    if (!allowedExtensions.includes(fileExt)) {
      return {
        valid: false,
        error: `File type ${fileExt} not supported`,
      }
    }

    const maxSize = sizeLimits[category] ?? sizeLimits.other ?? 10 * 1024 * 1024
    if (file.size > maxSize) {
      const sizeMB = (maxSize / (1024 * 1024)).toFixed(0)
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${sizeMB} MB for ${category} files`,
      }
    }

    return { valid: true }
  },

  // Get file type category
  getFileCategory(file: File): 'image' | 'document' | 'video' | 'audio' | 'archive' | 'code' | 'other' {
    const ext = '.' + file.name.split('.').pop()?.toLowerCase()
    
    const imageExts = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico']
    const docExts = ['.pdf', '.doc', '.docx', '.txt', '.md', '.xls', '.xlsx', '.ppt', '.pptx']
    const archiveExts = ['.zip', '.rar', '.7z', '.tar', '.gz']
    const codeExts = ['.json', '.xml', '.yaml', '.yml', '.sql', '.csv']
    
    if (imageExts.includes(ext)) return 'image'
    if (docExts.includes(ext)) return 'document'
    if (archiveExts.includes(ext)) return 'archive'
    if (codeExts.includes(ext)) return 'code'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    
    return 'other'
  },

  // Format file size for display
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  },
}
