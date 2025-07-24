import {api} from '@/utils/request'
import {ExecutionResult} from '@/types/api-management' // 如果需要添加类型

/**
 * 执行 GraphQL 查询
 */
export const executeQuery = (data: {query: string; variables?: Record<string, any>; operationName?: string}): Promise<ExecutionResult> => {
  return api.post('/graphql', data)
}
