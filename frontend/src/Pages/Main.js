import React from 'react';
import AskQuestion from "../Components/AskQuestion";
import Questions from "../Components/Questions";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
    }
    this.handleUpdateQuestions = this.handleUpdateQuestions.bind(this);
  }
  componentDidMount() {
    var session = this.props.session
    if (session == null) {
      var getSession = prompt("Please enter session id", "1");
      if (getSession != null && getSession != "" && getSession > -1) {
        session = getSession
      } else {
        alert("Invalid Session Id!")
        return
      }
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{\"id\":" + session + "}"
    };
    fetch('/backend/GetQuestions', requestOptions)
      .then((response) => response.json())
      .then((data) => {
        if (data != null) {
          this.setState({questions:data})
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
    if (this.props.session !== prevProps.session) {
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: "{\"id\":" + this.props.session + "}"
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
  handleUpdateQuestions(questions) {
    this.setState({ questions: questions })
  }
  render() {
    return (
      <div>
        <br></br>
        <AskQuestion session={this.props.session} handleUpdateQuestions={this.handleUpdateQuestions} />
        <Questions authenticated={this.props.authenticated} session={this.props.session} handleUpdateQuestions={this.handleUpdateQuestions} questions={this.state.questions} />
      </div>
    );
  }
}
export default Main;