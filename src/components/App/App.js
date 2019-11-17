import React, {useEffect, useState} from 'react'
import List from "../List/List"
import Search from "../Search/Search"
import {reposCache} from "../../data/ReposCache"
import '../styles.scss'
import Loader from "../Loader/Loader"

const App = () => {
  const [isLoading, setIsLoading] = useState(() => false)
  useEffect(() => {
    reposCache.getViewData$().subscribe(({loading}) => {
      setIsLoading(loading)
    })
  }, [])
  return (
    <main className={'main'}>
      <article>
        <Search />
        <List />
      </article>
      {
        isLoading && <Loader />
      }
    </main>
  );
}

export default App
