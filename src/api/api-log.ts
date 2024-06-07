import request from '../utils/request'
import {BASE_URI} from './base'

export function getApiLogs(current: number = 1, pageSize: number = 50) {
  return request({
    url: `${BASE_URI}/logs`,
    method: 'get',
    params: {
      current,
      pageSize,
    }
  });
}
