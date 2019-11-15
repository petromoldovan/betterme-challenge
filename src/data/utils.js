import {Observable} from "rxjs"
import axios from 'axios'

const HTTP_METHODS = {
  GET: 'GET'
}

const createCacelableHttp$ = (url, opt = {method: HTTP_METHODS.GET}) => {
  return new Observable(subscriber => {
    axios(url, {...opt})
      .then(res => {
        console.log('res', res)
        return subscriber.next(res)
      })
      .catch(e => subscriber.error(e))
      .finally(() => subscriber.complete())
  })
}

export {
  createCacelableHttp$
}
