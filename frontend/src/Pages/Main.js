import React from 'react';
import AskQuestion from "../Components/AskQuestion";
import Questions from "../Components/Questions";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      questions: [],
    }
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
          alert("There is error while fetching questions")
        }
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("There is error while fetching questions")
      })
  }
  render() {
    return (
      <div>
        <br></br>
        <AskQuestion />
        <Questions questions={this.state.questions} />
      </div>
    );
  }
}
export default Main;