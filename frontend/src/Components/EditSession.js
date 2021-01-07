
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

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

class EditSession extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      session_name: this.props.session_name,
      password: this.props.password,
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
      body: "{\"id\":"+ this.state.id +",\"session_name\":\"" + this.state.session_name + "\",\"password\":\"" + this.state.password + "\"}"
    };
    fetch('/backend/UpdateSession', requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.onChangeSessions(data)
        this.props.handleCloseEdit()
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("Error Updating Session")
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
              Edit Session
        </Typography>
            <form className={classes.form} noValidate onSubmit={this.handleSubmit}>
              <TextField
                disabled
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="text"
                label="ID"
                name="id"
                autoComplete="id"
                defaultValue={this.state.id}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="text"
                label="Sessin Name"
                name="sessionname"
                autoComplete="sessionname"
                defaultValue={this.state.session_name}
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
                defaultValue={this.state.password}
                onChange={this.handleChangePassword}
                helperText="Leave this blank if you do not want to change password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                className={classes.submit}
              >
                Update Session
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(useStyles)(EditSession)