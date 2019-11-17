import React from 'react';
import App from './App';
import { shallow, mount } from 'enzyme';
import Search from "../Search/Search"
import List from "../List/List"
import Loader from "../Loader/Loader"
import {reposCache} from "../../data/ReposCache"
import {of} from 'rxjs'

describe(('[App]'), () => {
  let wrapper = shallow(<App />)

  it('renders Search', () => {
    expect(wrapper.find(Search).length).toEqual(1)
  })

  it('renders List', () => {
    expect(wrapper.find(List).length).toEqual(1)
  })

  it('does not render Loader when `isLoading` state is `false`', () => {
    expect(wrapper.find(Loader).length).toEqual(0)
  })

  it('renders Loader when `isLoading` state is `true`', () => {
    reposCache.getViewData$ = () => of({loading: true})
    // render app again
    wrapper = mount(<App />)
    jest.useFakeTimers()
    setTimeout(() => {
      expect(wrapper.find(Loader).length).toEqual(1)
    }, 1000)
    jest.runAllTimers()
  })
})
