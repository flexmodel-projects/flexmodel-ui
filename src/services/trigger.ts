import {api} from "@/utils/request";

// 根据OpenAPI规范定义的触发器类型
export type TriggerType = "EVENT" | "SCHEDULED";

export interface Trigger {
  id?: string;
  name: string;
  description?: string;
  type: TriggerType;
  config: Record<string, any>;
  jobId: string; // flowId
  state: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TriggerDTO extends Trigger {
  jobName?: string;
  nextFireTime?: string;
  previousFireTime?: string;
}

export interface PageDTOTriggerDTO {
  list: TriggerDTO[];
  total: number;
}

export interface TriggerListParams {
  name?: string;
  page?: number;
  size?: number;
}

/**
 * 获取触发器列表
 * @param params 查询参数
 * @returns 触发器列表
 */
export const getTriggerPage = (
  params?: TriggerListParams,
): Promise<PageDTOTriggerDTO> => {
  return api.get("/triggers", { ...params });
};

/**
 * 创建触发器
 * @param data 触发器数据
 * @returns 创建的触发器
 */
export const createTrigger = (data: Trigger): Promise<Trigger> => {
  return api.post("/triggers", data);
};

/**
 * 获取单个触发器
 * @param id 触发器ID
 * @returns 触发器详情
 */
export const getTrigger = (id: string): Promise<TriggerDTO> => {
  return api.get(`/triggers/${id}`);
};

/**
 * 更新触发器
 * @param id 触发器ID
 * @param data 触发器数据
 * @returns 更新后的触发器
 */
export const updateTrigger = (id: string, data: Trigger): Promise<Trigger> => {
  return api.put(`/triggers/${id}`, data);
};

/**
 * 部分更新触发器
 * @param id 触发器ID
 * @param data 触发器数据
 * @returns 更新后的触发器
 */
export const patchTrigger = (id: string, data: Trigger): Promise<Trigger> => {
  return api.patch(`/triggers/${id}`, data);
};

/**
 * 删除触发器
 * @param id 触发器ID
 * @returns 删除结果
 */
export const deleteTrigger = (id: string): Promise<void> => {
  return api.delete(`/triggers/${id}`);
};

/**
 * 立即执行触发器
 * @param id 触发器ID
 * @returns 执行结果
 */
export const executeTrigger = (id: string): Promise<void> => {
  return api.post(`/triggers/${id}/execute`);
};
