
import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Linked from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
import Modal from '@material-ui/core/Modal';
import CloseIcon from '@material-ui/icons/Close';
import SignIn from './SignIn'
import SignOut from './SignOut'
import ChangeSession from './ChangeSession'
import { Link } from "react-router-dom";

const useStyles = theme => ({
    appBar: {
        borderBottom: `1px solid ${theme.palette.divider}`,
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    modal: {
        top: `49%`,
        left: `51%`,
        transform: `translate(-49%, -51%)`,
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    }
});

class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openLogin: false,
            openChangeSession: false,
        };
        this.handleCloseLogin = this.handleCloseLogin.bind(this);
        this.handleOpenLogin = this.handleOpenLogin.bind(this);
        this.handleCloseChangeSession = this.handleCloseChangeSession.bind(this);
        this.handleOpenChangeSession = this.handleOpenChangeSession.bind(this);
    }

    handleCloseLogin() {
        this.setState({ openLogin: false })
    }
    handleOpenLogin() {
        this.setState({ openLogin: true })
    }
    handleCloseChangeSession() {
        this.setState({ openChangeSession: false })
    }
    handleOpenChangeSession() {
        this.setState({ openChangeSession: true })
    }

    render() {
        const { classes } = this.props;
        var signButton, links
        if (this.props.authenticated === true) {
            signButton = "Sign Out"
            links = <Private classes={classes} />
        } else {
            signButton = "Sign In"
        }

        return (
            <div>
                <AppBar position="static" color="default" elevation={0} className={classes.appBar}>
                    <Toolbar className={classes.toolbar}>
                        <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}>
                                    QuPoll  
                        </Typography>
                        <Modal
                            open={this.state.openChangeSession}
                            onClose={this.handleCloseChangeSession}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <div className={classes.modal}>
                                <Button onClick={this.handleCloseChangeSession}><CloseIcon /></Button>
                                <ChangeSession handleCloseChangeSession={this.handleCloseChangeSession} handleChangeSession={this.props.handleChangeSession} />
                            </div>
                        </Modal>
                        <Linked variant="button" color="textPrimary" href="#" className={classes.link} onClick={this.handleOpenChangeSession}>
                            Change Session
                        </Linked>
                        {links}
                        <Modal
                            open={this.state.openLogin}
                            onClose={this.handleCloseLogin}
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                        >
                            <div className={classes.modal}>
                                <Button onClick={this.handleCloseLogin}><CloseIcon /></Button>
                                <Sign authenticated={this.props.authenticated} handleSetLoggedIn={this.props.handleSetLoggedIn} handleSetLoggedOut={this.props.handleSetLoggedOut} handleCloseLogin={this.handleCloseLogin} />
                            </div>
                        </Modal>
                        <Button href="#" color="primary" variant="outlined" className={classes.link} onClick={this.handleOpenLogin}>
                            {signButton}
                        </Button>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

class Sign extends React.Component {
    render() {
        if (this.props.authenticated === true) {
            return (
                <SignOut handleSetLoggedOut={this.props.handleSetLoggedOut} handleCloseLogin={this.props.handleCloseLogin} />
            )
        } else {
            return (
                <SignIn handleSetLoggedIn={this.props.handleSetLoggedIn} handleCloseLogin={this.props.handleCloseLogin} />
            )
        }

    }

}
class Private extends React.Component {
    render() {
        const classes = this.props.classes
        return (
            <div>
                <Link to="/Approve">
                    <Linked variant="button" color="textPrimary" to="/Approve" className={classes.link}>
                        Approve
                    </Linked>
                </Link>                
                <Link to="/">
                    <Linked variant="button" color="textPrimary" to="/" className={classes.link}>
                        Questions
                </Linked>
                </Link>
                <Link to="/Users">
                    <Linked variant="button" color="textPrimary" to="/Users" className={classes.link}>
                        Users
                    </Linked>
                </Link>
                <Link to="/Sessions">
                    <Linked variant="button" color="textPrimary" to="/Sessions" className={classes.link}>
                        Sessions
                    </Linked>
                </Link>
            </div>
        )
    }
}

export default withStyles(useStyles)(Navbar)