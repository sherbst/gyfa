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
import AddMatch from './pages/AddMatch'
import Post from './pages/Post'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Logout from './pages/Logout'

const ABOUT_POST_ID = '9a1cacd4-1fb5-11ec-8b24-db1fcf7ad67e'
const RULES_POST_ID = '2d1dee2c-213b-11ec-b9e8-a3caae865c4e'

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
          <Post id={RULES_POST_ID} />
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

        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/signup">
          <SignUp />
        </Route>
        <Route exact path="/logout">
          <Logout />
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
