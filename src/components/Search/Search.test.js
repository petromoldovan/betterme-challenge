import React from 'react'
import { mount } from 'enzyme'
import Search from "../Search/Search"

describe(('[Search]'), () => {
  let wrapper = mount(<Search />)
  it('contains header', () => {
    expect(wrapper.find('h1').length).toEqual(1)
  })
  it('contains input', () => {
    expect(wrapper.find('input').length).toEqual(1)
  })
})
