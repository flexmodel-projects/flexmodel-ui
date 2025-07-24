import {api} from '@/utils/request'
import type {ApiLog, ApiLogStat} from '@/types/api-log';

/**
 * 获取 API 日志列表
 */
export const getApiLogs = (filter?: any): Promise<{list: ApiLog[]; total: number}> => {
  return api.get('/logs', filter)
}

/**
 * 获取 API 日志统计
 */
export const getApiLogStat = (filter?: any): Promise<ApiLogStat> => {
  return api.get('/logs/stat', filter)
}
