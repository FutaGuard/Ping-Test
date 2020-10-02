import { readonly, ref, watch } from 'vue'

export interface UsePingOptions {
  timeout?: number
  multiplier?: number
  autoRefresh?: boolean
  refreshInterval?: number
  debug?: boolean
}

interface PingResponse {
  error?: any | null
  delta?: number | null
}

const defaultPingOptions = {
  multiplier: 1,
  autoRefresh: false,
  refreshInterval: 2000,
  debug: false,
}

const wait = (ms?: number) => new Promise((resolve) => setTimeout(resolve, ms))
const timeout = <T>(p: Promise<T>, ms?: number) =>
  Promise.race([
    p,
    wait(ms).then(() => {
      throw new Error('Timeout')
    }),
  ])

const usePing = (
  testurl: string,
  opts: UsePingOptions = defaultPingOptions,
) => {
  const url = new URL(testurl)
  const host = ref(url.host)
  const delta = ref<number | null>(null)
  const error = ref<Error | null>(null)
  const loading = ref(false)
  const debug = opts?.debug ?? defaultPingOptions.debug
  const multiplier = opts?.multiplier || defaultPingOptions.multiplier
  const refreshInterval =
    opts?.refreshInterval || defaultPingOptions.refreshInterval
  const autoRefresh = ref(opts?.autoRefresh ?? defaultPingOptions.autoRefresh)
  const intervalId = ref<number>(0)

  const pingByFetch = (origin: string): Promise<PingResponse> => {
    let started: number = 0
    const cb = <T>(respOrErr: T) => {
      const delta = +new Date() - started
      const error = respOrErr instanceof Response ? null : respOrErr
      return { error, delta }
    }
    const init: RequestInit = {
      method: 'head',
      mode: 'no-cors',
      cache: 'no-cache',
    }
    started = +new Date()
    // use /favicon.ico path to prevent redirection
    return fetch(origin + '/favicon.ico', init).then(cb, cb)
  }

  const logError = () => {
    debug && error.value && console.log(error.value)
  }
  const errorHandler = (err: Error) => {
    delta.value = -1
    error.value = err
    logError()
  }
  const successHandler = (resp: PingResponse) => {
    if (resp.error) {
      errorHandler(resp.error)
    } else {
      let ms = resp.delta ?? -1
      if (ms >= 0) {
        ms = Math.floor(ms * multiplier)
      }
      delta.value = ms
      error.value = resp.error ?? null
    }
  }

  const ping = () => {
    loading.value = true
    const task = opts?.timeout
      ? timeout(pingByFetch(url.origin), opts?.timeout)
      : pingByFetch(url.origin)
    return task.then(successHandler, errorHandler).finally(() => {
      loading.value = false
    })
  }

  watch(
    autoRefresh,
    (val) => {
      intervalId.value && clearInterval(intervalId.value)
      if (val) {
        intervalId.value = (setInterval(() => {
          ping()
        }, refreshInterval) as unknown) as number
      }
    },
    { immediate: true },
  )

  const toggleAutoRefresh = (val?: boolean) => {
    autoRefresh.value = val == null ? !autoRefresh.value : val
  }

  return {
    ping,
    toggleAutoRefresh,
    delta: readonly(delta),
    error: readonly(error),
    host: readonly(host),
    loading: readonly(loading),
  }
}

export default usePing
