import {api} from '@/utils/request'
import type {PagedResult} from '@/types/record'
import type {TraceListItem, TraceDetail} from '@/types/observability'

export const getTraces = (
  projectId: string,
  params?: { page?: number; size?: number; traceId?: string },
): Promise<PagedResult<TraceListItem>> => {
  return api.get(`/projects/${projectId}/observability/traces`, params)
}

export const getTraceDetail = (
  projectId: string,
  traceId: string,
): Promise<TraceDetail> => {
  return api.get(`/projects/${projectId}/observability/traces/${traceId}`)
}
