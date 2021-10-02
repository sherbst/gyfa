import React from 'react'
import { useState } from 'react'
import { useHistory } from 'react-router-dom'
import Header from '../components/Header'
import LoginNav from '../components/LoginNav'
import { firebase } from '../firebase'

const Login: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState<null | string>(null)

  const history = useHistory()

  const loginDisabled = email === '' || password === ''

  const handleSubmit = async () => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password)
      history.push('/')
    } catch (e: any) {
      setError(e?.message)
    }
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
                    className="button is-info is-fullwidth"
                    disabled={loginDisabled}
                    onClick={handleSubmit}
                  >
                    Log in
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

export default Login
