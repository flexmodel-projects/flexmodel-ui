import {api} from '@/utils/request'

/**
 * 执行 GraphQL 查询
 */
export const executeQuery = (data: any): Promise<any> => {
  return api.post('/graphql', data)
}
