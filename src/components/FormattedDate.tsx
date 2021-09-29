import React from 'react'
import { Timestamp } from '../types'

interface Props {
  date: Timestamp
  showTime?: boolean
}

const FormattedDate: React.FC<Props> = ({ date, showTime = false }) => {
  return (
    <>
      {date.toDate().toLocaleDateString()}{' '}
      {showTime && date.toDate().toLocaleTimeString()}
    </>
  )
}

export default FormattedDate
