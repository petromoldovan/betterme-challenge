import {BehaviorSubject, fromEvent, combineLatest} from "rxjs"
import {debounceTime, map, switchMap, distinctUntilChanged} from "rxjs/operators"
import get from 'lodash/get'
import {buildRequestParams, createCancelableHttp$} from "./utils"

const DIRECTION = {
  ASC: 'asc',
  DESC: 'desc'
}

const PAGIANTION_DEFAULT_PARAMS = {
  page: 1,
  per_page: 30
}

const ORDERBY_DEFAULT_PARAMS = {
  sort: DIRECTION.ASC,
  order: 'stars'
}

const initialStore = {
  repos: [],
  q: '',
  pagination: PAGIANTION_DEFAULT_PARAMS,
  orderBy: ORDERBY_DEFAULT_PARAMS
}

class ReposCacheClass {
  constructor() {
    this.store = new BehaviorSubject(initialStore)
    this.state$ = this.store.asObservable()
    this.repos$ = this.state$.pipe(map(s => s.repos, distinctUntilChanged()))
    this.pagination$ = this.state$.pipe(map(s => s.pagination, distinctUntilChanged()))
    this.orderBy$ = this.state$.pipe(map(s => s.orderBy, distinctUntilChanged()))
    this.q$ = this.state$.pipe(map(s => s.q, distinctUntilChanged()))

    this.api = 'https://api.github.com/search/repositories?'
  }

  updateStore = newState => {
    this.store.next(newState)
  }

  addOnSearchListener = (inputRef) => {
    if (!inputRef) return null
    const changeEvent$ = fromEvent(inputRef.current, 'input')
      .pipe(
        map(e => get(e, 'target.value')),
        debounceTime(300),
        switchMap(q => {
          return createCancelableHttp$(`${this.api}${buildRequestParams({...this.pagination$, ...this.orderBy$, q})}`)
        })
      )
    return changeEvent$.subscribe({
      next: res => {
        console.log('initialStore', this.store.getValue())
        this.updateStore({...this.store.getValue(), repos: res})
      },
      error: console.log,
      complete: console.log,
    })
  }

  getViewData$ = () => {
    return combineLatest(this.repos$, this.orderBy$, this.pagination$, this.q$)
      .pipe(
        map(([repos, orderBy, pagination, q]) => ({repos, orderBy, pagination, q}))
      )
  }
}

const reposCache = new ReposCacheClass()

export {
  reposCache
}
