import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { firestore } from '../firebase'
import { useFirestoreCollection, useFirestoreDoc } from '../lib/db'
import { Player, Match } from '../types'
import { calculateElo, useNullableUser } from '../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

interface Params {
  uid: string
}

type EloDataPoint = {
  date: string
  elo: number
  matches: number
}

const Profile: React.FC = () => {
  const { uid } = useParams<Params>()
  const player = useFirestoreDoc<Player>(
    firestore.collection('players').doc(uid)
  )
  const matches = useFirestoreCollection<Match>('matches')
  const [user] = useNullableUser()

  if (!player || !matches) return <p>Loading...</p>

  const { dailyEloPlayerPairs } = calculateElo(matches)

  let eloDataPoints: EloDataPoint[] = []
  const today = dayjs()
  for (let i = 0; i < 60; i++) {
    const date = today.subtract(i, 'day')

    const mostRecentEloPair = dailyEloPlayerPairs
      .filter(
        (pair) =>
          pair.playerId === uid && dayjs(pair.date).isSameOrBefore(date, 'day')
      )
      .sort((a, b) => (dayjs(a.date).isAfter(b.date, 'day') ? -1 : 1))[0]

    const dailyMatches = matches.filter(
      (match) =>
        [match.playerA.id, match.playerB.id].includes(uid) &&
        dayjs(match.date.toDate()).isSame(date, 'day')
    ).length

    if (mostRecentEloPair) {
      eloDataPoints = [
        {
          date: date.format('MM-DD'),
          elo: mostRecentEloPair.elo,
          matches: dailyMatches,
        },
        ...eloDataPoints,
      ]
    }
  }

  return (
    <>
      <Header />

      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              <div className="box">
                <h1 className="title">
                  {player.firstName} {player.lastName}
                </h1>

                <p className="content">
                  {player.bio || 'This player has no bio set currently.'}
                </p>

                {user?.uid === uid && (
                  <Link to="/settings" className="button is-light">
                    <span className="icon">
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span>Edit Profile</span>
                  </Link>
                )}
              </div>
            </div>

            <div className="column">
              <div className="box">
                <h1 className="title">Stats</h1>

                <ResponsiveContainer width="100%" aspect={2}>
                  <ComposedChart data={eloDataPoints}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis
                      yAxisId={0}
                      type="number"
                      allowDecimals={false}
                      domain={[
                        (dataMin: number) => Math.floor(dataMin / 100) * 100,
                        (dataMax: number) => Math.ceil(dataMax / 100) * 100,
                      ]}
                    />
                    <YAxis
                      hide
                      yAxisId={1}
                      type="number"
                      allowDecimals={false}
                    />
                    <Tooltip formatter={(value: number) => value.toFixed(0)} />
                    <Legend />
                    <Bar yAxisId={1} dataKey="matches" fill="#0071baaa" />
                    <Line
                      yAxisId={0}
                      type="monotone"
                      dataKey="elo"
                      stroke="#ea1c2dff"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Profile
