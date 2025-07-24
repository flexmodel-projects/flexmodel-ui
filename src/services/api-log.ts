import {api} from '@/utils/request'
import {ApiLogSchema, ApiLogStatSchema} from '@/types/api-log'
import {PagedResult} from '@/types/record'

/**
 * 获取 API 日志列表
 */
export const getApiLogs = (filter?: {current?: number; pageSize?: number; keyword?: string; dateRange?: string; level?: string; isSuccess?: boolean}): Promise<PagedResult<ApiLogSchema>> => {
  return api.get('/logs', filter)
}

/**
 * 获取 API 日志统计
 */
export const getApiLogStat = (filter?: {keyword?: string; dateRange?: string; level?: string; isSuccess?: boolean}): Promise<ApiLogStatSchema[]> => {
  return api.get('/logs/stat', filter)
}
