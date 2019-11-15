import React, {useEffect, useRef, useState} from 'react'
import {fromEvent} from 'rxjs'
import {debounceTime, switchMap, map} from 'rxjs/operators'
import get from 'lodash/get'
import Root from "./styled/Root"
import {createCancelableHttp$} from "../data/utils"

const API_BASE = 'https://api.github.com/search/repositories?q=tetris&sort=stars&order=desc'

const App = () => {
  const [data, setData] = useState(() => {})
  const inputRef = useRef(null)

  useEffect(() => {
    const changeEvent$ = fromEvent(inputRef.current, 'input')
      .pipe(
        map(e => get(e, 'target.value')),
        debounceTime(300),
        switchMap(v => createCancelableHttp$(API_BASE))
      )
    changeEvent$.subscribe({
      next: res => setData(res),
      error: console.log,
      complete: console.log,
    })
  }, [])

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
