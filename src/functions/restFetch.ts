export type BackendRequestProps = {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  endpoint: string
  body?: FormData | object | null
  headers?: Headers
  timeout?: number
}

export type BackendResponse = {
  status: number
  errorMessage: string
  json: Record<string, unknown>
}

const getCurrentTime = () => {
  const now = new Date()
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`
}

export const createErrorMessage = (message: string | Array<unknown> | Record<string, unknown>): string => {
  if (typeof message === 'string') {
    return message
  } else if (Array.isArray(message) && message.length > 0 && Object.prototype.hasOwnProperty.call(message[0], 'msg')) {
    return JSON.stringify(message[0].msg)
  } else if (!Array.isArray(message) && Object.prototype.hasOwnProperty.call(message, 'message')) {
    return JSON.stringify(message.message)
  } else {
    return JSON.stringify(message)
  }
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  return String(error)
}

const fetchWithTimeout: (props: BackendRequestProps) => Promise<Response> = async ({
  method = 'GET',
  endpoint,
  body = null,
  headers,
  timeout = 60 * 3 * 1000,
}) => {
  // process body
  let requestBody = null
  if (body) {
    if (body instanceof FormData) {
      requestBody = body
    } else if (typeof body === 'object') {
      requestBody = JSON.stringify(body)
    }
  }

  // collect headers
  const requestHeaders = new Headers(headers ?? { 'Content-Type': 'application/json' })
  requestHeaders.set('timestamp', getCurrentTime())
  requestHeaders.append('Accept', 'application/json')
  requestHeaders.append('Access-Control-Allow-Origin', '*')

  // build an abort controller
  const controller = new AbortController()
  const timeoutID = setTimeout(() => {
    console.error(`Request ${method} ${endpoint} took too long. Aborting Request`)
    controller.abort(`Request ${method} ${endpoint} took too long. Aborting Request`)
  }, timeout) // timeout is in miliseconds (default 3 mins)

  // fetch
  const response = await fetch(endpoint, { method: method, headers: requestHeaders, signal: controller.signal, body: requestBody })

  // clear timeout and return
  clearTimeout(timeoutID) // important, otherwise the timeout is not reset and continues => abort request
  return response
}

export const backendRequest: (props: BackendRequestProps) => Promise<BackendResponse> = async (props) => {
  try {
    // try to fetch
    const response = await fetchWithTimeout(props)

    // try to convert to json
    try {
      const json = await response.json()
      return { status: response.status, errorMessage: response.status === 200 ? '' : createErrorMessage(json), json: json }
    } catch (error) {
      console.error(error)
      return { status: response.status, errorMessage: `Response not converted to JSON! (${getErrorMessage(error)})`, json: {} }
    }
  } catch (error) {
    // this is probably timeout error (TODO parse error to make sure?)
    console.error(error)
    return { status: 408, errorMessage: getErrorMessage(error), json: {} }
  }
}
