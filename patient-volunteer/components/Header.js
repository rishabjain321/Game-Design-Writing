// This is the header component that is always shown on the top of the screen.

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Button,
  Icon,
  Grid,
  Divider,
  Segment,
  Container
} from 'semantic-ui-react';

class Header extends Component {
  // Render a different button depending on whether or not the user is logged in
  renderButtons() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <div style={{ 'margin-top': '10px' }}>
            <a href="/auth/google">
              <Button icon labelPosition="left">
                <Icon name="google" />
                Login with Google
              </Button>
            </a>
          </div>
        );
      default:
        return (
          <div style={{ 'margin-top': '10px' }}>
            <a href="/api/logout">
              <Button content="Logout" icon="sign out" labelPosition="right" />
            </a>
          </div>
        );
    }
  }

  render() {
    return (
      <div style={{ 'text-align': 'center' }}>
        <Container>
          <Icon name="users" circular size="big" />
          <Link
            to={this.props.auth ? '/dashboard' : '/'}
            className="left brand-logo"
          >
            <h1>Patient Volunteering System</h1>
          </Link>
          {this.renderButtons()}
        </Container>
        <Divider />
      </div>
    );
  }
}

// refactored function equiv to above function
function mapStateToProps({ auth }) {
  return { auth };
}

// Export component and give it access to mapStateToProps and all of our actions
export default connect(mapStateToProps)(Header);
