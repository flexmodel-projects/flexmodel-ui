import {api} from '../utils/request'

/**
 * 获取 API 列表
 */
export const getApis = (): Promise<any[]> => {
  return api.get('/apis')
}

/**
 * 新建 API
 */
export const createApi = (data: any): Promise<any> => {
  return api.post('/apis', data)
}

/**
 * 批量生成 API
 */
export const generateAPIs = (data: any): Promise<any> => {
  return api.post('/apis/generate', data)
}

/**
 * 更新 API
 */
export const updateApi = (id: string, data: any): Promise<any> => {
  return api.put(`/apis/${id}`, data)
}

/**
 * 更新 API 启用状态
 */
export const updateApiStatus = (id: string, enabled: boolean): Promise<any> => {
  return api.patch(`/apis/${id}`, { enabled })
}

/**
 * 更新 API 名称
 */
export const updateApiName = (id: string, name: string): Promise<any> => {
  return api.patch(`/apis/${id}`, { name })
}

/**
 * 删除 API
 */
export const deleteApi = (id: string): Promise<void> => {
  return api.delete(`/apis/${id}`)
}

