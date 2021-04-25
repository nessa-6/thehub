import React, { Component } from 'react'
import { Fragment } from 'react'
import {
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemLink,
  Typography,
  Box,
} from '@material-ui/core'
import './../../static/css/home.css'

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <>
        <p>This is the home page.</p>
      </>
    )
  }
}
