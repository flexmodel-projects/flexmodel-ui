import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function getDatasourceList() {
  return request({
    url: `${BASE_URI}/datasources`,
    method: 'get'
  });
}

export function syncModels(datasourceName: string, models: string[]) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/sync`,
    method: 'post',
    data: models
  });
}

export function validateDatasource(data: any) {
  return request({
    url: `${BASE_URI}/datasources/validate`,
    method: 'post',
    data: data
  });
}

export function getPhysicsModelNames(data: any) {
  return request({
    url: `${BASE_URI}/datasources/physics/names`,
    method: 'post',
    data: data
  });
}

export function createDatasource(data: any) {
  return request({
    url: `${BASE_URI}/datasources`,
    method: 'post',
    data: data
  });
}

export function updateDatasource(datasourceName: string, data: any) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}`,
    method: 'put',
    data: data
  });
}

export function deleteDatasource(datasourceName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}`,
    method: 'delete'
  });
}
