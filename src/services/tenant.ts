import {api} from "@/utils/request.ts";

// 租户
export interface Tenant {
  id: string;
}

/**
 * 获取租户列表
 * @returns 租户列表分页结果
 */
export const getTenants = (): Promise<Tenant[]> => {
  return api.get("/tenants");
};
