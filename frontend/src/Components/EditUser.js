
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

class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: this.props.id,
      username: this.props.username,
      password: this.props.password,
      role: this.props.role,
    };
    this.handleChangeUsername = this.handleChangeUsername.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleChangeRole = this.handleChangeRole.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChangeUsername(event) {
    this.setState({ username: event.target.value });
  }
  handleChangePassword(event) {
    this.setState({ password: event.target.value });
  }
  handleChangeRole(event) {
    this.setState({ role: event.target.value });
  }
  handleSubmit(event) {
    event.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: "{\"id\":"+ this.state.id +",\"username\":\"" + this.state.username + "\",\"password\":\"" + this.state.password + "\",\"role\":\"" + this.state.role + "\"}"
    };
    fetch('/backend/UpdateUser', requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.onChangeUsers(data)
        this.props.handleCloseEdit()
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("Error Updateing ser")
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
              Edit User
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
                label="Username"
                name="username"
                autoComplete="username"
                defaultValue={this.state.username}
                onChange={this.handleChangeUsername}
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
              />
              <FormControl className={classes.formControl}>
                <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                  Role
                </InputLabel>
                <Select
                  labelId="demo-simple-select-placeholder-label-label"
                  id="demo-simple-select-placeholder-label"
                  defaultValue={this.state.role}
                  onChange={this.handleChangeRole}
                  displayEmpty
                  className={classes.selectEmpty}
                >
                  <MenuItem value={"admin"}>admin</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.handleSubmit}
                className={classes.submit}
              >
                Update User
              </Button>
            </form>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(useStyles)(EditUser)