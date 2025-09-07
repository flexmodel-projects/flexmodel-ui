import {api} from '@/utils/request'
import type {MRecord} from '@/types/data-modeling';
import {PagedResult} from '@/types/record'

/**
 * 获取记录列表
 * @param datasourceName 数据源名称
 * @param modelName 模型名称
 * @param query 查询参数
 * @returns 记录列表
 * @example
 * const query = { page: 1, size: 10,
 *  filter: '{ "id": { "_eq": 1, "_and": { "name": { "_eq": "zhangsan" } } } }',
 *  nestedQuery: true,
 *  sort: [{ "field": "name", "order": "ASC" }, { "field": "id", "order": "DESC" }] }
 * const records = await getRecordList('datasourceName', 'modelName', query)
 */
export const getRecordList = (datasourceName: string, modelName: string, query?: { page: number, size: number, filter?: string, nestedQuery?: boolean, sort?: string }): Promise<PagedResult<MRecord>> => {
  return api.get(`/datasources/${datasourceName}/models/${modelName}/records`, query)
}

/**
 * 获取单条记录
 */
export const getOneRecord = (datasourceName: string, modelName: string, id: string): Promise<MRecord> => {
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
