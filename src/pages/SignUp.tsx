import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header'
import LoginNav from '../components/LoginNav'
import { firebase, firestore } from '../firebase'
import { Player } from '../types'
import classNames from 'classnames'

const SignUp: React.FC = () => {
  const [firstName, setFirstname] = useState('')
  const [lastName, setLastname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState<null | string>(null)
  const [isLoading, setLoading] = useState(false)

  const history = useHistory()

  const submitDisabled =
    [firstName, lastName, email, password].some((val) => val === '') ||
    isLoading

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const creds = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)

      const uid = creds.user?.uid || ''

      const existingPlayers = await firestore
        .collection('players')
        .where('firstName', '==', firstName)
        .where('lastName', '==', lastName)
        .get()

      const newPlayerRef = firestore.collection('players').doc(uid)

      let newPlayer: Player = {
        firstName,
        lastName,
      }

      const firstUnclaimedPlayer = existingPlayers.docs.filter(
        (doc) => (doc.data() as Player).claimed !== true
      )[0]

      if (firstUnclaimedPlayer) {
        const oldPlayerRef = firstUnclaimedPlayer.ref

        // Transfer existing player to new ID
        newPlayer = firstUnclaimedPlayer.data() as Player

        // Move existing matches to new ID
        const [participatingMatchesPlayerA, participatingMatchesPlayerB] =
          await Promise.all([
            firestore
              .collection('matches')
              .where('playerA', '==', oldPlayerRef)
              .get(),
            firestore
              .collection('matches')
              .where('playerB', '==', oldPlayerRef)
              .get(),
          ])

        for (const match of participatingMatchesPlayerA.docs) {
          await match.ref.update({ playerA: newPlayerRef })
        }

        for (const match of participatingMatchesPlayerB.docs) {
          await match.ref.update({ playerB: newPlayerRef })
        }

        await oldPlayerRef.delete()
      }

      newPlayer.claimed = true

      await newPlayerRef.set(newPlayer)
    } catch (e: any) {
      setError(e?.message)
    }

    history.push('/')
  }

  return (
    <>
      <Header />

      <section className="section">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-half">
              <div className="box">
                <LoginNav />

                <div className="field">
                  <label className="label">First Name</label>

                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={firstName}
                      onChange={(e) => setFirstname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Last Name</label>

                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={lastName}
                      onChange={(e) => setLastname(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Email</label>
                  <div className="control">
                    <input
                      type="text"
                      className="input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="field">
                  <label className="label">Password</label>
                  <div className="control">
                    <input
                      type="password"
                      className="input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                {error && (
                  <div className="field">
                    <p className="has-text-danger">{error}</p>
                  </div>
                )}

                <div className="control has-text-centered">
                  <button
                    className={classNames('button is-info is-fullwidth', {
                      'is-loading': isLoading,
                    })}
                    disabled={submitDisabled}
                    onClick={handleSubmit}
                  >
                    Sign up
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default SignUp
