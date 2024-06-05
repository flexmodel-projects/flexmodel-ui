import request from '../utils/request'
import {BASE_URI} from './base'

export function getApiTree() {
  return request({
    url: `${BASE_URI}/apis/tree`,
    method: 'get'
  });
}

export function createApi(data: {}) {
  return request({
    url: `${BASE_URI}/apis`,
    method: 'post',
    data: data
  });
}

export function updateApi(id: string, data: {}) {
  return request({
    url: `${BASE_URI}/apis/${id}`,
    method: 'put',
    data: data
  });
}

export function deleteApi(id: string) {
  return request({
    url: `${BASE_URI}/apis/${id}`,
    method: 'delete'
  });
}

