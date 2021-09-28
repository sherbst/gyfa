import React from 'react'
import { useFirestoreCollection } from '../lib/db'
import { Match, Player } from '../types'
import { calculateElo, findTopEloChangePlayer, isSameDate } from '../util'

const TodaysStats: React.FC = () => {
  const players = useFirestoreCollection<Player>('players') || []
  const matches = useFirestoreCollection<Match>('matches') || []

  const { eloChanges } = calculateElo(matches)

  const todaysMatches = matches.filter((match) =>
    isSameDate(match.date.toDate(), new Date())
  )
  const todaysEloChanges = eloChanges.filter((change) =>
    isSameDate(change.date, new Date())
  )

  const topGainerId = findTopEloChangePlayer(todaysEloChanges, true)
  const topGainer = topGainerId
    ? players.find((player) => player.id === topGainerId)
    : null
  const topGainerChangeSum = todaysEloChanges
    .filter((change) => change.playerId === topGainerId)
    .reduce((sum, change) => sum + change.eloChange, 0)

  const topLoserId = findTopEloChangePlayer(todaysEloChanges, false)
  const topLoser = topLoserId
    ? players.find((player) => player.id === topLoserId)
    : null
  const topLoserChangeSum = todaysEloChanges
    .filter((change) => change.playerId === topLoserId)
    .reduce((sum, change) => sum + change.eloChange, 0)

  return (
    <div className="level">
      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Matches Played</p>
          <p className="title">{todaysMatches.length}</p>
        </div>
      </div>

      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Today's Top Gainer</p>
          <p className="title">
            {topGainer
              ? `${topGainer.firstName} ${topGainer.lastName}`
              : 'None'}{' '}
            ({topGainerChangeSum > 0 && '+'}
            {Math.round(topGainerChangeSum)})
          </p>
        </div>
      </div>

      <div className="level-item has-text-centered">
        <div>
          <p className="heading">Today's Top Loser</p>
          <p className="title">
            {topLoser ? `${topLoser.firstName} ${topLoser.lastName}` : 'None'} (
            {topLoserChangeSum > 0 && '+'}
            {Math.round(topLoserChangeSum)})
          </p>
        </div>
      </div>
    </div>
  )
}

export default TodaysStats
