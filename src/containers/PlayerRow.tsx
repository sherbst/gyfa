import React from 'react'
import { Player, Match, WithId } from '../types'
import {
  calculateAverageGoalDifferential,
  calculateConcededShots,
  calculateMadeShots,
  displayWinLossRatio,
  findCompetingMatches,
  findWinningMatches,
} from '../util'

interface Props {
  player: WithId<Player>
  matches: WithId<Match>[]
  elo: number
}

const PlayerRow: React.FC<Props> = ({ player, matches, elo }) => {
  const competingMatches = findCompetingMatches(matches, player.id)
  const winningMatches = findWinningMatches(matches, player.id)

  const totalMatches = competingMatches.length
  const wins = winningMatches.length
  const losses = totalMatches - wins

  return (
    <tr>
      <td>
        {player.firstName} {player.lastName}
      </td>
      <td>{Math.round(elo)}</td>
      <td>{totalMatches}</td>
      <td>{wins}</td>
      <td>{losses}</td>
      <td>{displayWinLossRatio(wins, losses)}</td>
      <td>{calculateMadeShots(matches, player.id)}</td>
      <td>{calculateConcededShots(matches, player.id)}</td>
      <td>{calculateAverageGoalDifferential(matches, player.id).toFixed(2)}</td>
    </tr>
  )
}

export default PlayerRow
