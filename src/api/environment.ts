import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";
export function getVariables() {
  return request({
    url: `${BASE_URI}/environment/variables`,
    method: 'get'
  });
}
