import request from '../utils/request'
import {BASE_URI} from './base'

export function getRecordList(datasourceName: string, modelName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/records`,
    method: 'get'
  });
}
