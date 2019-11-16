import React, {useEffect, useRef} from 'react'
import {reposCache} from "../data/ReposCache"

const Input = () => {
  const inputRef = useRef(null)

  /*useEffect(() => {
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
  }, [searchParams])*/

  useEffect(() => {
    const inputSubscription = reposCache.addOnSearchListener(inputRef)
    return () => inputSubscription.unsubscribe()
  }, [])

  return (
    <input ref={inputRef} type={'text'} />
  )
}

export default Input
