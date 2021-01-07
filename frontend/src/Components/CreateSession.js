
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
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
});

class CreateSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session_name: "",
      password: "",
    };
    this.handleChangeSessionname = this.handleChangeSessionname.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeSessionname(event) {
    this.setState({ session_name: event.target.value });
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{\"session_name\":\"" + this.state.session_name + "\",\"password\":\"" + this.state.password + "\"}",
    };
    fetch('/backend/CreateSession', requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.onChangeSessions(data)
        this.props.handleCloseCreate()
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("Error While Create Session")
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
              Create Session
        </Typography>
            <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="text"
                label="Session Name"
                name="Session Name"
                autoComplete="Session Name"
                defaultValue={this.props.session_name}
                onChange={this.handleChangeSessionname}
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
                defaultValue={this.props.password}
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
                Create Session
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(useStyles)(CreateSession)