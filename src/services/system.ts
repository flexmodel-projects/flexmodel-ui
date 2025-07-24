import {api} from '@/utils/request'
import {SystemProfile} from '@/types/system'

/**
 * 获取系统信息
 */
export const getSystemProfile = (): Promise<SystemProfile> => {
  return api.get('/system/profile')
}
