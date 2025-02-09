import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function getSystemProfile() {
  return request({
    url: `${BASE_URI}/system/profile`,
    method: 'get'
  });
}
