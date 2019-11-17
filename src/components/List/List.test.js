import React from 'react'
import sinon from 'sinon'
import List, {buildPages, MAX_PAGES} from "./List"
import {reposCache} from "../../data/ReposCache"
import {mount} from "enzyme/build"
import {of} from "rxjs"

describe('[List]', () => {
  describe(('[Component Rendering]'), () => {
    let wrapper = mount(<List />)
    it(`no list items are rendered without data`, () => {
      expect(wrapper.find('li').length).toEqual(0)
      expect(wrapper.find('.listHeader').length).toEqual(0)
    })

    it(`renders all list items when there is data`, () => {
      const mockData = {
        loading: false,
        repos: {
          items: [
            {id: 1},
            {id: 2},
            {id: 3},
          ],
        },
        pagination: {page: 1, per_page: 30}
      }

      reposCache.getViewData$ = () => of(mockData)
      // render app again
      wrapper = mount(<List />)
      jest.useFakeTimers()
      setTimeout(() => {
        expect(wrapper.find('li').length).toEqual(mockData.repos.items.length)
        expect(wrapper.find('.listHeader').length).toEqual(1)
      }, 1000)
      jest.runAllTimers()
    })
  })

  describe('[buildPages]', ()=> {
    let updatePaginationSpy = sinon.spy()
    reposCache.updatePagination = updatePaginationSpy
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
