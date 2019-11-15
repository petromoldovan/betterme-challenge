import React, {useEffect} from 'react'
import Root from "./styled/Root"
import {createCacelableHttp$} from "../data/utils"

const API_BASE = 'https://api.github.com/search/repositories?q=tetris&sort=stars&order=desc'

const App = () => {
  useEffect(() => {
    createCacelableHttp$(API_BASE)
      .subscribe({
        next: console.log,
        error: console.log,
        complete: console.log,
      })
  }, [])
  
  return (
    <Root>
      hello
    </Root>
  );
}

export default App
