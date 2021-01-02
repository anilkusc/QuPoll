import React from 'react';
import Main from './Pages/Main'
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
        <Navbar authenticated={this.state.authenticated} handleSetLoggedIn={this.handleSetLoggedIn} handleSetLoggedOut={this.handleSetLoggedOut} />
        <Routes />
      </div>
    );
  }
}

class Routes extends React.Component {
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
      <Router>
        <Switch>
          <Route exact path="/" >
            <Main />
          </Route>
        </Switch>
      </Router>
    );
  }
}
export default App;