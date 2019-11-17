import React from 'react'
import sinon from 'sinon'
import * as mockUtils from './utils'
import {initialStore, reposCache} from "./ReposCache"
import {Observable} from "rxjs"

const mockData = {
  repos: {
    items: [{id:1}]
  }
}

describe('[ReposCache]', () => {
  it('holds the correct initial state', () => {
    expect(reposCache.store.getValue()).toEqual(initialStore)
  })

  describe('[Caching]', () => {
    const userInput = 'example repo'
    let httpRequestSpy = sinon.spy()
    mockUtils.createCancelableHttp$ = (url) => {
      return new Observable.create((sub) => {
        httpRequestSpy(url)
        sub.next(mockData.repos)
      })
    }

    it('repos are not netched initially', () => {
      expect(httpRequestSpy.called).toBe(false)
    })

    it('FIRST ITERATION: repos are refetched if q param changes', () => {
      jest.useFakeTimers()
      reposCache.updateStore({q: userInput})
      setTimeout(() => {
        expect(httpRequestSpy.calledOnce).toBe(true)
        expect(httpRequestSpy.args[0][0].includes(`q=${userInput}`)).toBe(true)
      }, 100)
      jest.runAllTimers()
    })

    it('SECOND ITERATION: repos are refetched if q param changes again', () => {
      jest.useFakeTimers()
      const q = `${userInput}1`
      reposCache.updateStore({ q })
      setTimeout(() => {
        expect(httpRequestSpy.callCount).toBe(2)
      }, 100)
      jest.runAllTimers()
    })

    it('THIRD ITERATION: cache is used when the old q value is inserted', () => {
      jest.useFakeTimers()
      reposCache.updateStore({q: userInput})
      setTimeout(() => {
        expect(httpRequestSpy.callCount).toBe(2)
      }, 100)
      jest.runAllTimers()
    })

    it('FOURTH ITERATION: fetches when pagination is changed', () => {
      jest.useFakeTimers()
      reposCache.updatePagination(4)
      setTimeout(() => {
        expect(httpRequestSpy.callCount).toBe(3)
      }, 100)
      jest.runAllTimers()
    })

    it('FIFTH ITERATION: fetches when orderBy is changed', () => {
      jest.useFakeTimers()
      reposCache.updateOrderBy({sort: ''})
      setTimeout(() => {
        expect(httpRequestSpy.callCount).toBe(4)
      }, 100)
      jest.runAllTimers()
    })
  })

  it('holds the correct end state', () => {
    const exp = {
      "loading": false,
      "orderBy": {"order": "desc", "sort": ""},
      "pagination": {"page": 1, "per_page": 30},
      "q": "example repo",
      "repos": {"items": [{"id": 1}]}
    }
    expect(reposCache.store.getValue()).toEqual(exp)
  })
})
