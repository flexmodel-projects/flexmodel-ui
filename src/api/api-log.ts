import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function getApiLogs(current: number = 1, pageSize: number = 50, filter?: object) {
  return request({
    url: `${BASE_URI}/logs`,
    method: 'get',
    params: {
      current,
      pageSize,
      ...filter,
    }
  });
}

export function getApiLogStat(filter?: object) {
  return request({
    url: `${BASE_URI}/logs/stat`,
    method: 'get',
    params: {
      ...filter
    }
  })
}
