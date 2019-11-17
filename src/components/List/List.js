import React, {useEffect, useState, useMemo} from 'react'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import pick from 'lodash/pick'
import ListItem from './ListItem'
import {DIRECTION, reposCache} from "../../data/ReposCache"
import '../styles.scss'
import SortArrow from "../assets/SortArrow"

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
    res.push(<button key={`btn${i}`} className={i === currentPage? 'active' : ''} onClick={() => reposCache.updatePagination(i)}>{i}</button>)
  }
  if (nMax < pageCount) {
    res.push(<span key={`end`}>...</span>)
  }
  return (
    <div className={'rowItem direction-row pageContainer'}>
      {res}
    </div>
  )
}

const buildListItems = (items = [], orderBy = {}) => {
  if (!items || isEmpty(items)) return null
  return (
    <div className={'listContainer'}>
      <div className={'listHeader'}>
        <p className={'bold'}>Project</p>
        <div className={'sortable clickable'} onClick={() => reposCache.updateOrderBy({sort: 'stars'})}>
          <p className={'bold'}>Stars</p>
          <div className={orderBy.order === DIRECTION.ASC ? 'rotate' : ''}>
            <SortArrow />
          </div>
        </div>
      </div>
      <ul className={'rowItem direction-column'}>
        {items.map((item, idx) => <ListItem key={`row-${idx}`} {...pick(item, ['full_name', 'stargazers_count', 'html_url', 'description'])}/>)}
      </ul>
    </div>

  )
}

const List = () => {
  const [data, setData] = useState(() => {})
  useEffect(() => {
    reposCache.getViewData$().subscribe(({repos, pagination, orderBy}) => {
      setData({repos, pagination, orderBy})
    })
  }, [])

  const {pages, items} = useMemo(() => {
    const pageCount = (Math.ceil(get(data, 'repos.total_count', 0) / get(data, 'pagination.per_page', 1)))
    const currentPage = get(data, 'pagination.page', 1)
    const items = get(data, 'repos.items', [])
    const orderBy = get(data, 'orderBy', {})
    return {
      pages: buildPages(currentPage, pageCount),
      items: buildListItems(items, orderBy)
    }
  }, [data])

  return (
    <section>
      <div className={'rowItem direction-column'}>
        {
          items
        }
        {!isEmpty(pages) && pages}
      </div>
    </section>
  )
}

export default List
