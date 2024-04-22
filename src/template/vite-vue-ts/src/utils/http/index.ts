import {
  type AxiosRequestConfig,
  type AxiosResponse,
  type GenericAbortSignal,
} from 'axios'
import Http, { type RequestOtherConfig } from './http-requests'

interface RequestConfig extends RequestOtherConfig, AxiosRequestConfig {}

export interface RequestOption extends RequestConfig {
  completed?: boolean
  signal?: GenericAbortSignal
}

export type Option = Omit<RequestOption, 'completed'>

// not option
function request<T = R>(config: AxiosRequestConfig): Promise<T>

// option.completed = true
function request<T = R>(
  config: RequestConfig,
  option: RequestOption & { completed: true },
): Promise<AxiosResponse<T, any>>

// option.completed = false
function request<T = R>(
  config: RequestConfig,
  option: RequestOption & { completed: false },
): Promise<T>

// option = {}
function request<T = R>(
  config: RequestConfig,
  option: Record<string, never>,
): Promise<T>

// option other key
function request<T = R, D = RequestOption>(
  config: RequestConfig,
  option?: D,
): Promise<D extends { completed: true } ? AxiosResponse<T, any> : T>

async function request<T = R>(config: RequestConfig, option?: RequestOption) {
  const response = await Http.getAxiosInstance().request<T>(config)

  if (option && option.completed) {
    return response
  } else {
    return response.data
  }
}

export { request }
export default request
export * from './http-requests'
