
import React from "react";
import QuestionCard from "./QuestionCard";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { withStyles } from "@material-ui/core/styles";

const useStyles = theme => ({
    cardHeader: {
        backgroundColor:
            theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[700],
    },
});

class Questions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ss:this.props.session,
        };
        
    }

    render() {
        const { classes } = this.props;
        
        return (
            <div key={this.props.session}>
                <Container component="main">
                    <Grid container justify="center" spacing={12} >
                        <Grid item md={6}>
                            <Card>
                                <CardHeader
                                    title={"Waiting For Answer"}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    {this.props.questions.sort((a, b) => a.like_count > b.like_count ? -1 : 1).map(question =>
                                        <ul key={question.id}>                                           
                                            <QuestionCard session={this.props.session} handleUpdateQuestions={this.props.handleUpdateQuestions} question={question}/>
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item md={6}>
                            <Card>
                                <CardHeader
                                    title={"Answered"}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    {this.props.questions.sort((a, b) => a.like_count > b.like_count ? -1 : 1).map(question =>
                                        <ul key={question.id}>
                                            <QuestionCard session={this.props.session} handleUpdateQuestions={this.props.handleUpdateQuestions} question={question}/>
                                        </ul>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </div>
        );
    }
}

export default withStyles(useStyles)(Questions)