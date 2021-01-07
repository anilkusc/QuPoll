import React from 'react';
import Main from './Pages/Main'
import Users from './Pages/Users'
import Sessions from './Pages/Sessions'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  //Redirect,
  //Link
} from "react-router-dom";
import Navbar from './Components/Navbar';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { authenticated: false, };
    this.handleSetLoggedIn = this.handleSetLoggedIn.bind(this);
    this.handleSetLoggedOut = this.handleSetLoggedOut.bind(this);
  }

  handleSetLoggedIn() {
    this.setState({ authenticated: true });
  }
  handleSetLoggedOut() {
    this.setState({ authenticated: false });
  }
  render() {
    return (
      <div>
        <Routes authenticated={this.state.authenticated} handleSetLoggedIn={this.handleSetLoggedIn} handleSetLoggedOut={this.handleSetLoggedOut} />
      </div>
    );
  }
}

class Routes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    return (
      <Router>
        <Navbar authenticated={this.props.authenticated} handleSetLoggedIn={this.props.handleSetLoggedIn} handleSetLoggedOut={this.props.handleSetLoggedOut} />
        <Switch>
          <Route exact path="/" >
            <Main />
          </Route>
          <PrivateRoutes authenticated={this.props.authenticated}/>
        </Switch>
      </Router>
    );
  }
}

class PrivateRoutes extends React.Component {
  render() {
    if (this.props.authenticated) {
      return (
        <div>
          <Route exact path="/Users" >
            <Users />
          </Route>
          <Route exact path="/Sessions" >
            <Sessions />
          </Route>
        </div>
      )
    } else {
      return <div>Unauthorized</div>
    }
  }
}

export default App;