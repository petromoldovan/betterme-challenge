import {BehaviorSubject, fromEvent, combineLatest} from "rxjs"
import {debounceTime, map, switchMap, distinctUntilChanged, skipWhile} from "rxjs/operators"
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

const API_ENDPOINT = 'https://api.github.com/search/repositories'

class ReposCacheClass {
  constructor() {
    this.api = API_ENDPOINT

    this.store = new BehaviorSubject(initialStore)
    this.state$ = this.store.asObservable()
    this.repos$ = this.state$.pipe(map(s => s.repos, distinctUntilChanged()))
    this.pagination$ = this.state$.pipe(map(s => s.pagination, distinctUntilChanged()))
    this.orderBy$ = this.state$.pipe(map(s => s.orderBy, distinctUntilChanged()))
    this.q$ = this.state$.pipe(map(s => s.q, distinctUntilChanged()))

    combineLatest(this.q$, this.pagination$, this.orderBy$)
      .pipe(
        skipWhile(([q]) => q === ''),
        switchMap(([q, pagination, orderBy]) => {
          return createCancelableHttp$(`${this.api}${buildRequestParams({q, pagination, orderBy})}`)
        })
      )
      .subscribe(res => {
        this.updateStore({ repos: res, loading: false })
      })
  }

  updateStore = newState => {
    this.store.next({...this.store.getValue(), ...newState})
  }

  updateQ = (inputRef) => {
    if (!inputRef) return null
    const changeEvent$ = fromEvent(inputRef.current, 'input')
      .pipe(
        map(e => get(e, 'target.value')),
        debounceTime(300),
      )
    return changeEvent$.subscribe({
      next: q => this.updateStore({q})
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
