import React, {useEffect, useState} from 'react'
import {reposCache} from "../data/ReposCache"

const List = () => {
  const [data, setData] = useState(() => {})
  useEffect(() => {
    reposCache.getViewData$().subscribe(d => {
      console.log('got data in list', d)
      setData(d)
    })
  }, [])

  return (
    <div>
      <h1>List</h1>
    </div>
  )
}

export default List
