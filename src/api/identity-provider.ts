import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function getIdentityProviders() {
  return request({
    url: `${BASE_URI}/identity-providers`,
    method: 'get'
  });
}

export function createIdentityProvider(data: object) {
  return request({
    url: `${BASE_URI}/identity-providers`,
    method: 'post',
    data: data
  });
}

export function updateIdentityProvider(id: string, data: object) {
  return request({
    url: `${BASE_URI}/identity-providers/${id}`,
    method: 'put',
    data: data
  });
}

export function deleteIdentityProvider(id: string) {
  return request({
    url: `${BASE_URI}/identity-providers/${id}`,
    method: 'delete'
  });
}

