import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Header from '../components/Header'
import { useFirestoreCollection } from '../lib/db'
import { Match, Player, Ref } from '../types'
import { firestore, firebase } from '../firebase'
import { v4 as uuid } from 'uuid'

const CORRECT_PASSWORD = 'gyfa321!'

interface FormData {
  playerA: string
  playerB: string
  set1PlayerAScore: string
  set1PlayerBScore: string
  set2PlayerAScore: string
  set2PlayerBScore: string
}

const AddMatch: React.FC = () => {
  const [locked, setLocked] = useState(true)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (password === CORRECT_PASSWORD) {
      setLocked(false)
    }
  }, [password])

  const players = useFirestoreCollection<Player>('players') || []

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const data = Object.fromEntries(
      new FormData(e.currentTarget).entries()
    ) as unknown as FormData

    const match: Match = {
      playerA: firestore.collection('players').doc(data.playerA) as Ref<Player>,
      playerB: firestore.collection('players').doc(data.playerB) as Ref<Player>,
      date: firebase.firestore.Timestamp.now(),
      sets: [
        {
          scoreA: Number(data.set1PlayerAScore),
          scoreB: Number(data.set1PlayerBScore),
        },
        {
          scoreA: Number(data.set2PlayerAScore),
          scoreB: Number(data.set2PlayerBScore),
        },
      ],
    }

    firestore
      .collection('matches')
      .doc(uuid())
      .set(match)
      .then(() => {
        alert('Match saved')
        window.location.reload()
      })
  }

  return (
    <>
      <Header />
      <section className="section">
        <h1 className="title">Add Match</h1>
        {locked ? (
          <>
            <p>This page is password protected for the time being.</p>
            <div className="field">
              <div className="control">
                <input
                  className="input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="title is-4">Players</h3>
            <div className="field is-grouped">
              <div className="control">
                <div className="select">
                  <select name="playerA" required>
                    {players.map((player) => (
                      <option value={player.id} key={player.id}>
                        {player.firstName} {player.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {' vs. '}
              <div className="control">
                <div className="select">
                  <select name="playerB" required>
                    {players.map((player) => (
                      <option value={player.id} key={player.id}>
                        {player.firstName} {player.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <h3 className="title is-4">Set 1</h3>
            <div className="field is-grouped">
              <div className="control">
                <input
                  required
                  type="number"
                  className="input"
                  name="set1PlayerAScore"
                />
              </div>
              {' to '}
              <div className="control">
                <input
                  required
                  type="number"
                  className="input"
                  name="set1PlayerBScore"
                />
              </div>
            </div>
            <h3 className="title is-4">Set 2</h3>
            <div className="field is-grouped">
              <div className="control">
                <input
                  required
                  type="number"
                  className="input"
                  name="set2PlayerAScore"
                />
              </div>
              {' to '}
              <div className="control">
                <input
                  required
                  type="number"
                  className="input"
                  name="set2PlayerBScore"
                />
              </div>
            </div>
            <button type="submit" className="button is-info">
              Save Match
            </button>
          </form>
        )}
      </section>
    </>
  )
}

export default AddMatch
