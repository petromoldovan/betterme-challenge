import React, {useEffect, useRef, useState} from 'react'
import {fromEvent} from 'rxjs'
import {debounceTime, switchMap, map} from 'rxjs/operators'
import get from 'lodash/get'
import Root from "./styled/Root"
import {buildRequestParams, createCancelableHttp$} from "../data/utils"

const DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
}

const DEFAULT_PARAMS = {
  sort: DIRECTION.ASC,
  order: 'stars',
  page: 1,
  per_page: 30
}

const App = () => {
  const [searchParams, setSearchParams] = useState(() => DEFAULT_PARAMS)
  const [data, setData] = useState(() => {})
  const inputRef = useRef(null)

  useEffect(() => {
    const changeEvent$ = fromEvent(inputRef.current, 'input')
      .pipe(
        map(e => get(e, 'target.value')),
        debounceTime(300),
        switchMap(q => {
          return createCancelableHttp$(buildRequestParams({...searchParams, q}))
        })
      )
    changeEvent$.subscribe({
      next: res => setData(res),
      error: console.log,
      complete: console.log,
    })
  }, [searchParams])

  return (
    <Root>
      <input ref={inputRef} type={'text'} />
      {
        console.log('data', data)
      }
    </Root>
  );
}

export default App
