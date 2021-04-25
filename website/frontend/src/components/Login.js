import React, { Component } from 'react'
import './../../static/css/register.css'
import ReactDOM from 'react-dom'
import {
  Avatar,
  Button,
  TextField,
  FormControlLabel,
  FormControl,
  Icon,
  FormHelperText,
  Checkbox,
  Link,
  Paper,
  Box,
  Grid,
  Typography,
  makeStyles,
} from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'

const Elem = () => {
  return (
    <>
      <Link to="/profile" className="li">
        {Cookies.get('username') !== undefined
          ? Cookies.get('username')
          : 'LOGIN/SIGNUP'}
      </Link>
    </>
  )
}

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      usernameError: '',
      passwordError: '',
      token: '',
    }

    // this.submitPressed = this.submitPressed.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleLogin = this.handleLogin.bind(this)
    this.loggedIn()


    ReactDOM.render(<Elem />, document.getElementById('login-signup'))
  }

  //   submitPressed(e) {
  //     e.preventDefault()
  //     this.setState({
  //       user: e.target.value, // gets object called by function + gets its value
  //     })
  //   }

  handleUsername(e) {
    e.preventDefault()
    this.setState({ username: e.target.value })
  }

  handlePassword(e) {
    e.preventDefault()
    this.setState({ password: e.target.value })
  }

  handleLogin() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // csrfmiddlewaretoken: csrf_token,
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    }
    fetch('/auth/token/login', requestOptions)
      .then((response) => {
        this.setState({
          usernameError: '',
          passwordError: '',
        })
        if (response.status == 400) {
          response.json().then((data) => {
            console.log(data)
            if (data['username']) {
              this.setState({
                usernameError: data['username'],
              })
            }
            if (data['password']) {
              this.setState({
                passwordError: data['password'],
              })
            }
            if (data['non_field_errors']) {
              this.setState({
                passwordError: 'Username or password is incorrect.',
              })
            }
          })
        } else {
          response.json().then((data) => {
            Cookies.set('token', data['auth_token'])
            this.props.history.push('/profile')
            ReactDOM.render(<Elem />, document.getElementById('login-signup'))
          })
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  loggedIn() {
    if (Cookies.get('token')) {
      console.log('Already logged in!') // CHANGE TO A FLASH [?]
      this.props.history.push('/profile')
    }
  }

  render() {
    return (
      <>
        <Grid container className="reg-main">
          <div className="img" />
          <div className="login-paper-container">
            <div className="paper">
              <Avatar className="avatar">
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Sign In
              </Typography>
              <form className="form" noValidate={false}>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="current-username"
                  autoFocus
                  onChange={this.handleUsername}
                />
                <p>{this.state.usernameError}</p>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={this.handlePassword}
                />
                <p>{this.state.passwordError}</p>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="submit"
                  onClick={this.handleLogin}
                >
                  Sign In
                </Button>
                <Grid container className="reg-links-container">
                  <Grid item xs>
                    <Link href="#" variant="body2" className="reg-links">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href="/signup"
                      onClick={this.preventDefault}
                      className="reg-links"
                      variant="body2"
                    >
                      "Don't have an account? Sign Up"
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </div>
        </Grid>
      </>
    )
  }
}
