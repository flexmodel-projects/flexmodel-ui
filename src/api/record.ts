import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function getRecordList(datasourceName: string, modelName: string,
                              query?: {
                                current: number,
                                pageSize: number
                              }) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/records`,
    method: 'get',
    params: query
  });
}

export function getOneRecord(datasourceName: string, modelName: string, id: any) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/records/${id}`,
    method: 'get'
  });
}

export function createRecord(datasourceName: string, modelName: string, data: {}) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/records`,
    method: 'post',
    data: data
  });
}

export function updateRecord(datasourceName: string, modelName: string, id: any, data: {}) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/records/${id}`,
    method: 'put',
    data: data
  });
}

export function deleteRecord(datasourceName: string, modelName: string, id: any) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/records/${id}`,
    method: 'delete'
  });
}
