import React from 'react'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { firebase } from '../firebase'

const Logout: React.FC = () => {
  const history = useHistory()

  useEffect(() => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        history.push('/login')
      })
  }, [])

  return <p>Logging out...</p>
}

export default Logout
