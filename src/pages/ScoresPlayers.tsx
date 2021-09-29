import React from 'react'
import Header from '../components/Header'
import ScoresNav from '../components/ScoresNav'
import { useFirestoreCollection } from '../lib/db'
import { Match, Player } from '../types'
import PlayerRow from '../containers/PlayerRow'
import { calculateElo } from '../util'
import { ELO_INITIAL_RATING } from '../config'

const ScoresPlayers: React.FC = () => {
  const players = useFirestoreCollection<Player>('players') || []
  const matches = useFirestoreCollection<Match>('matches') || []

  const { playerEloPairs } = calculateElo(matches)
  const getElo = (playerId: string): number =>
    playerEloPairs.find((player) => player.playerId === playerId)?.elo ||
    ELO_INITIAL_RATING

  const sortedPlayers = players.sort((a, b) => getElo(b.id) - getElo(a.id))

  return (
    <>
      <Header />
      <section className="section">
        <ScoresNav />
        <div className="table-container">
          <table className="table is-fullwidth">
            <tbody>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Elo</th>
                <th>Matches</th>
                <th>Wins</th>
                <th>Streak</th>
                <th>Losses</th>
                <th>Win/Loss</th>
                <th>Career Goals Scored</th>
                <th>Career Goals Conceded</th>
                <th>Average Goal Differential</th>
              </tr>
              {matches &&
                sortedPlayers.map((player, i) => (
                  <PlayerRow
                    player={player}
                    elo={
                      playerEloPairs.find((pair) => pair.playerId === player.id)
                        ?.elo || ELO_INITIAL_RATING
                    }
                    matches={matches}
                    key={player.id}
                    rank={i + 1}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default ScoresPlayers
