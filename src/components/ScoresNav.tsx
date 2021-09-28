import React from 'react'
import { useLocation, Link } from 'react-router-dom'

const ROUTES = [
  {
    path: '/scores/players',
    title: 'Players',
  },
  {
    path: '/scores/matches',
    title: 'Matches',
  },
]

const ScoresNav: React.FC = () => {
  const { pathname: currentPath } = useLocation()

  return (
    <>
      <h1 className="title">Scores</h1>
      <div className="tabs">
        <ul>
          {ROUTES.map(({ path, title }) => (
            <li key={path} className={path === currentPath ? 'is-active' : ''}>
              <Link to={path}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default ScoresNav
