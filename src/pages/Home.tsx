import React from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'
import News from '../containers/News'
import TodaysStats from '../containers/TodaysStats'

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <section className="hero is-info is-large has-background">
        <img
          src="/images/players-close-up.jpg"
          className="hero-background is-translucent"
        />
        <div className="hero-body">
          <h1 className="title is-size-1">
            Greater Yahara Foosball Association
          </h1>
          <Link className="button is-light" to="/scores">
            View Scores
          </Link>
        </div>
      </section>

      <section className="section">
        <h1 className="title">Today's Stats</h1>
        <div className="box">
          <TodaysStats />
        </div>
      </section>

      <section className="section">
        <h1 className="title">News</h1>
        <News />
      </section>
    </>
  )
}

export default Home
