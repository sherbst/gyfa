import React from 'react'
import TabsNav from './TabsNav'

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
  return <TabsNav routes={ROUTES} title="Scores" />
}

export default ScoresNav
