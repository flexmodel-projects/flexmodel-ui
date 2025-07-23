import {api} from '../utils/request'

/**
 * 获取数据源列表
 */
export const getDatasourceList = (): Promise<any[]> => {
  return api.get('/datasources')
}

/**
 * 同步模型
 */
export const syncModels = (datasourceName: string, models: string[]): Promise<any> => {
  return api.post(`/datasources/${datasourceName}/sync`, models)
}

/**
 * 导入模型
 */
export const importModels = (datasourceName: string, data: any): Promise<any> => {
  return api.post(`/datasources/${datasourceName}/import`, data)
}

/**
 * 校验数据源
 */
export const validateDatasource = (data: any): Promise<any> => {
  return api.post('/datasources/validate', data)
}

/**
 * 获取物理模型名称
 */
export const getPhysicsModelNames = (data: any): Promise<any[]> => {
  return api.post('/datasources/physics/names', data)
}

/**
 * 新建数据源
 */
export const createDatasource = (data: any): Promise<any> => {
  return api.post('/datasources', data)
}

/**
 * 更新数据源
 */
export const updateDatasource = (datasourceName: string, data: any): Promise<any> => {
  return api.put(`/datasources/${datasourceName}`, data)
}

/**
 * 删除数据源
 */
export const deleteDatasource = (datasourceName: string): Promise<void> => {
  return api.delete(`/datasources/${datasourceName}`)
}

/**
 * 执行原生查询
 */
export const executeNativeQuery = (datasourceName: string, data: any): Promise<any> => {
  return api.post(`/datasources/${datasourceName}/native-query`, data)
}
