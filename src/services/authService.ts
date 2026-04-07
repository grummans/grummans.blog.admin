import { api } from './api'

export interface LoginRequest {
  username: string
  password: string
}

function toFormBody(data: LoginRequest): URLSearchParams {
  const formData = new URLSearchParams()
  formData.set('username', data.username)
  formData.set('password', data.password)
  return formData
}

export const authService = {
  async login(data: LoginRequest): Promise<boolean> {
    await api.post('/auth/login', toFormBody(data), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return true
  },

  async me(): Promise<boolean> {
    const response = await api.get<{ authenticated?: boolean }>('/auth/me')
    return response.data?.authenticated === true
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },
}
