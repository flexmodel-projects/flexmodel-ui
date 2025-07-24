import {api} from '@/utils/request'

/**
 * 获取记录列表
 */
export const getRecordList = (datasourceName: string, modelName: string, query?: { current: number, pageSize: number }): Promise<any[]> => {
  return api.get(`/datasources/${datasourceName}/models/${modelName}/records`, query)
}

/**
 * 获取单条记录
 */
export const getOneRecord = (datasourceName: string, modelName: string, id: any): Promise<any> => {
  return api.get(`/datasources/${datasourceName}/models/${modelName}/records/${id}`)
}

/**
 * 新建记录
 */
export const createRecord = (datasourceName: string, modelName: string, data: any): Promise<any> => {
  return api.post(`/datasources/${datasourceName}/models/${modelName}/records`, data)
}

/**
 * 更新记录
 */
export const updateRecord = (datasourceName: string, modelName: string, id: any, data: any): Promise<any> => {
  return api.put(`/datasources/${datasourceName}/models/${modelName}/records/${id}`, data)
}

/**
 * 删除记录
 */
export const deleteRecord = (datasourceName: string, modelName: string, id: any): Promise<void> => {
  return api.delete(`/datasources/${datasourceName}/models/${modelName}/records/${id}`)
}
