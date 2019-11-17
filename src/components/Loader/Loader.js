import React from 'react'
import LoaderSVG from "./LoaderSVG"
import '../styles.scss'

const Loader = () => {
  return (
    <aside className={'modal'}>
      <LoaderSVG />
    </aside>
  )
}

export default Loader
