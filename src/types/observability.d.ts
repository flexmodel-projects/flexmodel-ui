/**
 * 函数执行日志
 */
export interface FunctionLog {
  id: string;
  invokeId: string;
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
}

export interface ApiLogRef {
  id: string;
  path: string;
  httpMethod: string;
  statusCode: number;
  responseTime: number;
  isSuccess: boolean;
  traceId?: string;
  createdAt: string;
}
