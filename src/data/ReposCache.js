import {BehaviorSubject, fromEvent, combineLatest, of} from "rxjs"
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
  orderBy: ORDERBY_DEFAULT_PARAMS,
  loading: false
}

const API_ENDPOINT = 'https://api.github.com/search/repositories'

class ReposCacheClass {
  store = new BehaviorSubject(initialStore)
  state$ = this.store.asObservable()
  repos$ = this.state$.pipe(map(s => s.repos), distinctUntilChanged())
  pagination$ = this.state$.pipe(map(s => s.pagination), distinctUntilChanged())
  orderBy$ = this.state$.pipe(map(s => s.orderBy), distinctUntilChanged())
  q$ = this.state$.pipe(map(s => s.q), distinctUntilChanged())
  loading$ = this.state$.pipe(map(s => s.loading), distinctUntilChanged())

  constructor() {
    this.cache = new Map()
    this.api = API_ENDPOINT

    // fetch whenever one of the observables emits a new value
    combineLatest(this.q$, this.pagination$, this.orderBy$)
      .pipe(
        skipWhile(([q]) => q === ''),
        switchMap(([q, pagination, orderBy]) => {
          const params = buildRequestParams({q, pagination, orderBy})
          if (this.cache.has(params)) {
            return of(this.cache.get(params))
          }
          return createCancelableHttp$(`${this.api}${params}`)
        }),
      )
      .subscribe(res => {
        this.setInCache(res)
        this.updateStore({ repos: res, loading: false })
      })
  }

  setInCache = (res) => {
    const {pagination, q, orderBy} = this.store.getValue()
    const key = buildRequestParams({q, pagination, orderBy})
    if (!this.cache.has(key)) {
      this.cache.set(key, res)
    }
  }

  purge = () => {
    this.cache.clear()
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
      next: q => this.updateStore({q, loading: true})
    })
  }

  updatePagination = pagination => {
    this.updateStore({pagination, loading: true})
  }

  updateOrderBy = orderBy => {
    this.updateStore({orderBy, loading: true})
  }

  getViewData$ = () => {
    return combineLatest(this.repos$, this.orderBy$, this.pagination$, this.q$, this.loading$)
      .pipe(
        map(([repos, orderBy, pagination, q, loading]) => ({repos, orderBy, pagination, q, loading}))
      )
  }
}

const reposCache = new ReposCacheClass()

export {
  reposCache
}
