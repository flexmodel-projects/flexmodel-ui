import {api} from '../utils/request'

/**
 * 获取 API 日志列表
 */
export const getApiLogs = (filter?: any): Promise<any[]> => {
  return api.get('/logs', filter)
}

/**
 * 获取 API 日志统计
 */
export const getApiLogStat = (filter?: any): Promise<any> => {
  return api.get('/logs/stat', filter)
}
