import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function saveSettings(data: object) {
  return request({
    url: `${BASE_URI}/settings`,
    method: 'patch',
    data: data
  });
}

export function getSettings() {
  return request({
    url: `${BASE_URI}/settings`,
    method: 'get'
  });
}
