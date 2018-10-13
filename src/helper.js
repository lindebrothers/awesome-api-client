import fetch from 'isomorphic-fetch'

/**
 * Removes sensitive properties such as username and password.
 * @param {object} obj -  the object to remove properties from
 */
const cleanLogBody = (obj) => {
  // Remove username and password from being logged
  if ('username' in obj) {
    delete obj.username
  }
  if ('password' in obj) {
    delete obj.password
  }
  return obj
}

/**
 * Adds a Authorization header with a bearerToken
 * @param {string} token - the token to be added.
 * @returns {object} the object containing a authorization property
 */
const createAuthorizationHeader = (token) => {
  if (token === null) {
    return {}
  }

  return {
    Authorization: `Bearer ${token}`,
  }
}

/**
 * Creates a json header
 * @returns object - the object containing a content-type property
 */
const createJsonFormat = () => {
  return {
    'Content-Type': 'application/json; charset=utf-8;',
  }
}
export default {
  cleanLogBody,
  fetch,
  createAuthorizationHeader,
  createJsonFormat,
}
