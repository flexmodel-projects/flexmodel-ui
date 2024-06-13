import request from "~/utils/request";
import {BASE_URI} from "~/api/base";

export function getVariables() {
  return request({
    url: `${BASE_URI}/environment/variables`,
    method: 'get'
  });
}
