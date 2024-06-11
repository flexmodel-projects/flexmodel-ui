import type {AxiosRequestConfig, AxiosResponse} from 'axios'
import axios from 'axios'

export interface ResponseData {
  code: number
  data?: any
  message?: string
  success?: boolean
}

/**
 * 异常处理程序
 * 1. 根据报错类型做不同的错误处理，处理完原样抛出去
 * 2. 后续程序不需要catch处理错误，只需要接收结果，如果报错后面的程序将不会执行
 *    这样可以减少后续处理结果时判断status的样板代码
 */
const errorHandler = async (error: { response: any, message: string }) => {
  const {response, message} = error
  // request用catch捕获报错
  if (response.status >= 400 && response.status < 500) {
    ElMessage.warning(response?.data.message || message);
  } else if (response.status >= 500) {
    ElMessage.error(response?.data.message || message);
  }
  return Promise.reject(response)
}

const request = axios.create({
  baseURL: import.meta.env.MODE === 'production' ? '/' : '/',
  withCredentials: true, // 当跨域请求时发送cookie
  timeout: 5 * 60 * 1000, // 0 不做限制
})

// 全局性接口，和空间无关，无需家space code header
// const API_WITHOUT_SPACE_CODE: Record<string, 1> = {
//   '/api/userinfo': 1,
// }

// request.interceptors.request.use(
//   async (config: AxiosRequestConfig & { cType?: boolean }) => {
//     // 如果设置了cType 说明是自定义 添加 Content-Type类型 为自定义post 做铺垫
//     if (config.cType) {
//       config.headers!['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
//     }
//     return config
//   },
// )

request.interceptors.response.use(
  async (response: AxiosResponse) => {
    const res: ResponseData = response.data
    if (res.code < 200 || res.code >= 300) {
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({response, message: 'CustomError'})
    }

    // 重置刷新token
    // if (token) {
    //     await setToken(token);
    // }

    return response
  },
  /* error => {} */ // 已在 export default catch
)

export default function (config: AxiosRequestConfig) {
  return request(config)
    .then((response: AxiosResponse) => response.data)
    .catch((error: any) => errorHandler(error))
}
