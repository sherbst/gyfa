import React from 'react'
import TabsNav from './TabsNav'

const ROUTES = [
  {
    path: '/admin/posts',
    title: 'Posts',
  },
]

const AdminNav: React.FC = () => {
  return <TabsNav routes={ROUTES} title="Admin" />
}

export default AdminNav
