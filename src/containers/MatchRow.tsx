import React from 'react'
import { Match, Player, WithId } from '../types'
import Score from '../components/Score'
import ConditionalStrong from '../components/ConditionalStrong'
import FormattedDate from '../components/FormattedDate'
import { calculatePlayerScoreFromMatch, EloChange } from '../util'

interface Props {
  match: WithId<Match>
  players: WithId<Player>[]
  eloChange: EloChange
  maxSets: number
}

const MatchRow: React.FC<Props> = ({ match, players, eloChange, maxSets }) => {
  const playerA = players.find((player) => player.id === match.playerA.id)
  const playerB = players.find((player) => player.id === match.playerB.id)

  const playerAScore = calculatePlayerScoreFromMatch(match, match.playerA.id)
  const playerBScore = calculatePlayerScoreFromMatch(match, match.playerB.id)

  const playerAWins = playerAScore > playerBScore

  if (!playerA || !playerB) return <tr />

  return (
    <tr>
      <td>
        <ConditionalStrong strong={playerAWins}>
          {playerA.firstName} {playerA.lastName}
        </ConditionalStrong>{' '}
        vs.{' '}
        <ConditionalStrong strong={!playerAWins}>
          {playerB.firstName} {playerB.lastName}
        </ConditionalStrong>
      </td>
      <td>
        <FormattedDate date={match.date} showTime />
      </td>
      <td>{Math.round(Math.abs(eloChange.eloChange))}</td>
      <td>
        <Score scoreA={playerAScore} scoreB={playerBScore} />
      </td>
      {new Array(maxSets).fill(null).map((_, i) => (
        <td>
          {match.sets[i] && (
            <Score
              scoreA={match.sets[i].scoreA}
              scoreB={match.sets[i].scoreB}
            />
          )}
        </td>
      ))}
    </tr>
  )
}

export default MatchRow
