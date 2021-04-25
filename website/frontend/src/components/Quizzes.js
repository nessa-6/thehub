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
  Paper,
  Box,
} from '@material-ui/core'
import Carousel from 'react-material-ui-carousel'
import { makeStyles } from '@material-ui/core/styles'
import Rating from '@material-ui/lab/Rating'
import './../../static/css/quizzes.css'

export default class Quizzes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      quizzes: '',
      valid: false,
      hover: 0,
      value: 0,
      showOptions: false,
      itemId: '',
    }

    this.subject = this.props.match.params.subject
    this.topic = this.props.match.params.topic
    this.handleQuestion = this.handleQuestion.bind(this)
    this.handleCarousel = this.handleCarousel.bind(this)
    this.renderElement = this.renderElement.bind(this)
    this.displayOptions = this.displayOptions.bind(this)
    this.getQuizzes()
    this.labels = {
      1: 'Useless',
      2: 'Ok',
      3: 'Excellent',
    }

    // this.useStyles = makeStyles({
    //     root: {
    //       width: 200,
    //       display: 'flex',
    //       alignItems: 'center',
    //     },
    //   })
    // this.classes = this.useStyles()
  }

  getQuizzes() {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
    fetch('/api/' + this.subject + '/' + this.topic, requestOptions)
      .then((response) => {
        if (response.status == 400) {
          history.go(-1), console.log('Invalid Param')
        } else {
          response.json().then((data) => {
            console.log(data)
            this.setState({
              quizzes: data,
              valid: true,
            })

          })
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }

  handleQuestion = (subject, topic, quizNum, e) => {
    this.props.history.push(
      '/' + subject + '/' + topic.toLowerCase() + '/flashcards/' + quizNum
    )
  }

  // setValue(v, e) {
  //   this.setState({
  //     value: v,
  //   })
  //   return v
  // }

  // setHover(v, e) {
  //   this.setState({
  //     hover: v,
  //   })
  // }

  renderElement = () => {
    if (
      this.state.quizzes !== '' &&
      this.subject !== undefined &&
      this.topic !== undefined &&
      this.state.valid
    ) {
      return (
        <List className="quiz-list">
          {this.state.quizzes.map((item) => (
            <ListItem
              button
              key={`${this.topic}-${item.quiz_title}`}
              onClick={(e) => this.displayOptions(e, item.id)}
              // onClick={() => {
              //   this.handleQuestion(
              //     this.subject,
              //     this.topic,
              //     item.id // CHANGE TO ITEM.ID (INCASE ARRAY ORDER IS NOT SAME AS ID)
              //   )
              // }}
            >
              <ListItemText key={`${this.topic}-${item.quiz_title}`}>
                {item.quiz_title} Quiz
              </ListItemText>
            </ListItem>
          ))}
        </List>
      )
    } else {
      return null
    }
  }
 

  handleCarousel = () => {
    var items = [
      {
        name: 'Flashcards',
        title: 'Select type of quiz',
      },
      {
        name: 'Cloze',
        title: 'Select type of quiz',
      },
      {
        name: 'Terms',
        title: 'Select type of quiz',
      },
    ]

    return (
      <Carousel
        NextIcon={'>'}
        PrevIcon={`<`}
        navButtonsProps={{
          style: {
            width: 10,
            height: 10,
            fontSize: 20,
          },
        }}
        navButtonsWrapperProps={{
          style: {
            bottom: '0',
            top: 'unset',
          },
        }}
        autoPlay={false}
        animation={'slide'}
        navButtonsAlwaysInvisible={true}
      >
        {items.map((item, i) => (
          <div key={i} style={{ padding: 20 }}>
            <p style={{ margin: 0, fontSize: 12, textAlign: 'center' }}>
              {item.title}
            </p>
            <h2 style={{ paddingLeft: 7 }}>{item.name}</h2>

            <Button
              onClick={() => {
                this.handleQuestion(
                  this.subject,
                  this.topic,
                  this.state.itemId // CHANGE TO ITEM.ID (INCASE ARRAY ORDER IS NOT SAME AS ID)
                )
              }}
              className="CheckButton"
            >
              Start
            </Button>
          </div>
        ))}
      </Carousel>
    )
  }

  displayOptions = (e, val) => {
    this.setState({
      showOptions: true,
      itemId: val,
    })
  }
  render() {
    return (
      <>
        <Box padding="30px">
          <Typography align="center" className="topic-text" variant="h3">
            {this.state.valid ? this.topic.replaceAll('_', ' ') : null}
          </Typography>
          <div className="elems">
            {this.renderElement()}
            {this.state.showOptions ? (
              <div className="type-box">{this.handleCarousel()}</div>
            ) : null}
          </div>
          {this.state.quizzes !== '' && this.state.dict !== undefined ? (
            <div>{this.handleRating()}</div>
          ) : null}
        </Box>
      </>
    )
  }
}

// console.log(this.state.quizNum)

// {this.state.quizzes !== '' &&
//             this.subject !== undefined &&
//             this.topic !== undefined &&
//             this.state.valid ? return (this.state.quizzes.map((item) => {
//                     <List>
//                     <ListItem
//                       button
//                       key={`${this.topic}-${item.quiz_title}`}
//                       onClick={() => {
//                         this.handleQuestion(
//                           this.subject,
//                           this.topic,
//                           item.id // CHANGE TO ITEM.ID (INCASE ARRAY ORDER IS NOT SAME AS ID)
//                         )
//                       }}
//                     >
//                       <ListItemText>{item.quiz_title} Quiz</ListItemText>
//                       <div
//                         className="rating"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <Rating
//                           name="hover-feedback"
//                           value={this.state.value}
//                           precision={1}
//                           max={3}
//                           onChange={(e, newValue) => {
//                             this.setValue(newValue)
//                           }}
//                           onChangeActive={(e, newHover) => {
//                             this.setHover(newHover)
//                           }}
//                         />
//                         {this.state.value !== null && (
//                           <Box ml={2}>
//                             {
//                               this.labels[
//                                 this.state.hover !== -1
//                                   ? this.state.hover
//                                   : this.state.value
//                               ]
//                             }
//                           </Box>
//                         )}
//                       </div>
//                     </ListItem>
//                     </List>
//                           )))
//               : null}
