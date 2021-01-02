
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
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Container component="main">
                    <Grid container justify="center" spacing={1} >
                        <Grid item xs={12} sm={12}>
                            <Card>
                                <CardHeader
                                    title={"Questions"}
                                    className={classes.cardHeader}
                                />
                                <CardContent>
                                    {this.props.questions.sort((a, b) => a.like_count > b.like_count ? -1:1).map(question => 
                                    <ul key={question.question_id}>
                                        <QuestionCard question_id={question.question_id} like_count={question.like_count} question={question.question} asker={question.asker} date={question.date} />
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