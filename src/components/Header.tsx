import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { faCog, faPlusSquare, faUser } from '@fortawesome/free-solid-svg-icons'
import { useEffect } from 'react'
import { firebase } from '../firebase'
import { useNullableUser } from '../util'

const Header: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false)
  const [user, userLoading] = useNullableUser()

  return (
    <nav className="navbar" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item has-text-primary" href="/">
          <img src="/logo-full.png" />
        </a>

        <a
          role="button"
          className="navbar-burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          onClick={() => setMenuActive(!menuActive)}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        className={menuActive ? 'navbar-menu is-active' : 'navbar-menu'}
      >
        <div className="navbar-start">
          <Link to="/" className="navbar-item has-text-info">
            Home
          </Link>

          <Link to="/about" className="navbar-item has-text-info">
            About
          </Link>

          <Link to="/rules" className="navbar-item has-text-info">
            Rules
          </Link>
        </div>

        <div className="navbar-end">
          {user ? (
            <div className="navbar-item has-dropdown is-hoverable">
              <Link to="/" className="navbar-link">
                <span className="icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                <span>Sawyer Herbst</span>
              </Link>

              <div className="navbar-dropdown">
                <Link to="/logout" className="navbar-item">
                  <span className="icon">
                    <FontAwesomeIcon icon={faUser} />
                  </span>
                  <span>My Profile</span>
                </Link>

                <Link to="/logout" className="navbar-item">
                  <span className="icon">
                    <FontAwesomeIcon icon={faPlusSquare} />
                  </span>
                  <span>Add Match</span>
                </Link>

                <Link to="/logout" className="navbar-item">
                  <span className="icon">
                    <FontAwesomeIcon icon={faCog} />
                  </span>
                  <span>Settings</span>
                </Link>

                <hr className="navbar-divider" />

                <Link to="/logout" className="navbar-item">
                  <span className="icon">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                  </span>
                  <span>Log Out</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="navbar-item">
              <div className="buttons">
                <Link to="/login" className="button is-info">
                  Log in
                </Link>
                <Link to="/signup" className="button is-light">
                  Sign up
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Header
