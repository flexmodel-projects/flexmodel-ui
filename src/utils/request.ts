import type {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import axios from 'axios'

// 错误类型
type ApiError = {
  code: number
  message: string
  status?: number
}

// 基础请求参数类型
export interface BaseRequestParams {
  page?: number
  size?: number
  keywords?: string
}

// 基础响应类型
export interface BaseResponse<T = any> {
  data: T
  total?: number
  page?: number
  size?: number
}

// 错误码常量
const ERROR_CODES = {
  UNAUTHORIZED: 2001,
  BAD_REQUEST: 400,
  SERVER_ERROR: 500
} as const

// API 基础路径
export const BASE_URI = "/api"

/**
 * 统一错误处理
 */
const handleApiError = async (error: AxiosError): Promise<any> => {
  const { response, message: errorMessage } = error

  if (!response) {
    return Promise.reject({ code: -1, message: '网络连接失败' })
  }

  const { status, data } = response
  // 类型保护，确保 data 是对象且有 code/message
  let code = status
  let message = errorMessage || '未知错误'
  if (typeof data === 'object' && data !== null) {
    if ('code' in data && typeof (data as any).code === 'number') {
      code = (data as any).code
    }
    if ('message' in data && typeof (data as any).message === 'string') {
      message = (data as any).message
    }
  }

  const apiError: ApiError = {
    code,
    message,
    status
  }

  if (status >= 400 && status < 500) {
    if (code === ERROR_CODES.UNAUTHORIZED) {
      // 未授权
      return Promise.reject(apiError)
    }
  } else if (status >= 500) {
    return Promise.reject(apiError)
  }
  return Promise.resolve(response)
}

/**
 * 创建 axios 实例
 */
const axiosInstance = axios.create({
  baseURL: BASE_URI,
  withCredentials: true,
  timeout: 5 * 60 * 1000,
})

/**
 * 请求拦截器
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  handleApiError
)

/**
 * 统一请求函数
 */
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config).then((response: AxiosResponse<T>) => {
    if (config.responseType === 'blob') {
      return response.data as T
    }
    return response.data
  })
}

/**
 * API 对象
 */
export const api = {
  get: <T = any>(url: string, params?: Record<string, any>): Promise<T> =>
    request({ url, method: 'get', params }),
  post: <T = any>(url: string, data?: any): Promise<T> =>
    request({ url, method: 'post', data }),
  put: <T = any>(url: string, data?: any): Promise<T> =>
    request({ url, method: 'put', data }),
  patch: <T = any>(url: string, data?: any): Promise<T> =>
    request({ url, method: 'patch', data }),
  delete: <T = any>(url: string): Promise<T> =>
    request({ url, method: 'delete' }),
  request: <T = any>(config: AxiosRequestConfig): Promise<T> =>
    request(config)
}

// 兼容原有导出
export default request
