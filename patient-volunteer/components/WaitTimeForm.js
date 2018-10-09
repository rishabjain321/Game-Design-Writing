// This component is the form used in the VolunteerDashboard to accept an appointment,
// as well as provide a wait time.
// This form makes use of component-level state, so had to bring it into its own
// component for multiple instances of the form (as well as multiple instances
// of component level state)

import React, { Component } from 'react';
import { Input, Button } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';

class WaitTimeForm extends Component {
  // basic React constructor
  // sets the inital state
  constructor(props) {
    // super = hey I have all of these props being passed in,
    // let me access them by using this.props.____
    super(props);
    this.state = {
      waitTime: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  // sets the state when the user inputs a value into the form
  async handleChange(event) {
    await this.setState({ waitTime: event.target.value });
  }

  // render an input for the user to enter a wait time value
  // provide an onClick handler for submitting that validates that the value
  // provided is not null and is a number
  render() {
    return (
      <div>
        <Input
          type="text"
          value={this.state.waitTime}
          onChange={this.handleChange}
          placeholder="15"
          style={{ 'margin-bottom': '5px', 'margin-top': '5px' }}
        />
        <div
          onClick={() => {
            if (this.state.waitTime == '') {
              return;
            } else if (isNaN(this.state.waitTime)) {
              return;
            }

            this.props.acceptAppointment(
              this.props.appointment._id,
              this.props.user._id,
              this.state.waitTime,
              this.props.user.avgRating
            );
          }}
        >
          <Button basic color="green" style={{ 'margin-bottom': '20px' }}>
            Accept
          </Button>
        </div>
      </div>
    );
  }
}

// Export component and give it access to mapStateToProps and all of our actions
export default connect(null, actions)(WaitTimeForm);
