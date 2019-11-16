import {from, Observable} from "rxjs"
import axios from "axios"
import {catchError, map, retry, timeout} from "rxjs/operators"
import get from 'lodash/get'

export const HTTP_METHODS = {
  GET: 'GET'
}

const DEFAULT_TIMEOUT = 2000

const createCancelableHttp$ = (url, opt = {method: HTTP_METHODS.GET}) => {
  return new Observable(subscriber => {
    let cancelRequest
    const CancelToken = axios.CancelToken

    axios(url, {
      ...opt,
      cancelToken: new CancelToken(c => {
        cancelRequest = c
      })})
      .then(res => subscriber.next(res))
      .catch(e => subscriber.error(e))
      .finally(() => subscriber.complete())

    // cancel request on unsubscribe
    return () => cancelRequest()
  })
    .pipe(
      map(res => get(res, 'data')),
      timeout(DEFAULT_TIMEOUT),
      catchError(e => {
        console.log('e',e)
        return from(e)
      }),
      retry(1)
    )
}

const buildRequestParams = (params) => {
  let url = ''
  for (let key in params) {
    if (url !== '') {
      url += '&'
    }
    url += `${key}=${params[key]}`
    if (key === 'q') {
      url += '+in:name'
    }
  }
  return url
}

export {
  createCancelableHttp$,
  buildRequestParams
}
