import React, {useEffect, useState} from 'react'
import Root from "./styled/Root"
import List from "./List"
import Input from "./Input"
import {reposCache} from "../data/ReposCache"

const App = () => {
  const [isLoading, setIsLoading] = useState(() => false)
  useEffect(() => {
    reposCache.getViewData$().subscribe(({loading}) => {
      setIsLoading(loading)
    })
  }, [])
  return (
    <Root>
      <Input />
      {
        isLoading && <div>loading...</div>
      }
      <List />
    </Root>
  );
}

export default App
