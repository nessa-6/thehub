import React, { Component } from 'react'
import './../../static/css/register.css'
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

export default class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      register: false,
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailError: '',
      usernameError: '',
      passwordError: '',
      confirmPasswordError: '',
    }

    // this.submitPressed = this.submitPressed.bind(this)
    this.handleUsername = this.handleUsername.bind(this)
    this.handleEmail = this.handleEmail.bind(this)
    this.handlePassword = this.handlePassword.bind(this)
    this.handleConfirmPassword = this.handleConfirmPassword.bind(this)
    this.handleRegister = this.handleRegister.bind(this)
    this.loggedIn()
  }

  //   submitPressed(e) {
  //     e.preventDefault()
  //     this.setState({
  //       user: e.target.value, // gets object called by function + gets its value
  //     })
  //   }

  loggedIn() {
    if (Cookies.get('token')) {
      console.log('Already logged in!') // CHANGE TO A FLASH [?]
      this.props.history.push('/profile')
    }
  }

  handleUsername(e) {
    e.preventDefault()
    this.setState({ username: e.target.value })
  }

  handleEmail(e) {
    e.preventDefault()
    var errorText = '' // ??
    this.setState({ email: e.target.value })
  }

  handlePassword(e) {
    e.preventDefault()
    this.setState({ password: e.target.value })
  }

  handleConfirmPassword(e) {
    e.preventDefault()
    this.setState({
      confirmPassword: e.target.value,
    })
  }

  handleSignUp() {
    this.setState({ register: true })
    this.props.history.push('/flashcards/')
  }

  handleRegister() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Token ' + Cookies.get('token'),
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        re_password: this.state.confirmPassword,
      }),
    }
    fetch('/auth/users/', requestOptions)
      .then((response) => {
        this.setState({
          emailError: '',
          usernameError: '',
          passwordError: '',
          confirmPasswordError: '',
        })
        if (response.ok) {
          // LOGIN
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
            .then((response) => response.json())
            .then((data) => {
              Cookies.set('token', data['auth_token'])
              this.props.history.push('/profile')
            })
        } else {
          response.json().then((data) => {
            if (data['email']) {
              this.setState({
                emailError: data['email'],
              })
            }
            if (data['username']) {
              this.setState({
                usernameError: data['username'],
              })
            }
            if (data['re_password']) {
              this.setState({
                confirmPasswordError: data['re_password'],
              })
            }
            if (data['password']) {
              this.setState({
                passwordError: data['password'],
              })
            }
          })
        }
      })

      .catch((e) => {
        console.log(e)
      })
  }

  render() {
    return (
      <>
        <Grid container className="reg-main">
          <div className="img" />
          <div className="paper-container">
            <div className="paper">
              <Avatar className="avatar">
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                {this.state.register ? 'Sign up' : 'Sign in'}
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
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  onChange={this.handleEmail}
                />
                <p>{this.state.emailError}</p>
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Confirm Password"
                  type="password"
                  id="confirm-password"
                  autoComplete="current-password"
                  onChange={this.handleConfirmPassword}
                />
                <p>{this.state.confirmPasswordError}</p>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  className="submit"
                  onClick={this.handleRegister}
                >
                  Register
                </Button>
                <Grid container className="reg-links-container">
                  <Grid item xs>
                    <Link href="#" variant="body2" className="reg-links">
                      Forgot password?
                    </Link>
                  </Grid>
                  <Grid item>
                    <Link
                      href="/login"
                      onClick={this.preventDefault}
                      className="reg-links"
                      variant="body2"
                    >
                      'Already have an account? Log In'
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
