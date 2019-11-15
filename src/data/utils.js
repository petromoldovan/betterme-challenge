import {Observable} from "rxjs"
import axios from 'axios'

const HTTP_METHODS = {
  GET: 'GET'
}

const createCacelableHttp$ = (url, opt = {method: HTTP_METHODS.GET}) => {
  return new Observable(subscriber => {
    let cancelRequest
    const CancelToken = axios.CancelToken

    axios(url, {
      ...opt,
      cancelToken: new CancelToken(c => {
        cancelRequest = c
      })})
      .then(res => {
        return subscriber.next(res)
      })
      .catch(e => subscriber.error(e))
      .finally(() => subscriber.complete())

    return () => cancelRequest()
  })
}

export {
  createCacelableHttp$
}
