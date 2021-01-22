
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FaceIcon from '@material-ui/icons/Face';
import SwapHorizIcon from '@material-ui/icons/SwapHoriz';
import DateRangeIcon from '@material-ui/icons/DateRange';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

class QuestionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
            isButtonDisabled: false
        };
        this.handleLikeQuestion = this.handleLikeQuestion.bind(this);
        this.handleAnswerQuestion = this.handleAnswerQuestion.bind(this);

    }

    handleLikeQuestion() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: "{\"session\":{\"id\":" + this.props.session + "},\"id\":" + this.props.question.id + "}",
        };
        if (this.props.question.id == null || this.props.question.id == "") {
            alert("id is not defined")
            return
        }
        if (this.state.liked) {
            fetch('/backend/UnlikeQuestion', requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({ liked: !this.state.liked })
                    this.props.handleUpdateQuestions(data)
                })
                .catch(error => {
                    console.log("Error ========>", error);
                    alert("There is error while unlike question")
                })
        } else {
            fetch('/backend/LikeQuestion', requestOptions)
                .then(response => response.json())
                .then(data => {
                    this.setState({ liked: !this.state.liked })
                    this.props.handleUpdateQuestions(data)
                })
                .catch(error => {
                    console.log("Error ========>", error);
                    alert("There is error while like question")
                })
        }
        setTimeout(() => this.setState({ isButtonDisabled: false }), 2000);
        this.setState({ isButtonDisabled: true })

    }
    handleAnswerQuestion() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: "{\"session\":{\"id\":" + this.props.session + "},\"id\":" + this.props.question.id + "}",
        };
        if (this.props.question.id == null || this.props.question.id == "") {
            alert("id is not defined")
            return
        }

        fetch('/backend/AnswerQuestion', requestOptions)
            .then(response => response.json())
            .then(data => {

                this.props.handleUpdateQuestions(data)
            })
            .catch(error => {
                console.log("Error ========>", error);
                alert("There is error while answer question")
            })
    }
    render() {
        var answered
        var like
        if (this.props.authenticated) {
            answered = <IconButton disabled={this.state.isButtonDisabled} aria-label="add to favorites" onClick={this.handleAnswerQuestion} > <SwapHorizIcon  color="primary" /></IconButton>
        }
        if (this.state.liked) {
            like = <IconButton disabled={this.state.isButtonDisabled} aria-label="add to favorites" onClick={this.handleLikeQuestion}><FavoriteIcon  color="secondary" />{this.props.question.like_count}&nbsp;</IconButton>
        } else {
            like = <IconButton disabled={this.state.isButtonDisabled} aria-label="add to favorites" onClick={this.handleLikeQuestion}><FavoriteBorderIcon  color="secondary" />{this.props.question.like_count}&nbsp;</IconButton>
        }

        return (
            <div>
                <Card>
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <b>{this.props.question.id}</b>
                        </Typography>
                    </CardContent>
                    <CardContent  style={{whiteSpace: 'pre-wrap', overflowWrap: 'break-word'}}>
                        {this.props.question.question}
                    </CardContent>
                    <CardActions disableSpacing>
                        {like}
                        <FaceIcon />
                        {this.props.question.asker} &nbsp;
                        <DateRangeIcon />
                          &nbsp;
                           |{this.props.question.date}|
                           &nbsp;
                           <IconButton >
                            {answered}
                        </IconButton>
                               &nbsp;
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default QuestionCard