import {BASE_URI} from "./base.ts";
import request from "../utils/request.ts";

export function executeQuery(data: object) {
  return request({
    url: `${BASE_URI}/graphql`,
    method: 'post',
    data: data
  });
}
