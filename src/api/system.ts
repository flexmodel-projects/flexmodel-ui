import {api} from '../utils/request'

/**
 * 获取系统信息
 */
export const getSystemProfile = (): Promise<any> => {
  return api.get('/system/profile')
}
