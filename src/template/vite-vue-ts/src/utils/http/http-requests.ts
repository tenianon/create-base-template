import Axios, {
  type AxiosInstance,
  type CreateAxiosDefaults,
  type InternalAxiosRequestConfig,
  type AxiosRequestConfig,
  type AxiosResponse,
} from 'axios'
import qs from 'qs'

export interface RequestOtherConfig {
  throttle?: boolean
  reconnect?: {
    enable?: boolean
    count?: number
  }
}

interface RequestConfig
  extends RequestOtherConfig,
    InternalAxiosRequestConfig {}

interface Response extends AxiosResponse {
  config: RequestConfig
}

const axiosInstanceConfig: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 2_000,
  headers: {},
  paramsSerializer: (params) => {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  },
}

const defaultRequestConfig: RequestOtherConfig = {
  throttle: true,
  reconnect: {
    enable: false,
    count: 5,
  },
}

const transformKey = (config: AxiosRequestConfig) => {
  const method = config.method?.toLowerCase() || 'get'
  return `${method}=${config.url}`
}

class HttpRequest {
  public static axiosInstance: AxiosInstance
  private static controllerListMap: Map<string, AbortController>
  // reconnect
  private static defaultReconnectCount = defaultRequestConfig.reconnect
  // throttle
  private static defaultThrottle = defaultRequestConfig.throttle

  constructor() {
    HttpRequest.axiosInstance = Axios.create(axiosInstanceConfig)

    HttpRequest.controllerListMap = new Map()

    this.setupInterceptors()
  }

  // setup interceptors
  private setupInterceptors() {
    // request interceptors
    HttpRequest.axiosInstance.interceptors.request.use(
      (config: RequestConfig) => {
        console.log(config)

        // Throttling
        if (config.throttle ?? HttpRequest.defaultThrottle) {
          const controllerListMap = this.getController()
          if (controllerListMap.has(transformKey(config))) {
            return Promise.reject('There is an unresponsive identical request')
          }
        }

        // add controller
        const controller = HttpRequest.createController(config)
        config.signal = config.signal ?? controller.signal

        // add reconnect
        config.reconnect = config.reconnect ?? HttpRequest.defaultReconnectCount
        if (config.reconnect?.enable && config.reconnect?.count === undefined) {
          config.reconnect.count = HttpRequest.defaultReconnectCount?.count
        }

        return config
      },
    )

    // response interceptors
    HttpRequest.axiosInstance.interceptors.response.use(
      (response: Response) => {
        // delete controller map
        if (response.config.signal) {
          console.log(312)
          HttpRequest.deleteController(response.config)
        }

        return response
      },
      (error) => {
        const originalRequestConfig = error.config as RequestConfig

        HttpRequest.deleteController(originalRequestConfig)

        if (
          originalRequestConfig.reconnect?.enable &&
          (error.code === 'ECONNABORTED' || !error.response)
        ) {
          let reconnectCount = originalRequestConfig.reconnect.count || 0
          console.log(reconnectCount)
          if (reconnectCount > 0) {
            reconnectCount--

            originalRequestConfig.reconnect.count = reconnectCount

            this.getAxiosInstance().request(originalRequestConfig)
          } else {
            Promise.reject('Tried reconnection request, but still no response')
          }
        }
        return Promise.reject(error)
      },
    )
  }

  // create controller
  private static createController(config: RequestConfig) {
    const key = transformKey(config)

    const controller = new AbortController()

    if (!this.controllerListMap.has(key)) {
      this.controllerListMap.set(key, controller)
    }

    return controller
  }

  // delete controller
  private static deleteController(config: AxiosRequestConfig) {
    console.log(config)
    const key = transformKey(config)

    this.controllerListMap.delete(key)
  }

  // abort controller
  public abortController(config: AxiosRequestConfig) {
    const key = transformKey(config)
    const controller = this.getController(key)
    if (controller) {
      controller.abort()
      HttpRequest.deleteController(config)
    }
  }

  // get controller
  public getController(): Map<string, AbortController>
  public getController(key: string): AbortController | undefined
  public getController(key?: string) {
    if (key) {
      return HttpRequest.controllerListMap.get(key)
    } else {
      return HttpRequest.controllerListMap
    }
  }

  // get axiosInstance
  public getAxiosInstance() {
    return HttpRequest.axiosInstance
  }
}

export const httpRequest = new HttpRequest()
export default httpRequest
