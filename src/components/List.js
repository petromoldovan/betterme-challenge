import React, {useEffect, useState, useMemo} from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import {reposCache} from "../data/ReposCache"

const MAX_PAGES = 11
const buildPages = (currentPage, pageCount) => {
  let nMin = 1
  let nMax = pageCount > MAX_PAGES ? MAX_PAGES  : pageCount
  // find indexes
  const middle = Math.floor(MAX_PAGES / 2)
  if (currentPage > middle) {
    nMin = (currentPage - middle) > 0 ? currentPage - middle : 1
    nMax = (currentPage + middle) < pageCount ? currentPage + middle : pageCount
  }

  // build buttons
  let res = []
  if (nMin > 1) {
    res.push(<span key={`start`}>...</span>)
  }
  for (let i = nMin; i <= nMax; i++) {
    res.push(<button key={`btn${i}`} onClick={() => reposCache.updatePagination(i)}>{i}</button>)
  }
  if (nMax < pageCount) {
    res.push(<span key={`end`}>...</span>)
  }
  return res
}

const List = () => {
  const [data, setData] = useState(() => {})
  useEffect(() => {
    reposCache.getViewData$().subscribe(({repos, pagination}) => {
      setData({repos, pagination})
    })
  }, [])

  const {pages} = useMemo(() => {
    const pageCount = (Math.ceil(get(data, 'repos.total_count', 0) / get(data, 'pagination.per_page', 1)))
    const currentPage = get(data, 'pagination.page', 1)
    return {
      pages: buildPages(currentPage, pageCount)
    }
  }, [data])

  return (
    <div>
      <h1>List</h1>
      {!isEmpty(pages) && pages}
    </div>
  )
}

export default List
