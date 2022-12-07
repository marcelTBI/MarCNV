export type backendRequestFirstProps = {
  method?: 'GET' | 'POST' | 'DELETE' | 'PUT'
  endpoint: string
  body?: FormData | object | null
  headers?: Headers
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>
  showErrorMessageTemporary?: boolean
  errorMessageDuration?: number
}

const getCurrentTime = () => {
  const now = new Date()
  return `${now.getFullYear()}-${
    now.getMonth() + 1
  }-${now.getDate()}T${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}`
}

export const createErrorMessage = (message: string | Array<unknown> | Record<string, unknown>): string => {
  if (typeof message === 'string') {
    return message
  } else if (Array.isArray(message) && Object.prototype.hasOwnProperty.call(message[0], 'msg')) {
    return message[0].msg
  } else {
    return JSON.stringify(message)
  }
}

export const handleMessageVisibility = (setMessage: React.Dispatch<React.SetStateAction<string>>, message: string, seconds: number = 2) => {
  setMessage(message)
  setTimeout(() => {
    setMessage('')
  }, seconds * 1000)
}

export const backendFirstRequest: (props: backendRequestFirstProps) => Promise<Response> = async ({
  method = 'GET',
  endpoint,
  body = null,
  headers,
  setErrorMessage,
  showErrorMessageTemporary = false,
  errorMessageDuration = 2,
}) => {
  const controller = new AbortController()
  const timeoutID = setTimeout(() => {
    console.error(`Request ${method} ${endpoint} took too long. Aborting Request`)
    controller.abort()
    setErrorMessage && setErrorMessage(`Request ${method} ${endpoint} took too long. Aborting Request`)
    window.location.reload()
  }, 60 * 3 * 1000) // ie 3 minutes

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
  requestHeaders.append('Origin', 'http://localhost:3000') // TODO change in production

  // fetch
  const response = await fetch(endpoint, { method: method, headers: requestHeaders, signal: controller.signal, body: requestBody })

  // set error message
  if (response.status !== 200 && setErrorMessage !== undefined) {
    const detail = await response.clone().json()
    const errorMessage = createErrorMessage(detail.detail)

    if (showErrorMessageTemporary) {
      handleMessageVisibility(setErrorMessage, errorMessage, errorMessageDuration)
    } else {
      setErrorMessage(errorMessage)
    }
  }

  clearTimeout(timeoutID) // important, otherwise the timeout is not reset and continues => abort request
  return response
}
