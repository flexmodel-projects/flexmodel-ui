import {api} from '@/utils/request'
import {SystemProfile} from '@/types/system'

/**
 * 获取系统信息
 */
export const getGlobalProfile = (): Promise<SystemProfile> => {
  return api.get('/global/profile')
}
