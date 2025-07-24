import {api} from '@/utils/request'
import {IdentityProviderSchema} from '@/types/identity-provider'

/**
 * 获取身份提供商列表
 */
export const getIdentityProviders = (): Promise<IdentityProviderSchema[]> => {
  return api.get('/identity-providers')
}

/**
 * 新建身份提供商
 */
export const createIdentityProvider = (data: IdentityProviderSchema): Promise<IdentityProviderSchema> => {
  return api.post('/identity-providers', data)
}

/**
 * 更新身份提供商
 */
export const updateIdentityProvider = (id: string, data: IdentityProviderSchema): Promise<IdentityProviderSchema> => {
  return api.put(`/identity-providers/${id}`, data)
}

/**
 * 删除身份提供商
 */
export const deleteIdentityProvider = (id: string): Promise<void> => {
  return api.delete(`/identity-providers/${id}`)
}

