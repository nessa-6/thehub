import React, { Component } from 'react'
import CloseIcon from '@material-ui/icons/Close'
import Speech from 'react-speech'
import {
  Button,
  Grid,
  Typography,
  TextField,
  FormControl,
  Icon,
  FormHelperText,
  Modal,
  Backdrop,
  Fade,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListSubheader,
} from '@material-ui/core'
import './../../static/css/flashcards.css'

var questions
var question
var quiz
var num = 0
var quiz_param = 3

export default class Flashcards extends Component {
  defaultScore = 0
  defaultAnswer = ''
  defaultQuiz = 1
  defaultText = ''
  prevAns = 0

  constructor(props) {
    super(props)
    this.state = {
      score: this.defaultScore,
      answer: this.defaultAnswer,
      question: '',
      question_num: 0,
      resOpen: false,
      expOpen: false,
      imgOpen: false,
      topic: '',
      topic_id: '',
      correct_ans: 'Correct answer',
      explanation: 'Explanation',
      tip: '',
      img: '',
      open: false,
      disabledGreen: true,
      disabledYellow: true,
      disabledRed: true,
      answerError: '',
      q: 0,
      faceValidator: 'none',
      noModify: false,
      clickArrow: true,
      disabled: true,
      redClicked: '',
      yellowClicked: '',
      greenClicked: '',
      previous: '',
      // prevAns: '',
      ans: 'hide',
      valid: false,
      // res: '',
    }

    this.handleSubmitPressed = this.handleSubmitPressed.bind(this)
    this.handleScore = this.handleScore.bind(this)
    this.handleAnswerSubmit = this.handleAnswerSubmit.bind(this)
    this.changeQuestion = this.changeQuestion.bind(this)
    this.quizNum = this.props.match.params.quizNum
    this.subject = this.props.match.params.subject
    this.topic = this.props.match.params.topic
    this.getQuestions()
  }

  changeQuestion(val, e) {
    this.setState({
      question: questions[val]['text'],
      correct_ans: questions[val]['correct_ans'],
      explanation: questions[val]['explanation'],
      tip: questions[val]['tip'],
      img: questions[val]['img'],
      q: questions[val]['id'],
      previous: questions[val]['previous'],
    })
  }

  getQuestions() {
    const auth = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + Cookies.get('token'),
      },
    }
    fetch(
      '/api/' + this.subject + '/' + this.topic + '/' + this.quizNum,
      auth
    ).then((response) => {
      if (response.ok) {
        response
          .json()
          .then((data) => data.sort(() => Math.random() - 0.5))
          .then((data) => {
            console.log(data),
              (questions = data),
              this.setState({
                question: data[this.state.question_num]['text'],
                correct_ans: data[this.state.question_num]['correct_ans'],
                explanation: data[this.state.question_num]['explanation'],
                tip: data[this.state.question_num]['tip'],
                img: data[this.state.question_num]['img'],
                q: data[this.state.question_num]['id'],
                valid: true,
              })
            let res = data.map((a) => a.id)
            const prevScore = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: 'Token ' + Cookies.get('token'),
              },
              body: JSON.stringify({
                q: res,
              }),
            }
            fetch('/api/answers', prevScore)
              .then((response) => response.json())
              .then((data) => {
                if (data['No questions found']) {
                  console.log('Quiz not answered before.')
                } else {
                  // loop through retrieved data array
                  for (var i = 0; i < data.length; i++) {
                    // filter questions by if its id equals current [i] data question id
                    var rightSet = questions.filter(function (obj) {
                      return obj.id == data[i].q
                    })[0]
                    if (rightSet !== '' && rightSet !== undefined) {
                      rightSet.previous = data[i].score
                      // adds current data score to the correct question
                    }
                  }
                  console.log('New Question Array...')
                  console.log(questions)
                  this.setState({
                    previous: questions[this.state.question_num]['previous'],
                  })
                }
              })
              .catch((error) => console.log(error))
          })
      } else if (response.status == 401) {
        this.props.history.push('/signup')
        console.log('Not logged in. Log in to access quiz.')
      } else if (response.status == 400) {
        history.go(-1)
      } else {
        response.json().then((data) => console.log(data))
      }
    })
    if (this.state.valid) {
      fetch('/api/topic' + '?quizNum=' + this.quizNum, auth).then(
        (response) => {
          if (response.ok) {
            response.json().then((data) => {
              console.log(data)
              this.setState({
                topic: data['quiz_title'],
                topic_id: data['id'],
              })
            })
          } else {
            response.json().then((data) => console.log(data))
          }
        }
      )
    }
  }

  handleAnswerSubmit(e) {
    e.preventDefault()
    this.setState({
      answerError: '',
      answer: e.target.value, // gets object called by function + gets its value
      value: e.target.value,
    })
  }

  handleScore(val, e) {
    console.log(val)
    this.setState({
      score: val,
      clickArrow: true,
      disabled: true,
      previous: '',
      faceValidator: 'none',
    })

    questions[this.state.question_num].previous = val

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Token ' + Cookies.get('token'),
      },
      body: JSON.stringify({
        answer: this.state.answer,
        score: val,
        q: this.state.q,
      }),
    }

    // get response (i.e. answer, score, question id) as json

    fetch('/api/flashcards' + '?quiz=' + this.quizNum, requestOptions)
      .then((response) => response.json())
      .then((data) => console.log(data))
  }

  handleNextCard(val, e) {
    // checks if there is another question in array

    if (questions[val]) {
      this.setState({
        open: false,
        disabled: true,
        q: 0,
        faceValidator: 'none',
        noModify: false,
        clickArrow: true,
        question_num: val,
        value: '',
        redClicked: '',
        yellowClicked: '',
        greenClicked: '',
        disabledGreen: true,
        disabledYellow: true,
        disabledRed: true,
        ans: 'hide',
      })
      this.changeQuestion(val)
      console.log('going forward to question: ' + val)

      // if no question left then show end of quiz (score?)
    } else {
      const getRes = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Token ' + Cookies.get('token'),
        },
        body: JSON.stringify({
          quiz: this.quizNum,
        }),
      }
      fetch('/api/results', getRes)
        .then((response) => response.json())
        .then((data) => {
          this.setState({
            zeroRes: data['zero'],
            oneRes: data['one'],
            twoRes: data['two'],
            res: data,
          }),
            //console.log(resSet)
            console.log('two...')
          console.log(data['two'])
          this.handleResOpen()
        })

      console.log('No luck')
    }
  }

  handlePrevCard(val, e) {
    if (questions[val]) {
      this.setState({
        open: false,
        disabled: true,
        q: 0,
        faceValidator: 'none',
        noModify: false,
        clickArrow: true,
        question_num: val,
        value: '',
        redClicked: '',
        yellowClicked: '',
        greenClicked: '',
        ans: 'hide',
      })
      this.changeQuestion(val)
      console.log('going backwards to question: ' + val)
    } else {
      console.log("Can't go back")
    }
  }

  handleSubmitPressed() {
    if (this.state.answer !== undefined && this.state.answer) {
      this.setState({
        disabled: false,
        disabledGreen: false,
        disabledYellow: false,
        disabledRed: false,
        noModify: true,
        clickArrow: false,
        faceValidator: 'block',
        ans: 'block',
        answerError: '',
      })
    } else {
      this.setState({
        answerError: 'Enter an answer.',
      })
    }
  }

  handleOpen = () => {
    this.setState({
      open: true,
    })
  }

  handleClose = () => {
    this.setState({
      open: false,
    })
  }

  handleResOpen = () => {
    this.setState({
      resOpen: true,
    })
  }

  handleResClose = () => {
    this.props.history.push('/' + this.subject + '/' + this.topic)
  }

  handleExpOpen = () => {
    this.setState({
      expOpen: true,
    })
  }

  handleExpClose = () => {
    this.setState({
      expOpen: false,
    })
  }

  handleImgOpen = () => {
    this.setState({
      imgOpen: true,
    })
  }

  handleImgClose = () => {
    this.setState({
      imgOpen: false,
    })
  }

  render() {
    return (
      <>
        {/* <Router forceRefresh={true} handleLoad></Router> */}
        <Grid container className="flashcards-main" xl={10} width="90vw">
          <Grid item className="arrow-container">
            <Button
              variant="contained"
              // to="/"
              // component={Link}
              className="arrow-wrapper"
              minwidth="40px"
              borderradius="50%"
              onClick={(e) =>
                this.handlePrevCard(this.state.question_num - 1, e)
              }
              disabled={!this.state.clickArrow}
            >
              &#60;
            </Button>
          </Grid>
          <Grid item xs={8}>
            <Grid className="question-container">
              <p className={'face-validator ' + this.state.faceValidator}>
                Select a face to self-assess before continuing.
              </p>
              <div className="upper-container">
                <div className="circles">
                  <Button
                    className={
                      'other-circles' + (this.state.img ? ' show' : ' hide')
                    }
                    disabled={false}
                    onClick={this.handleImgOpen}
                  >
                    IMG
                  </Button>
                  <Button
                    className={
                      'green ' +
                      this.state.greenClicked +
                      (this.state.previous == 2 ? ' greenprev' : '')
                    }
                    onClick={(e) => {
                      this.handleScore(2, e),
                        this.setState({ greenClicked: 'clicked' })
                    }}
                    disabled={this.state.disabled}
                  >
                    &#128512;
                  </Button>
                  <Button
                    className={
                      'yellow ' +
                      this.state.yellowClicked +
                      (this.state.previous == 1 ? ' yellowprev' : '')
                    }
                    disabled={this.state.disabled}
                    onClick={(e) => {
                      this.handleScore(1, e),
                        this.setState({ yellowClicked: 'clicked' })
                    }}
                  >
                    <p>&#128533;</p>
                  </Button>
                  <Button
                    className={
                      'red ' +
                      this.state.redClicked +
                      (this.state.previous === 0 ? ' redprev' : '')
                    }
                    disabled={this.state.disabled}
                    onClick={(e) => {
                      this.handleScore(0, e),
                        this.setState({ redClicked: 'clicked' })
                    }}
                  >
                    <p>&#128543;</p>
                  </Button>
                  <Button
                    onClick={this.handleOpen}
                    className={
                      'other-circles' + (this.state.tip ? ' show' : ' hide')
                    }
                  >
                    ?
                  </Button>
                </div>
                <div className="topic-container">{this.state.topic}</div>
              </div>
              <Grid item align="center" className="question-wrapper">
                <Typography
                  component="h5"
                  variant="h5"
                  className="question-text"
                >
                  {this.state.img ? 'Look at the image.' : null}
                  {this.state.question}
                </Typography>
              </Grid>
              <Grid item className="a">
                <Grid xs={5} item className="enter-answer-container a">
                  <FormControl className="enter-answer-wrapper">
                    <TextField
                      required={true}
                      type="text"
                      onChange={this.handleAnswerSubmit}
                      multiline
                      rowsMax={4}
                      value={this.state.value}
                      disabled={this.state.noModify}
                    />

                    <FormHelperText
                      className={
                        this.state.answerError
                          ? 'answer-error show'
                          : 'answer-error'
                      }
                    >
                      Enter Answer
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid className="enter-answer-container b" mt="auto">
                  <Button
                    variant="contained"
                    onClick={this.handleSubmitPressed}
                    className="check-answer-btn"
                    disabled={this.state.noModify}
                  >
                    Check Answer
                  </Button>
                </Grid>
              </Grid>
            </Grid>
            <Grid className={'correct-answer ' + this.state.ans}>
              <h2>
                CORRECT ANSWER:{' '}
                <Speech
                  // lang="fr-FR"
                  text={this.state.correct_ans}
                  textAsButton={true}
                  stop={true}
                  pause={true}
                  resume={true}
                  // voice="fr-FR-Standard-E"
                ></Speech>
              </h2>
            </Grid>
            <Grid>
              <div className={'explanation ' + this.state.ans}>
                {/* ONLY ACTIVATE EXPLANATION BTN IF THERE IS AN IMG IN THE EXPLANATION QUESTIONS ARRAY */}
                <Button className="explanation-btn">Explanation</Button>
                <p>{this.state.explanation}</p>
              </div>
            </Grid>
          </Grid>
          <Grid item className="arrow-container">
            <Button
              variant="contained"
              // to={"/flashcards" + "?quiz=" + quiz}
              // component={Link}
              className="arrow-wrapper"
              onClick={(e) =>
                this.handleNextCard(this.state.question_num + 1, e)
              }
              disabled={!this.state.clickArrow}
            >
              &#62;
            </Button>
          </Grid>
        </Grid>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.open}
          onClose={this.handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.open}>
            <div className="ipaper">
              <h2 id="transition-modal-title">Tips</h2>
              <p id="transition-modal-description">{this.state.tip}</p>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.resOpen}
          // onClose={this.handleResClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.resOpen}>
            <div className="ipaper">
              <div className="modal-flex">
                <h2 id="transition-modal-title">Results</h2>
                <Button
                  aria-label="close"
                  className="modal-close"
                  onClick={this.handleResClose}
                  size="small"
                >
                  Back to Quizzes
                </Button>
              </div>
              {this.state.res !== undefined && this.state.resOpen == true ? (
                <List className="list-root" subheader={<li />}>
                  <li key="section1" className="list-section">
                    <ul>
                      <ListSubheader className="modal-list-title">
                        Questions answered &#128512;
                      </ListSubheader>
                      {this.state.twoRes !== undefined &&
                      this.state.resOpen == true ? (
                        <span>
                          {this.state.twoRes.map(function (obj) {
                            return (
                              <ListItem key={`item-section1-${obj.text}`}>
                                <ListItemText primary={`${obj.text}`} />
                              </ListItem>
                            )
                          })}
                        </span>
                      ) : (
                        ''
                      )}
                    </ul>
                  </li>
                  <li key="section2" className="list-section">
                    <ul>
                      <ListSubheader className="modal-list-title">
                        Questions answered &#128533;
                      </ListSubheader>
                      {this.state.oneRes !== undefined &&
                      this.state.resOpen == true ? (
                        <span>
                          {this.state.oneRes.map(function (obj) {
                            return (
                              <ListItem key={`item-section2-${obj.text}`}>
                                <ListItemText primary={`${obj.text}`} />
                              </ListItem>
                            )
                          })}
                        </span>
                      ) : (
                        ''
                      )}
                    </ul>
                  </li>
                  <li key="section3" className="list-section">
                    <ul>
                      <ListSubheader className="modal-list-title">
                        Questions answered &#128543;
                      </ListSubheader>
                      {this.state.zeroRes !== undefined &&
                      this.state.resOpen == true ? (
                        <span>
                          {this.state.zeroRes.map(function (obj) {
                            return (
                              <ListItem key={`item-section3-${obj.text}`}>
                                <ListItemText primary={`${obj.text}`} />
                              </ListItem>
                            )
                          })}
                        </span>
                      ) : null}
                    </ul>
                  </li>
                </List>
              ) : null}
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.expOpen}
          onClose={this.handleExpClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.expOpen}>
            <div className="paper">
              <h2 id="transition-modal-title">Explanation</h2>
            </div>
          </Fade>
        </Modal>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className="modal"
          open={this.state.imgOpen}
          onClose={this.handleImgClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={this.state.imgOpen}>
            <div className="img-paper">
              <img src={this.state.img} className="modal-img" />
            </div>
          </Fade>
        </Modal>
      </>
    )
  }
}
