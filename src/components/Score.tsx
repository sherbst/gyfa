import React from 'react'
import { Set } from '../types'
import ConditionalStrong from './ConditionalStrong'

interface Props {
  scoreA: number
  scoreB: number
}

const Score: React.FC<Props> = ({ scoreA, scoreB }) => {
  const playerAWins = scoreA > scoreB
  return (
    <>
      <ConditionalStrong strong={playerAWins}>{scoreA}</ConditionalStrong> -{' '}
      <ConditionalStrong strong={!playerAWins}>{scoreB}</ConditionalStrong>
    </>
  )
}

export default Score
