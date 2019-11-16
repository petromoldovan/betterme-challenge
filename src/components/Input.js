import React, {useEffect, useRef} from 'react'
import {reposCache} from "../data/ReposCache"

const Input = () => {
  const inputRef = useRef(null)

  useEffect(() => {
    const inputSubscription = reposCache.updateQ(inputRef)
    return () => inputSubscription.unsubscribe()
  }, [])

  return (
    <input ref={inputRef} type={'text'} />
  )
}

export default Input
