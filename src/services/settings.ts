import {api} from '@/utils/request'
import {Settings} from '@/types/settings'

/**
 * 保存设置
 */
export const saveSettings = (data: Settings): Promise<Settings> => {
  return api.patch('/settings', data)
}

/**
 * 获取设置
 */
export const getSettings = (): Promise<Settings> => {
  return api.get('/settings')
}
