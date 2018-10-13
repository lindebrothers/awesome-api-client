import querystring from 'querystring'
import helper from './helper'

/**
 * This method makes the request and handles the response.
 * @param {object} config for the request
 * @returns {object} the response from the api
 */
const call = async ({ url, method, headers, body = {}, fetchOptions = {} }) => {
  let logBody
  const _originMethod = method
  if (method === 'POST' || method === 'PUT' || method === 'PATCH') {
    logBody = helper.cleanLogBody(JSON.parse(JSON.stringify(body)))
    logBody = querystring.stringify(logBody)
    body = JSON.stringify(body)
  } else if (method === 'FILE_UPLOAD') {
    method = 'POST'
    logBody = 'file'
  }

  const options = {
    ...{
      timeout: 5000,
    },
    ...fetchOptions,
    ...{
      headers,
      method,
      body,
    },
  }
  if (_originMethod === 'GET') {
    delete options.body
  }

  console.info(`request ${url} [${_originMethod}]`, { headers, body: logBody })

  try {
    const response = await helper.fetch(url, options)

    // Server responded with error
    if (response.status >= 400) {
      let error = new Error('Bad response from server')
      error.status = response.status
      error.message = response.statusText
      try {
        error = {
          ...error,
          ...(await response.json()),
        }
      } catch (e) {} // eslint-disable-line no-empty
      throw error
    }

    // Ok, but no content
    if (response.status === 204) {
      console.info(`response OK ${response.status} ${url}`)
      return {
        status: response.status,
        isOk: true,
      }
    }
    const data = await response.json()
    console.info(`response OK ${response.status} ${url}`, data)
    return {
      status: response.status,
      isOk: true,
      data,
    }
  } catch (err) {
    if (err.name === 'FetchError' || err.name === 'TypeError') {
      err.status = 503 // Service Unavailable
      err.message = 'Unable to fetch from the api'
      err.data = {}
    }
    err.isOk = false

    if (err.status === 401) {
      console.info(`response ${url}`, err)
    } else {
      console.error(`response ${url}`, err)
    }
    return err
  }
}

/**
 * Makes a GET request to the given url
 * @param {string} url - the url to request
 * @param {object} options - headers, authToken and method,
 * @returns {*} the response of the request
 */
const get = (url, { headers = {}, authToken = null, method = 'GET' } = {}) => {
  headers = {
    ...headers,
    ...helper.createAuthorizationHeader(authToken),
  }

  return call({
    url,
    headers,
    method,
  })
}

/**
 * Makes POST request to the given url
 * @param {string} url - the url to request
 * @param {object} body -  the post paramgetrar to send to the api
 * @param {object} options - headers, authToken and method
 * @returns {*} the response of the request
 */
const post = (
  url,
  body,
  { headers = {}, authToken = null, method = 'POST' } = {},
) => {
  headers = {
    ...headers,
    ...helper.createAuthorizationHeader(authToken),
    ...helper.createJsonFormat(),
  }
  return call({
    url,
    headers,
    body,
    method,
  })
}

/**
 * makes a PUT request
 * @param {string} url - the url to request
 * @param {object} body -  the post paramgetrar to send to the api
 * @param {object} options - headers, authToken and method
 * @returns {*} the response of the request
 */
const put = (url, body, { headers = {}, authToken = null } = {}) => {
  return post(url, body, { headers, authToken, method: 'PUT' })
}

/**
 * makes a PATCH request
 * @param {string} url - the url to request
 * @param {object} body -  the post paramgetrar to send to the api
 * @param {object} options - headers, authToken and method
 * @returns {*} the response of the request
 */
const patch = (url, body, { headers = {}, authToken = null } = {}) => {
  return post(url, body, { headers, authToken, method: 'PATCH' })
}

/**
 * Makes a DELETE request
 * @param {string} url - the url to request
 * @param {object} body -  the post paramgetrar to send to the api
 * @param {object} options - headers, authToken and method
 * @returns {*} the response of the request
 */
const deleteMethod = (url, { headers = {}, authToken = null } = {}) => {
  return get(url, { headers, authToken, method: 'DELETE' })
}

/**
 * Sends a file in the request
 * @param {*} url - Url to the API
 * @param {*} file - the file to upload
 * @param {*} options
 */
const upload = (url, file, { headers = {}, authToken = null } = {}) => {
  headers = {
    ...{
      'Content-Type': file.type,
    },
    ...helper.createAuthorizationHeader(authToken),
    ...headers,
  }

  return call({
    url,
    body: file,
    headers,
    method: 'FILE_UPLOAD',
  })
}

export default {
  call,
  get,
  post,
  put,
  patch,
  upload,
  delete: deleteMethod,
}
