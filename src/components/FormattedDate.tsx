import React from 'react'
import { Timestamp } from '../types'

interface Props {
  date: Timestamp
}

const FormattedDate: React.FC<Props> = ({ date }) => {
  return <>{date.toDate().toLocaleDateString()}</>
}

export default FormattedDate
