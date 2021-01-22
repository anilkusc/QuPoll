
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import FaceIcon from '@material-ui/icons/Face';
import DateRangeIcon from '@material-ui/icons/DateRange';
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CancelIcon from '@material-ui/icons/Cancel';

class ApproveQuestionCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            liked: false,
        };
        this.handleApproveQuestion = this.handleApproveQuestion.bind(this);
        this.handleIgnoreQuestion = this.handleIgnoreQuestion.bind(this);
    }
    handleApproveQuestion() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: "{\"session\":{\"id\":" + this.props.session + "},\"id\":" + this.props.question.id + "}",
        };
        if (this.props.question.id == null || this.props.question.id == "") {
            alert("id is not defined")
            return
        }
        fetch('/backend/ApproveQuestion', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.props.setQuestions(data)
            })
            .catch(error => {
                console.log("Error ========>", error);
                alert("There is error while unlike question")
            })

    }
    handleIgnoreQuestion() {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: "{\"session\":{\"id\":" + this.props.session + "},\"id\":" + this.props.question.id + "}",
        };
        if (this.props.question.id == null || this.props.question.id == "") {
            alert("id is not defined")
            return
        }
        fetch('/backend/IgnoreQuestion', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.props.setQuestions(data)
            })
            .catch(error => {
                console.log("Error ========>", error);
                alert("There is error while unlike question")
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
                    <CardContent style={{ whiteSpace: 'pre-wrap', overflowWrap: 'break-word' }}>
                        {this.props.question.question}
                    </CardContent>
                    <CardActions disableSpacing>

                        <FaceIcon />
                        {this.props.question.asker} &nbsp;
                        <DateRangeIcon />
                          &nbsp;
                           |{this.props.question.date}|
                               <IconButton aria-label="add to approved" onClick={this.handleApproveQuestion}><CheckCircleOutlineIcon color="primary" /></IconButton>
                               <IconButton aria-label="ignore" onClick={this.handleIgnoreQuestion}><CancelIcon color="secondary" />&nbsp;</IconButton>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

export default ApproveQuestionCard