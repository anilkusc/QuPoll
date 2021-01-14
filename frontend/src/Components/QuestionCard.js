
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FaceIcon from '@material-ui/icons/Face';
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import DateRangeIcon from '@material-ui/icons/DateRange';

class QuestionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.handleLikeQuestion = this.handleLikeQuestion.bind(this);
        
    }

    handleLikeQuestion() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: "{\"session\":{\"id\":"+this.props.session+"},\"id\":"+this.props.question.id+"}",
        };
        if (this.props.question.id == null || this.props.question.id == ""){
            alert("id is not defined")
            return
        }
        /*if (this.props.session == null || this.props.session == ""){
            alert("session is not defined")
            return
        }*/
        fetch('/backend/LikeQuestion', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.props.handleUpdateQuestions(data)
            })
            .catch(error => {
                console.log("Error ========>", error);
                alert("There is error while like question")
            })
    }
    render() {
        
        return (
            <div>
                <Card>
                    <CardContent>
                        <Typography variant="body2" color="textSecondary" component="p">
                            <b>{this.props.question.id}</b>
                        </Typography>
                    </CardContent>
                    <CardContent>
                            {this.props.question.question}
                    </CardContent>
                    <CardActions disableSpacing>
                        <div hidden>
                            <IconButton aria-label="add to favorites">
                                <DoneOutlineIcon color="primary" />
                               &nbsp;
                        </IconButton>
                        </div>
                        <IconButton aria-label="add to favorites">
                            <FavoriteIcon onClick={this.handleLikeQuestion} color="secondary" />
                            {this.props.question.like_count}
                          &nbsp;
                         </IconButton>
                        <FaceIcon />
                        {this.props.question.asker} &nbsp;
                        <DateRangeIcon />
                          &nbsp;
                           |{this.props.question.date}|
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default QuestionCard