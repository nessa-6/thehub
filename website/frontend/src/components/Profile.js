import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Fragment } from 'react'
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemLink,
  Typography,
  Link,
  Box,
} from '@material-ui/core'
import './../../static/css/profile.css'

export default class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      element: 'user',
      username: '',
    }

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

    ReactDOM.render(<Elem />, document.getElementById('login-signup'))

    this.handleLogout = this.handleLogout.bind(this)
    this.handleUser()
    
  }

  handleUser() {
    const sendToken = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + Cookies.get('token'),
      },
    }
    fetch('auth/users/me/', sendToken).then((response) => {
      if (response.status == 401) {
        history.go(-1)
      } else {
        response.json().then((data) => {
          if (Cookies.get('token') == false || Cookies.get('token') == '') {
            console.log('redirecting to login page...')
            this.props.history.push('/login')
          } else {
            console.log('Successful login')
            console.log(data)
            this.setState({
              username: data['username'],
            })
            Cookies.set('username', data['username'])
          }
        })
      }
    })
  }

  handleLogout() {
    const deleteToken = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + Cookies.get('token'),
      },
    }
    fetch('auth/token/logout/', deleteToken).then((response) => {
      if (response.status == 204) {
        console.log('yes')
        this.props.history.push('/login')
      } else {
        response.json()
      }
    })
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
  }

  render() {
    // username = this.state.username

    return (
      <>
        <Typography>Welcome, {this.state.username}.</Typography>
        <Button
          variant="contained"
          color="primary"
          className="submit"
          onClick={this.handleLogout}
        >
          Logout
        </Button>
      </>
    )
  }
}

// CHANGE SO COOKIES AREN'T USED PLZZZZ

const Elem = () => {
  return (
    <>
      <Link to="/profile" className="li">
        {Cookies.get('username') !== undefined ? Cookies.get('username') : 'LOGIN/SIGNUP'}
      </Link>
    </>
  )
}

ReactDOM.render(<Elem />, document.getElementById('login-signup'))


// .\env\Scripts\activate.bat