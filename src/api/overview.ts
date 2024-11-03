import request from "../utils/request.ts";
import {BASE_URI} from "./base.ts";

export function fetchOverview(filter?: object) {
  return request({
    url: `${BASE_URI}/overview`,
    method: 'get',
    params: {
      ...filter
    }
  });
}
