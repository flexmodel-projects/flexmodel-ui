import request from '../utils/request'
import {BASE_URI} from './base'

export function getModelList(datasourceName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models`,
    method: 'get'
  });
}
