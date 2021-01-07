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
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
  handleUpdateQuestions(questions) {
    this.setState({ questions: questions })
  }
  render() {
    return (
      <div>
        <br></br>
        <AskQuestion handleUpdateQuestions={this.handleUpdateQuestions}/>
        <Questions handleUpdateQuestions={this.handleUpdateQuestions} questions={this.state.questions} />
      </div>
    );
  }
}
export default Main;