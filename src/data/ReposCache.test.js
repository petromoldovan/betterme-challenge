import React from 'react'
import sinon from 'sinon'
import * as mockUtils from './utils'
import {reposCache} from "./ReposCache"
import {from, of, Observable} from "rxjs"
import {HTTP_METHODS} from "./utils"

const mockData = {
  repos: {
    items: [{id:1}]
  },
  pagination: {
    page: 1,
    per_page: 30
  },
  loading: false
}

describe('[ReposCaghe]', () => {
  let updatePaginationSpy = sinon.spy()
  let httpRequestSpy = sinon.spy()
  beforeEach(() => {
    reposCache.updatePagination = updatePaginationSpy
    reposCache.getViewData$ = () => of(mockData)
    mockUtils.createCancelableHttp$ = (url, opt = {method: HTTP_METHODS.GET}) => {
      return new Observable.create(sub => {
        console.log('=========FETCHING')
        httpRequestSpy(url)
      })
    }
  })

  it('repos are not netched initially', () => {
    expect(updatePaginationSpy.called).toBe(false)
  })

  it('repos are refetched if q param changes', async () => {
    const userInput = 'example repo'
    reposCache.updateStore({q: userInput})
    setTimeout(() => {
      expect(httpRequestSpy.called).toBe(true)
      expect(httpRequestSpy.args[0][0].includes(`q=${userInput}`)).toBe(true)
    }, 100)
  })
})

