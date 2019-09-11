// const baseUri = 'https://places.click/'
const baseUri = 'http://192.168.1.102:8000/'
import {AsyncStorage} from "react-native"

const initialHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
}

const _getHeaders = async (headers) => {
  let token = await AsyncStorage.getItem('authToken')
  let updatedHeaders = Object.assign({}, initialHeaders)
  console.log('FIRST HEADERS =====================', updatedHeaders)
  if (headers && Object.keys(headers).length > 0) {
    headers.forEach((header) => {
      updatedHeaders = Object.assign({}, updatedHeaders, header)
    })
  }
  console.log('AFTER CHECKING OPTS ====================', updatedHeaders)
  if (token) {
    updatedHeaders = Object.assign({}, updatedHeaders, {'Authorization': `Token ${token}`})
  }
  console.log('AFTER SETTING TOKEn ====================', updatedHeaders)
  return updatedHeaders
}

const _getBody = (headers, data) => {
  // Stringify only if content type is JSON
  let body = headers['Content-Type'] === 'application/json'
    ? JSON.stringify(data)
    : data
  return body
}

const http =  {
  post: async (opts) => {
    let requestHeaders = await _getHeaders(opts.headers)

    let url = opts.url && opts.url[0] === '*' ? baseUri + opts.url.slice(1, opts.url.length) : opts.url

    console.log('URL POST============', url)

    let body = _getBody(requestHeaders, opts.data)

    return fetch(url, {
      method: opts.method || 'POST',
      headers: requestHeaders,
      body: body,
      credentials: 'include'
    })
  },
  get: async (opts) => {
    let requestHeaders = await _getHeaders(opts.headers)
    let url = opts.url && opts.url[0] === '*' ? baseUri + opts.url.slice(1, opts.url.length) : opts.url

    console.log('URL GET============', url)

    if (opts.data) {
      const strParams = Object.keys(opts.data).map((el) => {
        if (Array.isArray(opts.data[el])) {
          return `${el}=[${opts.data[el]}]&`
        }
        return `${el}=${opts.data[el]}&`
      })
      url = `${url}?${strParams.join('')}`
    }
    // CSRF КУКА СТАВИТСЯ
    return fetch(url, {
      headers: requestHeaders,
      credentials: 'include'
    })
  }
}

export default http