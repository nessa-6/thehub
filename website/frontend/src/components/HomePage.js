import React, { Component } from "react";
import Flashcards from "./Flashcards";
import Quizzes from "./Quizzes";
import Register from "./Register";
import ReactDOM from 'react-dom'
import Login from './Login';
import Profile from './Profile';
import Topics from './Topics';
import Home from './Home';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

export default class HomePage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          {/* <Route
            exact
            path="/flashcards"
            render={(props) => <Flashcards {...props} />}
            component={Flashcards}
          /> */}
          <Route
            path="/:subject/:topic/flashcards/:quizNum"
            component={Flashcards}
          />
          <Route path="/:subject/:topic" component={Quizzes} />
          <Route path="/signup" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
          <Route path="/:subject" component={Topics} />
        </Switch>
      </Router>
    )
  }
}

const Elem = () => {
  return (
    <>
      {Cookies.get('username') ? (
        <a href="/profile" className="li">
          {Cookies.get('username')}
        </a>
      ) : (
        <a href="/signup" className="li">
          LOGIN/SIGNUP
        </a>
      )}
    </>
  )
}

ReactDOM.render(<Elem />, document.getElementById('login-signup'))