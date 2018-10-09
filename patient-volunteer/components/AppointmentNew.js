// This component is shown when at the URL '/appointments/new'
// Renders an AppointmentForm component

import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import AppointmentForm from './AppointmentForm';
import { Container } from 'semantic-ui-react';
import * as actions from '../actions';
import { connect } from 'react-redux';

class AppointmentNew extends Component {
  submit = values => {
    this.props.submitAppointment(values);
  };

  renderContent() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <div>
            <h1>Must log in!</h1>
          </div>
        );
      default:
        return <AppointmentForm onSubmit={this.submit} />;
    }
  }

  render() {
    return (
      <div style={{ 'text-align': 'center' }}>
        <Container>{this.renderContent()}</Container>
      </div>
    );
  }
}

// mapStateToProps takes in Redux state and gives the component access to
// its values as props.
// auth = signed in user object.
// using es6 destructuring.

function mapStateToProps({ auth }) {
  // We want access to the currently logged in user.
  // We would like to be able to reference them by saying this.props.auth
  return { auth };
}

// using connect to gain access to our actions
export default connect(mapStateToProps, actions)(AppointmentNew);
