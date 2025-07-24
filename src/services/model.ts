import {api} from '@/utils/request'
import {EntitySchema, EnumSchema, IndexSchema, NativeQuerySchema, TypedFieldSchema} from '@/types/data-modeling'

/**
 * 获取模型列表
 */
export const getModelList = (datasourceName: string): Promise<(EntitySchema | EnumSchema | NativeQuerySchema)[]> => {
  return api.get(`/datasources/${datasourceName}/models`)
}

/**
 * 新建模型
 */
export const createModel = (datasourceName: string, data: EntitySchema | EnumSchema | NativeQuerySchema): Promise<EntitySchema | EnumSchema | NativeQuerySchema> => {
  return api.post(`/datasources/${datasourceName}/models`, data)
}

/**
 * 修改模型
 */
export const modifyModel = (datasourceName: string, data: EntitySchema | EnumSchema | NativeQuerySchema): Promise<EntitySchema | EnumSchema | NativeQuerySchema> => {
  return api.put(`/datasources/${datasourceName}/models/${data.name}`, data)
}

/**
 * 删除模型
 */
export const dropModel = (datasourceName: string, modelName: string): Promise<void> => {
  return api.delete(`/datasources/${datasourceName}/models/${modelName}`)
}

/**
 * 新建字段
 */
export const createField = (datasourceName: string, modelName: string, data: TypedFieldSchema): Promise<TypedFieldSchema> => {
  return api.post(`/datasources/${datasourceName}/models/${modelName}/fields`, data)
}

/**
 * 修改字段
 */
export const modifyField = (datasourceName: string, modelName: string, fieldName: string, data: TypedFieldSchema): Promise<TypedFieldSchema> => {
  return api.put(`/datasources/${datasourceName}/models/${modelName}/fields/${fieldName}`, data)
}

/**
 * 删除字段
 */
export const dropField = (datasourceName: string, modelName: string, fieldName: string): Promise<void> => {
  return api.delete(`/datasources/${datasourceName}/models/${modelName}/fields/${fieldName}`)
}

/**
 * 新建索引
 */
export const createIndex = (datasourceName: string, modelName: string, data: IndexSchema): Promise<IndexSchema> => {
  return api.post(`/datasources/${datasourceName}/models/${modelName}/indexes`, data)
}

/**
 * 修改索引
 */
export const modifyIndex = (datasourceName: string, modelName: string, indexName: string, data: IndexSchema): Promise<IndexSchema> => {
  return api.put(`/datasources/${datasourceName}/models/${modelName}/indexes/${indexName}`, data)
}

/**
 * 删除索引
 */
export const dropIndex = (datasourceName: string, modelName: string, indexName: string): Promise<void> => {
  return api.delete(`/datasources/${datasourceName}/models/${modelName}/indexes/${indexName}`)
}
