import {Observable} from "rxjs"
import axios from "axios"
import {map, retry, timeout} from "rxjs/operators"
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
      retry(1)
    )
}

const buildRequestParams = (params) => {
  return `?q=${get(params, 'q')}+in:name&order=${get(params, 'orderBy.order', '')}&sort=${get(params, 'orderBy.sort', '')}&page=${get(params, 'pagination.page', '')}&per_page=${get(params, 'pagination.per_page', '')}`
}
export {
  createCancelableHttp$,
  buildRequestParams
}
