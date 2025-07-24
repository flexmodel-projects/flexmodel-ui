import {api} from '@/utils/request'

/**
 * 获取总览信息
 */
export const getOverview = (filter?: any): Promise<any> => {
  return api.get('/overview', filter)
}
