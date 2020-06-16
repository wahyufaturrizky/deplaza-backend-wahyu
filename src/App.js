import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import { ProtectedRoute } from "./route/protectedRoute";
import Home from './pages/Home'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Category from './pages/Category'

export default function App() {
  return (
    <Router>
      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <ProtectedRoute exact path="/home" component={Home} />
        <ProtectedRoute exact path="/category" component={Category} />
        <Route path="*" component={() => "404 NOT FOUND"} />
      </Switch>

    </Router>
  );
}