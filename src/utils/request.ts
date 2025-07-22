import type {AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios'
import axios from 'axios'


// 定义错误类型
interface ApiError {
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
export const BASE_URI = "/fm-api"

/**
 * 统一错误处理函数
 * @param error Axios错误对象
 * @returns Promise.reject
 */
const handleApiError = async (error: AxiosError): Promise<any> => {
  const {response, message: errorMessage} = error

  if (!response) {
    return Promise.reject({code: -1, message: '网络连接失败'})
  }

  const {status, data} = response
  const apiError: ApiError = {
    code: data?.code || status,
    message: data?.message || errorMessage || '未知错误',
    status
  }

  // 根据状态码处理不同错误
  if (status >= 400 && status < 500) {
    if (data?.code === ERROR_CODES.UNAUTHORIZED) {
      // 未授权，跳转到登录页
      return Promise.reject(apiError)
    }
  } else if (status >= 500) {
    return Promise.reject(apiError)
  }
  return new Promise((resolve) => {
    resolve(response)
  })
}

/**
 * 创建axios实例
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/' : '/',
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
    (error: AxiosError) => {
      return Promise.reject(error)
    }
)

/**
 * 响应拦截器
 */
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response
    },
    handleApiError
)

/**
 * 统一的请求函数
 * @param config Axios配置
 * @param returnFullResponse 是否返回完整响应包装，默认false只返回data
 * @returns Promise<T> 返回响应数据或完整响应
 */
const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return axiosInstance(config)
      .then((response: AxiosResponse<T>) => {
        // 如果是blob响应，直接返回data
        if (config.responseType === 'blob') {
          return response.data as T
        }

        // 否则返回包装的数据
        return response?.data
      })
}

/**
 * API 对象，支持 api.get('/hello') 调用方式
 */
export const api = {
  /**
   * GET 请求
   * @param url 请求路径
   * @param params 查询参数
   * @param returnFullResponse 是否返回完整响应包装
   */
  get: <T = any>(url: string, params?: Record<string, any>): Promise<T> => {
    return request({
      url: `${BASE_URI}${url}`,
      method: 'get',
      params
    })
  },

  /**
   * POST 请求
   * @param url 请求路径
   * @param data 请求数据
   * @param returnFullResponse 是否返回完整响应包装
   */
  post: <T = any>(url: string, data?: any): Promise<T> => {
    return request({
      url: `${BASE_URI}${url}`,
      method: 'post',
      data
    })
  },

  /**
   * PUT 请求
   * @param url 请求路径
   * @param data 请求数据
   * @param returnFullResponse 是否返回完整响应包装
   */
  put: <T = any>(url: string, data?: any): Promise<T> => {
    return request({
      url: `${BASE_URI}${url}`,
      method: 'put',
      data
    })
  },

  /**
   * PATCH 请求
   * @param url 请求路径
   * @param data 请求数据
   * @param returnFullResponse 是否返回完整响应包装
   */
  patch: <T = any>(url: string, data?: any): Promise<T> => {
    return request({
      url: `${BASE_URI}${url}`,
      method: 'patch',
      data
    })
  },

  /**
   * DELETE 请求
   * @param url 请求路径
   * @param returnFullResponse 是否返回完整响应包装
   */
  delete: <T = any>(url: string): Promise<T> => {
    return request({
      url: `${BASE_URI}${url}`,
      method: 'delete'
    })
  },

  /**
   * 自定义请求
   * @param config 请求配置
   * @param returnFullResponse 是否返回完整响应包装
   */
  request: <T = any>(config: AxiosRequestConfig): Promise<T> => {
    return request({
      ...config,
      url: config.url ? `${BASE_URI}${config.url}` : undefined
    })
  }
}

// 为了向后兼容，保留原有的导出
export default request