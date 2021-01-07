
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
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

class DeleteUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(event) {
    event.preventDefault();
    var sendBody = []
    if(this.props.users < 1 ){
      alert("You must select at least 1 user for deleting.")
    }
    this.props.users.map((user) => {
      function AddRowToTable(id) {
        sendBody.push({ id: parseInt(id) });
      }
      AddRowToTable(user)
    })
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sendBody)
    };
    fetch('/backend/DeleteUser', requestOptions)
      .then(response => response.json())
      .then(data => {
        this.props.onChangeUsers(data)
        this.props.handleCloseCreate()
      })
      .catch(error => {
        console.log("Error ========>", error);
        alert("Error While login")
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
              Users with the following id will be deleted. Do you confirm?
            </Typography>
            {JSON.stringify(this.props.users)}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={this.handleSubmit}
              className={classes.submit}
            >
              Delete Users
              </Button>
          </div>
        </Container>
      </div>
    );
  }
}

export default withStyles(useStyles)(DeleteUser)