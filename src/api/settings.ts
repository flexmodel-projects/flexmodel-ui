import {api} from '../utils/request'

/**
 * 保存设置
 */
export const saveSettings = (data: any): Promise<any> => {
  return api.patch('/settings', data)
}

/**
 * 获取设置
 */
export const getSettings = (): Promise<any> => {
  return api.get('/settings')
}
