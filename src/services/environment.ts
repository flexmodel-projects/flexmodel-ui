import {api} from '../utils/request'

/**
 * 获取环境变量
 */
export const getVariables = (): Promise<any> => {
  return api.get('/environment/variables')
}
