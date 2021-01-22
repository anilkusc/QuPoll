import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import ApproveQuestionCard from '../Components/ApproveQuestionCard';

const useStyles = theme => ({
  modal: {
    top: `49%`,
    left: `51%`,
    transform: `translate(-49%, -51%)`,
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  }
});

class Approve extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
      session: null,
    }
    this.setQuestions = this.setQuestions.bind(this);
  }

  setQuestions(new_questions) {
    this.setState({ questions: new_questions })
  }

  setSession() {
    var session = this.props.session
    if (session == null) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      };
      fetch('/backend/CurrentSession', requestOptions)
        .then((response) => response.text())
        .then((data) => {
          debugger;
          if (data == "-1") {
            var getSession = prompt("Please enter session id", "1");
            if (getSession != null && getSession != "" && getSession > -1) {
              this.setState({ session: getSession })
              session = getSession
            } else {
              alert("Invalid Session Id!")
              return
            }
          } else {
            this.setState({ session: data })
            session = data
          }
        }).then((temp) => {
          const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: "{\"id\":" + session + "}"
          };
          fetch('/backend/ChangeSession', requestOptions)
            .then(response => response.json())
            .then(data => {
              if (data.id != null) {
                this.props.handleChangeSession(data.id)
              } else {
                alert("Error While Setting Session")
              }
            })
            .catch(error => {
              console.log("Error ========>", error);
              alert("Error While Setting Session")
            })
        }
        );
    }
    return session
  }

  componentDidMount() {

    var session = this.setSession()
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{\"id\":" + session + "}"
    };

    fetch('/backend/GetQuestions', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          this.setState({ questions: data })
        } else {
          alert("There is no question on this session ")
        }
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("There is error while fetching questions")
      })

  }
  componentDidUpdate(prevProps) {
    if (this.state.questions !== prevProps.questions) {
      var session = this.setSession()
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: "{\"id\":" + session + "}"
      };
      fetch('/backend/GetQuestions', requestOptions)
        .then((response) => response.json())
        .then((data) => {

          if (data != null) {
            this.setState({ questions: data })
          } else {
            this.setState({ questions: [] })
            alert("There is no question on this session ")
          }
        })
        .catch(error => {
          console.log("Error ========>", error);
          alert("There is error while fetching questions")
        })
    }
  }
  render() {
    const { classes } = this.props;
    const checkQuestions = true;
    if (this.state.questions != null && this.state.questions != "") {
      const checkQuestions = true;
    } else {
      const checkQuestions = false;
    }
    return (
      <div>
        <br></br>
        <br></br>
        <Container component="main">
          <Grid container justify="center" spacing={12} >
            <Grid item md={6}>
              <Card>
                <CardHeader
                  title={"Waiting For Approve"}
                  className={classes.cardHeader}
                />
                <CardContent>
                  {checkQuestions ? (
                    this.state.questions.sort((a, b) => a.like_count > b.like_count ? -1 : 1).map(question => {
                      if (question.approved == 0) {
                        return (
                          <ul key={question.id}>
                            <ApproveQuestionCard session={this.state.session} setQuestions={this.setQuestions} question={question} />
                          </ul>)
                      }
                    })
                  ) : (
                      <div>There is no questions</div>
                    )

                  }
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </div>
    );
  }
}
export default withStyles(useStyles)(Approve);