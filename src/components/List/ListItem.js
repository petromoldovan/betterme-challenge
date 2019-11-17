import React from 'react'
import '../styles.scss'

const ListItem = ({full_name, stargazers_count, html_url, description}) => {
  return (
    <li className={'rowItem direction-column'}>
      <div className={'rowItem direction-row space-between'}>
        <a href={html_url} target={'_blank'}>{full_name}</a>
        <p className={'bold'}>{stargazers_count}</p>
      </div>
      <p className={'pr30'}>
        {description}
      </p>
    </li>
  )
}

export default ListItem
