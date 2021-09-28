import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import React from 'react'
import Home from './pages/Home'
import ScoresPlayers from './pages/ScoresPlayers'
import ScoresMatches from './pages/ScoresMatches'
import NotFound from './pages/NotFound'
import Rules from './pages/Rules'
import AddMatch from './pages/AddMatch'
import Post from './pages/Post'

const ABOUT_POST_ID = '9a1cacd4-1fb5-11ec-8b24-db1fcf7ad67e'

const App: React.FC = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/about">
          <Post id={ABOUT_POST_ID} />
        </Route>
        <Route exact path="/rules">
          <Rules />
        </Route>
        <Route exact path="/posts/:id">
          <Post />
        </Route>

        <Route exact path="/scores">
          <Redirect to="/scores/players" />
        </Route>
        <Route exact path="/scores/players">
          <ScoresPlayers />
        </Route>
        <Route exact path="/scores/matches">
          <ScoresMatches />
        </Route>
        <Route exact path="/scores/matches/new">
          <AddMatch />
        </Route>

        {/* 404 */}
        <Route path="/">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
