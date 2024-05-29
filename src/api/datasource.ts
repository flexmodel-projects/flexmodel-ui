import request from '../utils/request'
import {BASE_URI} from './base'

export function getDatasourceList() {
  return request({
    url: `${BASE_URI}/connect/datasource/list`,
    method: 'get'
  });
}
