import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'

export default function App() {
  return (
    <Router>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/register">
            <Register />
          </Route>
          <Route exact path="/">
            <Login />
          </Route>
        </Switch>
      
    </Router>
  );
}


function About() {
  return <h2>About</h2>;
}

function Users() {
  return <h2>Users</h2>;
}