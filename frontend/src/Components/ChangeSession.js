
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class ChangeSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sessionName: "",
      password: "",
    };
    this.handleChangeSessionName = this.handleChangeSessionName.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeSessionName(event) {
    this.setState({ sessionName: event.target.value });
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{\"session_name\":\"" + this.state.sessionName + "\",\"password\":\"" + this.state.password + "\"}",
    };
    fetch('/backend/ChangeSession', requestOptions)
      .then(response => response.json())
      .then(data => {
        if (data.session_name != null) {
            this.setState({sessionName:data.session_name})
        }else{
            alert("Error While Setting Session")
        }
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("Error While Setting Session")
      })
  }
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Change Session
        </Typography>
            <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="text"
                label="Session Name"
                name="sessionName"
                autoComplete="sessionname"
                onChange={this.handleChangeSessionName}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleChangePassword}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                className={classes.submit}
              >
                Change Session
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(useStyles)(ChangeSession)