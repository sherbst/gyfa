import React from 'react'
import TabsNav from './TabsNav'

const ROUTES = [
  {
    path: '/login',
    title: 'Log in',
  },
  {
    path: '/signup',
    title: 'Sign Up',
  },
]

const LoginNav: React.FC = () => {
  return <TabsNav routes={ROUTES} />
}

export default LoginNav
