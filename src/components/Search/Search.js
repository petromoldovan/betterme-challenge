import React, {useEffect, useRef} from 'react'
import {reposCache} from "../../data/ReposCache"
import '../styles.scss'

const Search = () => {
  const inputRef = useRef(null)

  useEffect(() => {
    const inputSubscription = reposCache.updateQ(inputRef)
    return () => inputSubscription.unsubscribe()
  }, [])

  return (
    <section>
      <div className={'rowItem direction-column'}>
        <h1>Enter search term</h1>
        <input className={'input'} ref={inputRef} type={'text'} placeholder={'Search GitHub'} />
      </div>
    </section>
  )
}

export default Search
