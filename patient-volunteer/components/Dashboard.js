// This component checks the account type of the signed in user,
// and renders the appropriate sub-dashboard component

import React, { Component } from 'react';
import { connect } from 'react-redux';
import PatientDashboard from './PatientDashboard';
import VolunteerDashboard from './VolunteerDashboard';
import AdminDashboard from './AdminDashboard';

class Dashboard extends Component {
  // renders a greeting saying welcome 'name' or no login!
  renderGreeting() {
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
        return <h2>Hello, {this.props.auth.name}!</h2>;
    }
  }

  // Check the user's account type, render the appropriate Sub-Dashboard component
  renderSubDashboard() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return;
      default:
        if (this.props.auth.accountType === 'patient')
          return <PatientDashboard />;
        else if (this.props.auth.accountType === 'super')
          return <AdminDashboard />;
        else if (this.props.auth.accountType === 'specialist')
          return <VolunteerDashboard />;
        else if (this.props.auth.accountType === 'virtual-specialist')
          return <VolunteerDashboard />;
        else if (this.props.auth.accountType === 'general-practitioner')
          return <VolunteerDashboard />;
        else
          return (
            <div>
              <h3>
                Error: could not match your account type with a dashboard
                component
              </h3>
            </div>
          );
    }
  }

  // Call the functions defined above that return JSX to render
  render() {
    return (
      <div style={{ 'text-align': 'center' }}>
        {this.renderGreeting()}
        {this.renderSubDashboard()}
      </div>
    );
  }
}

// mapStateToProps takes in Redux state and gives the component access to
// its values as props.
// auth = signed in user object.
// using es6 destructuring.
function mapStateToProps({ auth }) {
  return { auth };
}

// Export the component as usual, but connect it with Redux + mapStateToProps
export default connect(mapStateToProps)(Dashboard);
