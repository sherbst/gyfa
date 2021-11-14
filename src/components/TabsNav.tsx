import React from 'react'
import { useLocation, Link } from 'react-router-dom'

interface TabsNavRoute {
  path: string
  title: string
}

interface Props {
  routes: TabsNavRoute[]
  title?: string
}

const TabsNav: React.FC<Props> = ({ routes, title }) => {
  const { pathname: currentPath } = useLocation()

  return (
    <>
      {title && <h1 className="title">{title}</h1>}
      <div className="tabs">
        <ul>
          {routes.map(({ path, title }) => (
            <li key={path} className={path === currentPath ? 'is-active' : ''}>
              <Link to={path}>{title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default TabsNav
