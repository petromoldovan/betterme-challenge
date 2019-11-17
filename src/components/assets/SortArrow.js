import React from 'react'

const SortArrow = ({ color = '#003B61' }) => (
  <svg width={10} height={10} viewBox='0 0 9 5'>
    <g stroke='none' strokeWidth='1' fill='none' fillRule='evenodd' strokeLinecap='round' strokeLinejoin='round'>
      <g transform='translate(-1061.000000, -487.000000)' stroke={color} opacity={1} strokeWidth='1.2'>
        <g transform='translate(1061.000000, 487.000000)'>
          <polyline points='0.6 0.6 4.5 4.4 8.4 0.6' />
        </g>
      </g>
    </g>
  </svg>
)

export default SortArrow
