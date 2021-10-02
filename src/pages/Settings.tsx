import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { Redirect, useHistory } from 'react-router-dom'
import Header from '../components/Header'
import { firestore } from '../firebase'
import { useFirestoreDoc } from '../lib/db'
import { Player } from '../types'
import { useNullableUser } from '../util'

const Settings: React.FC = () => {
  const [user, loading] = useNullableUser()
  const player = useFirestoreDoc<Player>(
    firestore.collection('players').doc(user?.uid)
  )
  const history = useHistory()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')

  const handleSave = async () => {
    const updatedPlayer: Partial<Player> = { firstName, lastName, bio }
    await firestore.collection('players').doc(user?.uid).update(updatedPlayer)
    history.push(`/players/${user?.uid}`)
  }

  useEffect(() => {
    player?.firstName && setFirstName(player?.firstName)
  }, [player])

  useEffect(() => {
    player?.lastName && setLastName(player?.lastName)
  }, [player])

  useEffect(() => {
    player?.bio && setBio(player?.bio)
  }, [player])

  if (!user && !loading) return <Redirect to="/" />

  return (
    <>
      <Header />

      <section className="section">
        <div className="container">
          <h1 className="title">Settings</h1>

          <div className="field">
            <label className="label">First Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Last Name</label>
            <div className="control">
              <input
                className="input"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <label className="label">Bio</label>
            <div className="control">
              <textarea
                className="textarea"
                placeholder="A brief description of yourself ..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>

          <div className="field">
            <div className="control">
              <button className="button is-link" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Settings
