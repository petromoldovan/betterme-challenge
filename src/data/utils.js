import {Observable} from "rxjs"
import {map, timeout, catchError, retry} from 'rxjs/operators'
import axios from 'axios'
import get from 'lodash/get'

const HTTP_METHODS = {
  GET: 'GET'
}

const DEFAULT_TIMEOUT = 3000

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

    return () => cancelRequest()
  })
    .pipe(
      map(res => get(res, 'data')),
      timeout(DEFAULT_TIMEOUT),
      catchError(e => {
        console.log('e', e)
        return e
      }),
      retry(1)
    )
}

export {
  createCancelableHttp$
}
