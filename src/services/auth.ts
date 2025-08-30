import {api} from '@/utils/request'
import type {LoginRequest, LoginResponse, RefreshResponse} from '@/types/auth'

/**
 * 用户登录
 * @param data 登录请求参数
 * @returns 登录响应信息
 */
export const login = (data: LoginRequest): Promise<LoginResponse> => {
  return api.post('/auth/login', data)
}

/**
 * 获取当前用户信息
 * @returns 用户信息
 */
export const getCurrentUser = (): Promise<LoginResponse> => {
  return api.get('/auth/me')
}

/**
 * 刷新访问令牌
 * @returns 新的token信息
 */
export const refreshToken = (): Promise<RefreshResponse> => {
  // refreshToken通过cookie自动传递，不需要在请求体中传递
  return api.post('/auth/refresh')
}

/**
 * 用户登出
 * @returns 登出结果
 */
export const logout = (): Promise<void> => {
  // 清除本地存储的token，refreshToken通过cookie管理
  localStorage.removeItem('token')

  // 如果有登出API，可以调用
  // return api.post('/auth/logout')

  return Promise.resolve()
}

/**
 * 获取存储的token
 * @returns token字符串或null
 */
export const getStoredToken = (): string | null => {
  return localStorage.getItem('token')
}

/**
 * 存储token到本地
 * @param token 访问令牌
 */
export const storeToken = (token: string): void => {
  localStorage.setItem('token', token)
}

/**
 * 清除存储的token
 */
export const clearStoredToken = (): void => {
  localStorage.removeItem('token')
}
