import dayjs from 'dayjs'
import React, { useState } from 'react'
import Select from 'react-select'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Header from '../components/Header'
import ScoresNav from '../components/ScoresNav'
import { useFirestoreCollection } from '../lib/db'
import { Match, Player } from '../types'
import { calculateElo } from '../util'
import Colorhash from 'color-hash'

interface PlayerOption {
  value: string
  label: string
}

interface ChartDataPoint {
  date: string
  playerId: string
  elo: number
}

const colorhash = new Colorhash({
  saturation: 0.5,
  lightness: [0.35, 0.5, 0.65],
})

const ScoresGraph: React.FC = () => {
  const players = useFirestoreCollection<Player>('players')
  const matches = useFirestoreCollection<Match>('matches')

  const [activePlayers, setActivePlayers] = useState<readonly PlayerOption[]>(
    []
  )

  if (!players || !matches) return <p>Loading...</p>

  const { dailyEloPlayerPairs } = calculateElo(matches)

  let chartData: ChartDataPoint[] = []
  const today = dayjs()
  for (let i = 0; i < 60; i++) {
    const date = today.subtract(i, 'day')

    for (const player of activePlayers) {
      const mostRecentEloPair = dailyEloPlayerPairs
        .filter(
          (pair) =>
            pair.playerId === player.value &&
            dayjs(pair.date).isSameOrBefore(date, 'day')
        )
        .sort((a, b) => (dayjs(a.date).isAfter(b.date, 'day') ? -1 : 1))[0]

      if (mostRecentEloPair) {
        chartData = [
          {
            date: date.format('MM-DD'),
            playerId: player.value,
            elo: mostRecentEloPair.elo,
          },
          ...chartData,
        ]
      }
    }
  }

  return (
    <>
      <Header />

      <section className="section">
        <ScoresNav />

        <div className="box">
          <h5 className="title is-5">Compare</h5>

          <Select
            isMulti
            options={players.map((player) => ({
              value: player.id,
              label: `${player.firstName} ${player.lastName}`,
            }))}
            onChange={setActivePlayers}
            value={activePlayers}
          />
        </div>

        <div className="box">
          <ResponsiveContainer width="100%" aspect={2}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                type="category"
                allowDuplicatedCategory={false}
              />
              <YAxis
                type="number"
                allowDecimals={false}
                domain={[
                  (dataMin: number) => Math.floor(dataMin / 100) * 100,
                  (dataMax: number) => Math.ceil(dataMax / 100) * 100,
                ]}
              />
              <Tooltip formatter={(value: number) => value.toFixed(0)} />
              <Legend />
              {activePlayers.map((player) => (
                <Line
                  dataKey="elo"
                  data={chartData.filter(
                    (point) => point.playerId === player.value
                  )}
                  name={player.label}
                  stroke={colorhash.hex(player.value)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </>
  )
}

export default ScoresGraph
