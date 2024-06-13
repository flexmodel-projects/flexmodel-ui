import request from '../utils/request'
import {BASE_URI} from './base'
import {Datasource} from "~/types";

export function getDatasourceList() {
  return request({
    url: `${BASE_URI}/datasources`,
    method: 'get'
  });
}

export function refreshDatasource(datasourceName: string) {
  return request({
    url: `${BASE_URI}/datasources/${datasourceName}/refresh`,
    method: 'get'
  });
}

export function validateDatasource(data: Datasource) {
  return request({
    url: `${BASE_URI}/datasources/validate`,
    method: 'post',
    data: data
  });
}

export function createDatasource(data: Datasource) {
  return request({
    url: `${BASE_URI}/datasources`,
    method: 'post',
    data: data
  });
}

export function updateDatasource(datasourceName: string, data: Datasource) {
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
