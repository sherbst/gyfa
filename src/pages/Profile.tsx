import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from '../components/Header'
import { firestore } from '../firebase'
import { useFirestoreDoc } from '../lib/db'
import { Player } from '../types'
import { useNullableUser } from '../util'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

interface Params {
  uid: string
}

const Profile: React.FC = () => {
  const { uid } = useParams<Params>()
  const player = useFirestoreDoc<Player>(
    firestore.collection('players').doc(uid)
  )
  const [user] = useNullableUser()

  return (
    <>
      <Header />

      <section className="section">
        <div className="container">
          {player && (
            <>
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
            </>
          )}
        </div>
      </section>
    </>
  )
}

export default Profile
