import React from 'react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const Header: React.FC = () => {
  const [menuActive, setMenuActive] = useState(false)

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
          <div className="navbar-item">
            <div className="buttons">
              <Link to="/scores" className="button is-info">
                <strong>Scores</strong>
              </Link>
              <Link to="/scores/matches/new" className="button is-light">
                <strong>New Match</strong>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header
