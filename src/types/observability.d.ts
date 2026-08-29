/**
 * 函数执行日志
 */
export interface FunctionLog {
  id: string;
  functionName: string;
  level: string;
  message: string;
  traceId?: string;
  createdAt: string;
}

/**
 * 链路追踪 Span
 */
export interface Span {
  id: string;
  traceId: string;
  spanId: string;
  parentId?: string;
  name: string;
  kind: string;
  projectId?: string;
  startTime: number;
  durationNs: number;
  attributes?: string;
  status: string;
  createdAt: string;
}

/**
 * 链路追踪列表项（按 trace_id 聚合）
 */
export interface TraceListItem {
  traceId: string;
  rootName: string;
  startTime: number;
  totalDurationNs: number;
  spanCount: number;
  hasError: boolean;
}

/**
 * 链路追踪详情
 */
export interface TraceDetail {
  traceId: string;
  spans: Span[];
  apiLogs: ApiLogRef[];
  functionLogs: FunctionLog[];
  jobExecutionLogs: JobExecutionLogRef[];
  nodeInstanceLogs: NodeInstanceLogRef[];
  auditLogs: AuditLogRef[];
}

export interface ApiLogRef {
  id: string;
  path: string;
  httpMethod: string;
  statusCode: number;
  responseTime: number;
  url?: string;
  clientIp?: string;
  isSuccess: boolean;
  errorMessage?: string;
  requestBody?: any;
  requestHeaders?: any;
  traceId?: string;
  createdAt: string;
}

export interface JobExecutionLogRef {
  id: string;
  jobId: string;
  jobName: string;
  jobType: string;
  jobGroup?: string;
  triggerId: string;
  executionStatus: string;
  startTime: string;
  endTime?: string;
  executionDuration?: number;
  isSuccess: boolean;
  errorMessage?: string;
  errorStackTrace?: string;
  inputData?: any;
  outputData?: any;
  retryCount?: number;
  maxRetryCount?: number;
  schedulerName?: string;
  instanceName?: string;
  firedTime?: number;
  scheduledTime?: number;
  traceId?: string;
  createdAt?: string;
}

export interface NodeInstanceLogRef {
  id: number;
  nodeInstanceId: string;
  flowInstanceId: string;
  instanceDataId?: string;
  nodeKey: string;
  type: number;
  status: number;
  archive?: number;
  traceId?: string;
  createdAt?: string;
  createdBy?: string;
  updatedBy?: string;
  updatedAt?: string;
}

/**
 * 审计日志（配置变更）
 */
export interface AuditLog {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  userId?: string;
  success: boolean;
  errorMessage?: string;
  oldData?: string;
  newData?: string;
  traceId?: string;
  createdAt: string;
}

/**
 * 审计日志（链路详情关联引用，精简字段）
 */
export interface AuditLogRef {
  id: string;
  action: string;
  resourceType: string;
  resourceId: string;
  resourceName?: string;
  userId?: string;
  success: boolean;
  errorMessage?: string;
  oldData?: string;
  newData?: string;
  traceId?: string;
  createdAt: string;
}
