import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Container from '@material-ui/core/Container';
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from '@material-ui/core/TextField';

class AskQuestion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            asker: "",
            question: "",
        }
        this.handleChangeAsker = this.handleChangeAsker.bind(this);
        this.handleChangeQuestion = this.handleChangeQuestion.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChangeAsker(event) {
        this.setState({ asker: event.target.value });
    }
    handleChangeQuestion(event) {
        this.setState({ question: event.target.value });
    }
    handleSubmit(event) {
        event.preventDefault();
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: "{\"session\":{\"id\":"+this.props.session+"},\"asker\":\""+ this.state.asker +"\",\"question\":\""+this.state.question+"\"}",
        };
        fetch('/backend/AskQuestion', requestOptions)
            .then(response => response.json())
            .then(data => {
                this.props.handleUpdateQuestions(data)
            })
            .catch(error => {
                console.log("Error ========>", error);
                alert("There is error while asking question")
              })
    }
    render() {
        return (
            <div>
                <Container component="main">
                    <Card>
                        <CardContent>
                            <Typography variant="body2" component="p">
                                <TextField id="standard-basic" label="Username" style={{ margin: 8 }}  onChange={this.handleChangeAsker}/>
                                <TextField
                                    id="standard-full-width"
                                    style={{ margin: 8 }}
                                    placeholder="Ask a Question..."
                                    fullWidth
                                    margin="normal"
                                    onChange={this.handleChangeQuestion}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={this.handleSubmit}>Ask Question</Button>
                        </CardActions>
                    </Card><br></br><br></br>

                </Container>
            </div>
        );
    }
}

export default AskQuestion