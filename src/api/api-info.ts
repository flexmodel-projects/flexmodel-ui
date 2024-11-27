import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function getApis() {
  return request({
    url: `${BASE_URI}/apis`,
    method: 'get'
  });
}

export function createApi(data: object) {
  return request({
    url: `${BASE_URI}/apis`,
    method: 'post',
    data: data
  });
}

export function generateAPIs(data: object) {
  return request({
    url: `${BASE_URI}/apis/generate`,
    method: 'post',
    data: data
  });
}

export function updateApi(id: string, data: object) {
  return request({
    url: `${BASE_URI}/apis/${id}`,
    method: 'put',
    data: data
  });
}

export function updateApiStatus(id: string, enabled: boolean) {
  return request({
    url: `${BASE_URI}/apis/${id}`,
    method: 'patch',
    data: {enabled: enabled}
  });
}

export function updateApiName(id: string, name: string) {
  return request({
    url: `${BASE_URI}/apis/${id}`,
    method: 'patch',
    data: {name: name}
  });
}


export function deleteApi(id: string) {
  return request({
    url: `${BASE_URI}/apis/${id}`,
    method: 'delete'
  });
}

