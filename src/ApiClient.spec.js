import ApiClient from './ApiClient'
import helper from './helper'

jest.mock('isomorphic-fetch')

global.console = {
  log: () => {},
  info: () => {},
  error: () => {},
}

describe('ApiClient', () => {
  describe('call', () => {
    it('can call and handle a 200 response', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      const response = await ApiClient.call({
        url: 'http://something',
        method: 'GET',
        headers: helper.createAuthorizationHeader('someToken'),
        body: {
          a: 'b',
          c: 'd',
        },
      })

      // has a bool isOk var and it is true when receiving 200
      expect(response.isOk).toEqual(true)

      // can provide http status of the response
      expect(response.status).toEqual(200)

      // can provide the response from fetch in property data
      expect(response.data).toEqual({ something: 'awesome' })

      // Can provide a url
      expect(helper.fetch.mock.calls[0][0]).toBe('http://something')

      // Can provide headers to fetch
      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toBe(
        'Bearer someToken',
      )

      // body should be removed when using get method
      expect(helper.fetch.mock.calls[0][1].body).toBeUndefined()
    })

    it('can call and handle a 400 response', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 400,
          json: () => ({
            error: 'validation error',
          }),
        }
      })

      const response = await ApiClient.call({
        url: 'http://something',
        method: 'GET',
        headers: helper.createAuthorizationHeader('someToken'),
        body: {
          a: 'b',
          c: 'd',
        },
      })
      console.log('error response', response)
      // has bool isOk set to false when receiving errors
      expect(response.isOk).toEqual(false)

      // can provide http status of the response
      expect(response.status).toEqual(400)

      // as response json data merged with the response itself
      expect(response.error).toEqual('validation error')
    })

    it('has a body when using post method', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.call({
        url: 'http://something',
        method: 'POST',
        headers: helper.createAuthorizationHeader('someToken'),
        body: {
          a: 'b',
          c: 'd',
        },
      })

      // has a body json encoded
      expect(helper.fetch.mock.calls[0][1].body).toEqual('{"a":"b","c":"d"}')
    })
  })

  // GET ---------------------------------------------------------------------------------
  describe('get', () => {
    it('set custom headers', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.get('http://awesome', {
        headers: { someHeader: 'and its value' },
      })
      expect(helper.fetch.mock.calls[0][1].headers.someHeader).toEqual(
        'and its value',
      )
    })
    it('can set authorization header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.get('http://awesome', { authToken: 'awesomeToken' })

      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toEqual(
        'Bearer awesomeToken',
      )
    })
    it('sets no authorization header when authToken is not set', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.get('http://awesome')

      expect(
        helper.fetch.mock.calls[0][1].headers.Authorization,
      ).toBeUndefined()
    })

    it('set custom headers', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.get('http://awesome', {
        headers: { someHeader: 'and its value' },
      })
      expect(helper.fetch.mock.calls[0][1].headers.someHeader).toEqual(
        'and its value',
      )
    })
    it('can set authorization header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.get('http://awesome', { authToken: 'awesomeToken' })

      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toEqual(
        'Bearer awesomeToken',
      )
    })
    it('sets no authorization header when authToken is not set', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.get('http://awesome')

      expect(
        helper.fetch.mock.calls[0][1].headers.Authorization,
      ).toBeUndefined()
    })
  })

  // POST ----------------------------------------------------------------------------------
  describe('post', () => {
    it('set custom headers', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.post(
        'http://awesome',
        {
          a: 'b',
          c: 'd',
        },
        {
          headers: { someHeader: 'and its value' },
        },
      )
      expect(helper.fetch.mock.calls[0][1].headers.someHeader).toEqual(
        'and its value',
      )
    })
    it('sets authorization header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.post(
        'http://awesome',
        {
          a: 'b',
          c: 'd',
        },
        {
          authToken: 'awesomeToken',
        },
      )

      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toEqual(
        'Bearer awesomeToken',
      )
    })
    it('sets content-type header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.post(
        'http://awesome',
        {
          a: 'b',
          c: 'd',
        },
        {
          authToken: 'awesomeToken',
        },
      )

      expect(helper.fetch.mock.calls[0][1].headers['Content-Type']).toEqual(
        'application/json; charset=utf-8;',
      )
    })
    it('sets no authorization header when authToken is not set', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.post('http://awesome', {
        a: 'b',
        c: 'd',
      })

      expect(
        helper.fetch.mock.calls[0][1].headers.Authorization,
      ).toBeUndefined()
    })
    it('sets a body when using post method', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.post('http://something', {
        a: 'b',
        c: 'd',
      })

      // has a body json encoded
      expect(helper.fetch.mock.calls[0][1].body).toEqual('{"a":"b","c":"d"}')
    })
  })

  // PUT ----------------------------------------------------------------------------------
  describe('put', () => {
    it('set custom headers', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.put(
        'http://awesome',
        {
          a: 'b',
          c: 'd',
        },
        {
          headers: { someHeader: 'and its value' },
        },
      )
      expect(helper.fetch.mock.calls[0][1].headers.someHeader).toEqual(
        'and its value',
      )
    })
    it('can set authorization header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.put(
        'http://awesome',
        {
          a: 'b',
          c: 'd',
        },
        {
          authToken: 'awesomeToken',
        },
      )

      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toEqual(
        'Bearer awesomeToken',
      )
    })
    it('sets no authorization header when authToken is not set', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.put('http://awesome', {
        a: 'b',
        c: 'd',
      })

      expect(
        helper.fetch.mock.calls[0][1].headers.Authorization,
      ).toBeUndefined()
    })
    it('sets a body when using post method', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.put('http://something', {
        a: 'b',
        c: 'd',
      })

      // has a body json encoded
      expect(helper.fetch.mock.calls[0][1].body).toEqual('{"a":"b","c":"d"}')
    })
  })

  // DELETE -----------------------------------------------------------------------
  describe('delete', () => {
    it('set custom headers', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.delete('http://awesome', {
        headers: { someHeader: 'and its value' },
      })
      expect(helper.fetch.mock.calls[0][1].headers.someHeader).toEqual(
        'and its value',
      )
    })
    it('can set authorization header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.delete('http://awesome', { authToken: 'awesomeToken' })

      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toEqual(
        'Bearer awesomeToken',
      )
    })
    it('sets no authorization header when authToken is not set', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.delete('http://awesome')

      expect(
        helper.fetch.mock.calls[0][1].headers.Authorization,
      ).toBeUndefined()
    })

    it('set custom headers', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.delete('http://awesome', {
        headers: { someHeader: 'and its value' },
      })
      expect(helper.fetch.mock.calls[0][1].headers.someHeader).toEqual(
        'and its value',
      )
    })

    it('can set authorization header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.delete('http://awesome', { authToken: 'awesomeToken' })

      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toEqual(
        'Bearer awesomeToken',
      )
    })
    it('sets no authorization header when authToken is not set', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.delete('http://awesome')

      expect(
        helper.fetch.mock.calls[0][1].headers.Authorization,
      ).toBeUndefined()
    })
  })

  describe('upload', () => {
    it('can set custom headers', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.upload(
        'http://awesome',
        {
          name: 'awesome.jpg',
          size: 2000,
          type: 'image/jpeg',
        },
        {
          headers: { someHeader: 'and its value' },
        },
      )
      expect(helper.fetch.mock.calls[0][1].headers.someHeader).toEqual(
        'and its value',
      )
    })
    it('sets authorization header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.upload(
        'http://awesome',
        {
          name: 'awesome.jpg',
          size: 2000,
          type: 'image/jpeg',
        },
        {
          authToken: 'awesomeToken',
        },
      )

      expect(helper.fetch.mock.calls[0][1].headers.Authorization).toEqual(
        'Bearer awesomeToken',
      )
    })
    it('sets content-type header', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.upload(
        'http://awesome',
        {
          name: 'awesome.jpg',
          size: 2000,
          type: 'image/jpeg',
        },
        {
          authToken: 'awesomeToken',
        },
      )

      expect(helper.fetch.mock.calls[0][1].headers['Content-Type']).toEqual(
        'image/jpeg',
      )
    })
    it('sets no authorization header when authToken is not set', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.upload('http://awesome', {
        name: 'awesome.jpg',
        size: 2000,
        type: 'image/jpeg',
      })

      expect(
        helper.fetch.mock.calls[0][1].headers.Authorization,
      ).toBeUndefined()
    })
    it('sets a body when using upload method', async () => {
      helper.fetch = jest.fn(() => {
        return {
          status: 200,
          json: () => ({
            something: 'awesome',
          }),
        }
      })
      await ApiClient.post('http://something', {
        name: 'awesome.jpg',
        size: 2000,
        type: 'image/jpeg',
      })

      // has a body json encoded
      expect(helper.fetch.mock.calls[0][1].body).toEqual(
        '{"name":"awesome.jpg","size":2000,"type":"image/jpeg"}',
      )
    })
  })
})
