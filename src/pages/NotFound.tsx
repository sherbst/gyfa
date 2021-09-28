import React from 'react'
import Header from '../components/Header'

const NotFound: React.FC = () => {
  return (
    <>
      <Header />
      <section className="section">
        <h1 className="title">404</h1>
        <h2 className="subtitle">Page Not Found</h2>
      </section>
    </>
  )
}

export default NotFound
