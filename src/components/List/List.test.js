import React from 'react'
import sinon from 'sinon'
import {buildPages, MAX_PAGES} from "./List"
import {reposCache} from "../../data/ReposCache"

describe('[List]', () => {
  let updatePaginationSpy = sinon.spy()
  beforeEach(() => {
    reposCache.updatePagination = updatePaginationSpy
  })

  describe('[buildPages]', ()=> {
    it('active page is in the beginning', () => {
      const activePage = 3
      const exp = buildPages(activePage, 20)
      const pageItems = exp.props.children
      expect(pageItems.length).toEqual(MAX_PAGES + 1) // MAX_PAGES + 1 for '...'

      const activeItem = pageItems.find(item => item.props.className === 'active')
      expect(activeItem.props.children).toEqual(activePage)
    });

    it('active page is in the middle', () => {
      const activePage = 10
      const exp = buildPages(activePage, 20)
      const pageItems = exp.props.children
      expect(pageItems.length).toEqual(MAX_PAGES + 2) // MAX_PAGES + 2 for '...'

      const activeItem = pageItems.find(item => item.props.className === 'active')
      expect(activeItem.props.children).toEqual(activePage)
    });

    it('clicking on a button updates the cache with correct page idx', () => {
      const exp = buildPages(10, 20)
      const pageItems = exp.props.children

      pageItems[1].props.onClick()
      expect(updatePaginationSpy.calledOnce).toBe(true)
      expect(updatePaginationSpy.args[0][0]).toEqual(pageItems[1].props.children)
    })
  })
})
