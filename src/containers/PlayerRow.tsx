import React from 'react'
import { Player, Match, WithId } from '../types'
import {
  calculateAverageGoalDifferential,
  calculateConcededShots,
  calculateMadeShots,
  calculateStreak,
  displayWinLossRatio,
  findCompetingMatches,
  findWinningMatches,
} from '../util'
import { Link } from 'react-router-dom'

interface Props {
  player: WithId<Player>
  matches: WithId<Match>[]
  elo: number
  rank: number
}

const PlayerRow: React.FC<Props> = ({ player, matches, elo, rank }) => {
  const competingMatches = findCompetingMatches(matches, player.id)
  const winningMatches = findWinningMatches(matches, player.id)

  const totalMatches = competingMatches.length
  const wins = winningMatches.length
  const losses = totalMatches - wins

  const streak = calculateStreak(matches, player.id)

  return (
    <tr>
      <td>{rank}</td>
      <td>
        <Link to={`/players/${player.id}`}>
          {player.firstName} {player.lastName}
        </Link>
      </td>
      <td>{Math.round(elo)}</td>
      <td>{totalMatches}</td>
      <td>{wins}</td>
      <td>{losses}</td>
      <td>
        {streak === 0 ? (
          ''
        ) : (
          <>
            {Math.abs(streak)} {streak > 0 ? 'W' : 'L'}
          </>
        )}
      </td>
      <td>{displayWinLossRatio(wins, losses)}</td>
      <td>{calculateMadeShots(matches, player.id)}</td>
      <td>{calculateConcededShots(matches, player.id)}</td>
      <td>{calculateAverageGoalDifferential(matches, player.id).toFixed(2)}</td>
    </tr>
  )
}

export default PlayerRow
