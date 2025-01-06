import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";
import {Model} from "../pages/DataModeling/data";

export function getModelList(datasourceName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models`,
    method: 'get'
  });
}

export function createModel(datasourceName: string, data: Model) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models`,
    method: 'post',
    data: {...data, type: 'entity'}
  });
}

export function modifyModel(datasourceName: string, data: { name: string, statement: any, type: string }) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${data.name}`,
    method: 'put',
    data: data,
  });
}

export function dropModel(datasourceName: string, modelName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}`,
    method: 'delete'
  });
}

export function createField(datasourceName: string, modelName: string, data: any) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/fields`,
    method: 'post',
    data: data
  });
}

export function modifyField(datasourceName: string, modelName: string, fieldName: string, data: any) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/fields/${fieldName}`,
    method: 'put',
    data: data
  });
}

export function dropField(datasourceName: string, modelName: string, fieldName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/fields/${fieldName}`,
    method: 'delete'
  });
}

export function createIndex(datasourceName: string, modelName: string, data: any) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/indexes`,
    method: 'post',
    data: data
  });
}

export function modifyIndex(datasourceName: string, modelName: string, indexName: string, data: any) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/indexes/${indexName}`,
    method: 'put',
    data: data
  });
}

export function dropIndex(datasourceName: string, modelName: string, indexName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/models/${modelName}/indexes/${indexName}`,
    method: 'delete'
  });
}
