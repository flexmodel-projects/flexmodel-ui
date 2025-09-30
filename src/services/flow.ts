import {api} from "@/utils/request";

// 流程相关类型定义
export interface FlowModule {
  flowModuleId: string;
  flowName: string;
  flowKey: string;
  status: number; // 1-草稿，2-设计，3-测试，4-已发布
  remark?: string;
  tenant: string;
  caller: string;
  operator: string;
  modifyTime: string;
}

export interface FlowInstance {
  flowInstanceId: string;
  flowModuleId: string;
  flowDeployId: string;
  status: number; // 1-运行中，2-已完成，3-已终止，4-已暂停
  parentFlowInstanceId?: string;
  tenant: string;
  caller: string;
  operator: string;
  createTime: string;
  modifyTime: string;
}

export interface FlowModuleDetail extends FlowModule {
  flowDeployId?: string;
  flowModel?: string;
}

export interface CreateFlowRequest {
  flowKey: string;
  flowName: string;
  remark?: string;
  tenant?: string;
  caller?: string;
  operator?: string;
}

export interface CreateFlowResponse {
  errCode: number;
  errMsg: string;
  flowModuleId: string;
}

export interface DeployFlowRequest {
  flowModuleId: string;
  tenant?: string;
  caller?: string;
  operator?: string;
}

export interface DeployFlowResponse {
  errCode: number;
  errMsg: string;
  flowDeployId: string;
  flowModuleId: string;
}

export interface UpdateFlowRequest {
  flowName?: string;
  flowKey?: string;
  remark?: string;
  flowModel?: string;
  tenant?: string;
  caller?: string;
  operator?: string;
}

export interface UpdateFlowResponse {
  errCode: number;
  errMsg: string;
}

export interface StartProcessRequest {
  flowModuleId?: string;
  flowDeployId?: string;
  variables?: InstanceData[];
  runtimeContext?: RuntimeContext;
}

export interface StartProcessResponse {
  errCode: number;
  errMsg: string;
  flowInstanceId: string;
  status: number;
  flowDeployId?: string;
  flowModuleId?: string;
  nodeExecuteResults?: NodeExecuteResult[];
  extendProperties?: Record<string, any>;
  activeTaskInstance?: NodeInstance;
  variables?: InstanceData[];
}

export interface CommitTaskRequest {
  flowInstanceId: string;
  nodeInstanceId?: string;
  variables?: InstanceData[];
  tenant?: string;
  caller?: string;
  operator?: string;
  taskInstanceId?: string;
  runtimeContext?: RuntimeContext;
  extendProperties?: Record<string, any>;
  callActivityFlowModuleId?: string;
}

export interface CommitTaskResponse {
  errCode: number;
  errMsg: string;
  flowInstanceId: string;
  status: number;
  nodeExecuteResults?: NodeExecuteResult[];
  extendProperties?: Record<string, any>;
  activeTaskInstance?: NodeInstance;
  variables?: InstanceData[];
}

export interface RollbackTaskRequest {
  flowInstanceId: string;
  nodeInstanceId?: string;
  tenant?: string;
  caller?: string;
  operator?: string;
  taskInstanceId?: string;
  runtimeContext?: RuntimeContext;
  extendProperties?: Record<string, any>;
}

export interface RollbackTaskResponse {
  errCode: number;
  errMsg: string;
  flowInstanceId: string;
  status: number;
  nodeExecuteResults?: NodeExecuteResult[];
  extendProperties?: Record<string, any>;
  activeTaskInstance?: NodeInstance;
  variables?: InstanceData[];
}

export interface TerminateResponse {
  errCode: number;
  errMsg: string;
  flowInstanceId: string;
  status: number;
  nodeExecuteResults?: NodeExecuteResult[];
  extendProperties?: Record<string, any>;
  activeTaskInstance?: NodeInstance;
  variables?: InstanceData[];
}

export interface InstanceData {
  key: string;
  type: string;
  value: any;
}

export interface RuntimeContext {
  parentRuntimeContext?: RuntimeContext;
  flowDeployId?: string;
  flowModuleId?: string;
  tenant?: string;
  caller?: string;
  flowElementMap?: Record<string, FlowElement>;
  flowInstanceId?: string;
  flowInstanceStatus?: number;
  suspendNodeInstance?: NodeInstanceBO;
  nodeInstanceList?: NodeInstanceBO[];
  suspendNodeInstanceStack?: string[];
  currentNodeModel?: FlowElement;
  currentNodeInstance?: NodeInstanceBO;
  instanceDataId?: string;
  instanceDataMap?: Record<string, InstanceData>;
  processStatus?: number;
  callActivityFlowModuleId?: string;
  callActivityRuntimeResultList?: RuntimeResult[];
  extendProperties?: Record<string, any>;
  extendRuntimeContextList?: ExtendRuntimeContext[];
}

export interface FlowElement {
  key: string;
  type: number;
  outgoing?: string[];
  properties?: Record<string, any>;
  incoming?: string[];
}

export interface NodeInstanceBO {
  id?: number;
  nodeInstanceId: string;
  nodeKey: string;
  sourceNodeInstanceId?: string;
  sourceNodeKey?: string;
  instanceDataId?: string;
  status: number;
  nodeType: number;
  properties?: Record<string, any>;
}

export interface ExtendRuntimeContext {
  branchExecuteDataMap?: Record<string, InstanceData>;
  branchSuspendNodeInstance?: NodeInstanceBO;
  currentNodeModel?: FlowElement;
  exception?: TurboException;
}

export interface TurboException {
  errNo: number;
  errMsg: string;
}

export interface RuntimeResult {
  errCode: number;
  errMsg: string;
  flowInstanceId?: string;
  status: number;
  nodeExecuteResults?: NodeExecuteResult[];
  extendProperties?: Record<string, any>;
  activeTaskInstance?: NodeInstance;
  variables?: InstanceData[];
}

export interface NodeExecuteResult {
  errCode: number;
  errMsg: string;
  activeTaskInstance?: NodeInstance;
  variables?: InstanceData[];
}

export interface NodeInstance {
  modelKey?: string;
  modelName?: string;
  status: number;
  subFlowInstanceIdList?: string[];
  subElementInstanceList?: ElementInstance[];
  instanceDataId?: string;
  nodeInstanceId: string;
  flowElementType?: number;
  subNodeResultList?: RuntimeResult[];
  createTime?: string;
  modifyTime?: string;
  properties?: Record<string, any>;
}

export interface ElementInstance {
  modelKey?: string;
  modelName?: string;
  properties?: Record<string, any>;
  status: number;
  nodeInstanceId: string;
  subFlowInstanceIdList?: string[];
  subElementInstanceList?: ElementInstance[];
  instanceDataId?: string;
}

export interface PagedResult<T> {
  list: T[];
  total: number;
}

export interface FlowListParams {
  flowModuleId?: string;
  flowName?: string;
  page?: number;
  size?: number;
}

export interface FlowInstanceListParams {
  caller?: string;
  flowDeployId?: string;
  flowInstanceId?: string;
  flowModuleId?: string;
  page?: number;
  size?: number;
  status?: number;
}

/**
 * 获取流程列表
 */
export const getFlowList = (
  params?: FlowListParams,
): Promise<PagedResult<FlowModule>> => {
  return api.get("/flows", { ...params });
};

/**
 * 创建流程
 */
export const createFlow = (
  data: CreateFlowRequest,
): Promise<CreateFlowResponse> => {
  return api.post("/flows", data);
};

/**
 * 获取流程模块信息
 */
export const getFlowModule = (
  flowModuleId: string,
  flowDeployId?: string,
): Promise<FlowModuleDetail> => {
  return api.get(`/flows/${flowModuleId}`, {
    params: flowDeployId ? { flowDeployId } : undefined,
  });
};

/**
 * 部署流程
 */
export const deployFlow = (
  flowModuleId: string,
  data: DeployFlowRequest,
): Promise<DeployFlowResponse> => {
  return api.post(`/flows/${flowModuleId}/deploy`, data);
};

/**
 * 更新流程
 */
export const updateFlow = (
  flowModuleId: string,
  data: UpdateFlowRequest,
): Promise<UpdateFlowResponse> => {
  return api.put(`/flows/${flowModuleId}`, data);
};

/**
 * 获取流程实例列表
 */
export const getFlowInstanceList = (
  params?: FlowInstanceListParams,
): Promise<PagedResult<FlowInstance>> => {
  return api.get("/flows/instances", { ...params });
};

/**
 * 启动流程实例
 */
export const startProcess = (
  data: StartProcessRequest,
): Promise<StartProcessResponse> => {
  return api.post("/flows/instances/start", data);
};

/**
 * 获取流程实例信息
 */
export const getFlowInstance = (
  flowInstanceId: string,
): Promise<FlowInstance> => {
  return api.get(`/flows/instances/${flowInstanceId}`);
};

/**
 * 提交任务
 */
export const commitTask = (
  flowInstanceId: string,
  data: CommitTaskRequest,
): Promise<CommitTaskResponse> => {
  return api.post(`/flows/instances/${flowInstanceId}/commit`, data);
};

/**
 * 回滚任务
 */
export const rollbackTask = (
  flowInstanceId: string,
  data: RollbackTaskRequest,
): Promise<RollbackTaskResponse> => {
  return api.post(`/flows/instances/${flowInstanceId}/rollback`, data);
};

/**
 * 删除流程模块
 */
export interface DeleteFlowResponse {
  errCode: number;
  errMsg: string;
}

export const deleteFlow = (
  flowModuleId: string,
): Promise<DeleteFlowResponse> => {
  return api.delete(`/flows/${flowModuleId}`);
};

/**
 * 终止流程实例
 */
export const terminateFlowInstance = (
  flowInstanceId: string,
  effectiveForSubFlowInstance: boolean = true,
): Promise<TerminateResponse> => {
  return api.post(
    `/flows/instances/${flowInstanceId}/terminate?effectiveForSubFlowInstance=${effectiveForSubFlowInstance}`,
  );
};
