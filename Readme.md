# Awesome-api-client

The awesome-api-client is a nice wrapper around fetch that makes it easier to work with Api integration.

The reason for writing this module is to avoid dublicate code. I felt that I wrote this kind of code or copying and pasting it all the time everytime I started a new project. So with this module, I hope that you can save some time and do other great stuff without having to write Api integration all the time. :=)

## Get Started

### Install awesome-api-client

```
npm install @lindebros/awesome-api-client
```

### How to use it

Just include the client anywhere in your project. Use it in your redux actions, in your node express server, server side as well as the browser side.

```
import ApiClient from '@lindebros/awesome-api-client'

const someFunction = async () => {
  const response = await ApiClient.get('https://api', {
    authToken: 'someToken'
  })
  if (response.isOk) {
    // do something awesome here...
  }
}
```

Available methods:

#### GET

```
ApiClient.get(url, {
  headers: {object} custom headers,
  authToken: {string} token that will be set as a propertry of headers object (Authentication: bearer {token})
})
```

#### POST

```
ApiClient.post({string} url, {object} body, {object} options = {
  headers: {object} custom headers,
  authToken: {string} token that will be set as a propertry of headers object (Authentication: bearer {token})
})
```

#### PUT

```
ApiClient.put({string} url, {object} body, {object} options = {
  headers: {object} custom headers,
  authToken: {string} token that will be set as a propertry of headers object (Authentication: bearer {token})
})
```

#### PATCH

```
ApiClient.patch({string} url, {object} body, {object} options = {
  headers: {object} custom headers,
  authToken: {string} token that will be set as a propertry of headers object (Authentication: bearer {token})
})
```

#### DELETE

```
ApiClient.delete(url, {
  headers: {object} custom headers,
  authToken: {string} token that will be set as a propertry of headers object (Authentication: bearer {token})
})
```

#### UPLOAD

Sends a file upload request.

```
ApiClient.delete(url, file, {
  headers: {object} custom headers,
  authToken: {string} token that will be set as a propertry of headers object (Authentication: bearer {token})
})
```

#### CALL

All methods above are shortcuts of the `call` function.
If none of the methods above suits your needs, you can use the `call` function to make a request to your API.

```
ApiClient.call({object} options = {
  url: {string} the url to the endpoint of your api,
  method: {string} the rest method to use,
  headers: {object} headers to send in the request,
  body = {object} the body of your request,
  fetchOptions = {object} options of the fetch function (isomorphic-fetch)
})
```

## Mocking the api-client when unittesting

This client is great when writing unittests in for instance `jest`. When you write API integration unittests, just mock this module using `jest.mock`.

Here's an example of how a unittests can look like.
Lets say that `getBooks` are using the `get` method of the `ApiClient`, then just let jest mock the get method and fake a response from it:

```
import ApiClient from '@lindebros/awesome-api-client'
import getBooks from 'getBooks'


jest.mock('@lindebros/awesome-api-client')

test('this code is actually never making a request', () => {
  ApiClient.get = jest.fn(() => ({
    isOk: 400,
    error: {
      'message': 'this is a really bad request',
    }
  }))

  getBooks()

  expect(ApiClient.get.mock.calls[0][0]).toEqual('https://someapiurl')
})
```

Unittesting a React Redux Action:

The action:

```
const ERROR = 'Some error event action'
const myErrorAction = createAction(ERROR)
export const MyAwesomeAction = (params) => async (dispatch) => {
  const response = await ApiClient.post('https://myUrl', params)

  if (!response.isOk) {
    // do som great error handling here
    dispatch(myErrorAction(response.data))
  }
}
```

The unittest:

```
const mockDispatcher = jest.fn()
ApiClient.post = jest.fn(() => ({
  isOk: 400,
  error: {
    'message': 'this is a really bad request',
  }
}))

const fn = MyAwesomeAction({ a: 'b'})

fn(mockDispatcher)

expect(ApiClient.post.mock.calls.[0]).toEqual({
  type: 'Some error event action',
  payload: 'this is a really bad request',
})
```
