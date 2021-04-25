import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
} from 'react-router-dom'
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
import './../../static/css/topics.css'

// const sendQuizzes = (subject, topic, e) => {
//   var requestOptions = {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: 'Token ' + Cookies.get('token'),
//     },
//   }
//   fetch('/api/' + subject['subject'] + '/' + topic, requestOptions)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data)
//       props.history.push('/' + subject['subject'] + '/' + topic)
//     })
//     .catch((error) => {
//       console.log(error)
//     })
// }

export default class Topic extends Component {
  constructor(props) {
    super(props)
    this.state = {valid: false}

    // this.getParam = this.getParam.bind(this)
    this.subject = this.props.match.params.subject
    this.handleTopics()

    if (this.state.valid) {
      this.sendQuizzes = this.sendQuizzes.bind(this)
    }
    
  }

  //   getParam = () => {
  //     // const { subject } = useParams()
  //     console.log(this.props.match.params.subject)
  //   }

  handleTopics = (val, e) => {
    const sendToken = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Authorization: 'Token ' + Cookies.get('token'),
      },
    }
    fetch('api/' + this.subject, sendToken).then((response) => {
      if (response.status == 400) {
        history.go(-1)
        console.log(response)
      } else {
        this.setState({ valid: true })
        response.json().then((data) => {
          console.log(data)
          this.setState({
            listOf: data,
            subject: this.subject,
          })
        })
      }
    })
    .catch((error) => console.log(error))
  }

  sendQuizzes = (subject, topic, e) => {
    this.props.history.push('/' + subject + '/' + topic.toLowerCase())
    // const requestOptions = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     Authorization: 'Token ' + Cookies.get('token'),
    //   },
    // }
    // fetch('/api/' + subject + '/' + topic, requestOptions)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data)
    //     //
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   })
  }

  render() {
    // this.getParam()
    return (
      <>
        <Box padding="30px">
          <Typography align="center" className="topic-text" variant="h3">
            {this.state.valid ? this.subject : null}
          </Typography>
          <List>
            {this.state.listOf && this.subject !== undefined
              ? this.state.listOf.map((item) => {
                  return (
                    <ListItem
                      button
                      key={`${this.subject}-${item.topic}`}
                      onClick={() => {
                        this.sendQuizzes(this.subject, item.topic)
                      }}
                    >
                      <ListItemText>
                        {item.topic.replaceAll('_', ' ')} Quizzes
                      </ListItemText>
                    </ListItem>
                  )
                })
              : null}
          </List>
        </Box>
      </>
    )
  }
}
