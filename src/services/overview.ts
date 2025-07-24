import {api} from '@/utils/request'
import {OverviewResponse} from '@/types/overview'

/**
 * 获取总览信息
 */
export const getOverview = (filter?: {dateRange?: string}): Promise<OverviewResponse> => {
  return api.get('/overview', filter)
}
