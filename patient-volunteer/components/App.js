// This file is our root level component

import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import Header from './Header';
import Landing from './Landing';
import Dashboard from './Dashboard';
import AppointmentNew from './AppointmentNew';

class App extends Component {
  // when this app gets rendered on the screen,
  // go do what is called in this lifecycle method - fetch the currently
  // signed in user (or find that the user is not signed in)
  componentDidMount() {
    this.props.fetchUser();
  }

  // Making use of react-router here for basic navigation.
  // This approach was based on implementation by Stephen Grider in his course:
  // https://www.udemy.com/node-with-react-fullstack-web-development/
  // Always show the Header component
  // If at the root URL '/' show the Landing component
  // If at the URL '/dashboard' show the Dashboard component
  // If at the URL '/appointments/new' show the AppointmentNew component
  render() {
    return (
      <BrowserRouter>
        <div>
          <Header />
          <Route exact path="/" component={Landing} />
          <Route exact path="/dashboard" component={Dashboard} />
          <Route exact path="/appointments/new" component={AppointmentNew} />
        </div>
      </BrowserRouter>
    );
  }
}

// Use connect to give the App component access to our Redux actions as props
export default connect(null, actions)(App);
