import React from 'react'
import Header from '../components/Header'
import ScoresNav from '../components/ScoresNav'
import { useFirestoreCollection } from '../lib/db'
import { Match, Player } from '../types'
import MatchRow from '../containers/MatchRow'
import { calculateElo } from '../util'

const ScoresMatches: React.FC = () => {
  const players = useFirestoreCollection<Player>('players') || []
  const matches = useFirestoreCollection<Match>('matches') || []

  const { eloChanges } = calculateElo(matches)

  const maxSets = matches.reduce(
    (max, match) => Math.max(match.sets.length, max),
    0
  )

  const sortedMatches = matches.sort(
    (a, b) => b.date.toMillis() - a.date.toMillis()
  )

  return (
    <>
      <Header />
      <section className="section">
        <ScoresNav />
        <div className="table-container">
          <table className="table is-fullwidth">
            <tbody>
              <tr>
                <th>Players</th>
                <th>Date</th>
                <th>Effect on Elo</th>
                <th>Total</th>
                {new Array(maxSets).fill(null).map((_, i) => (
                  <th>Set {i + 1}</th>
                ))}
              </tr>
              {players &&
                sortedMatches.map((match) => (
                  <MatchRow
                    key={match.id}
                    eloChange={
                      eloChanges.find((change) => change.matchId === match.id)!
                    }
                    match={match}
                    players={players}
                    maxSets={maxSets}
                  />
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default ScoresMatches
