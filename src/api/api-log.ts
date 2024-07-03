import request from '../utils/request'
import {BASE_URI} from './base'

export function getApiLogs(current: number = 1, pageSize: number = 50, filter?: string) {
  return request({
    url: `${BASE_URI}/logs`,
    method: 'get',
    params: {
      current,
      pageSize,
      filter,
    }
  });
}

export function getApiLogStat(filter?: string) {
  return request({
    url: `${BASE_URI}/logs/stat`,
    method: 'get',
    params: {
      filter
    }
  })
}
