import {api} from '@/utils/request'
import type {MRecord} from '@/types/data-modeling';
import {PagedResult} from '@/types/record'

/**
 * 获取记录列表
 */
export const getRecordList = (datasourceName: string, modelName: string, query?: { current: number, pageSize: number, filter?: string, nestedQuery?: boolean, sort?: string }): Promise<PagedResult<MRecord>> => {
  return api.get(`/datasources/${datasourceName}/models/${modelName}/records`, query)
}

/**
 * 获取单条记录
 */
export const getOneRecord = (datasourceName: string, modelName: string, id: string, nestedQuery?: boolean): Promise<MRecord> => {
  return api.get(`/datasources/${datasourceName}/models/${modelName}/records/${id}`)
}

/**
 * 新建记录
 */
export const createRecord = (datasourceName: string, modelName: string, data: MRecord): Promise<MRecord> => {
  return api.post(`/datasources/${datasourceName}/models/${modelName}/records`, data)
}

/**
 * 更新记录
 */
export const updateRecord = (datasourceName: string, modelName: string, id: string, data: MRecord): Promise<MRecord> => {
  return api.put(`/datasources/${datasourceName}/models/${modelName}/records/${id}`, data)
}

/**
 * 删除记录
 */
export const deleteRecord = (datasourceName: string, modelName: string, id: string): Promise<void> => {
  return api.delete(`/datasources/${datasourceName}/models/${modelName}/records/${id}`)
}
