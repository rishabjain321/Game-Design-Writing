// This component is the form used in the PatientDashboard to submit a rating
// This form makes use of component-level state, so had to bring it into its own
// component for multiple instances of the form (as well as multiple instances
// of component level state)

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { Button } from 'semantic-ui-react';
class RatingForm extends Component {
  // basic React constructor
  // sets the inital state
  constructor(props) {
    super(props);
    this.state = {
      rating: ''
    };

    this.handleChange = this.handleChange.bind(this);
  }

  // sets the state when the user selects a value in the select form
  async handleChange(event) {
    await this.setState({ rating: event.target.value });
  }

  // render a select form with options 0-5
  // provide an onClick handler (no need for jQuery!) that validates the input.
  // checks to make sure the state being passed into the action exists and that
  // the piece of state is a number
  render() {
    return (
      <div>
        <form id="ratingform">
          <label>Please leave a rating:</label>
          <br />
          <select
            name="ratinglist"
            form="ratingform"
            onChange={this.handleChange}
            style={{ 'margin-top': '10px' }}
          >
            <option value="" />
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </form>
        <br />
        <div
          onClick={() => {
            if (this.state.rating == '') {
              return;
            } else if (isNaN(this.state.rating)) {
              return;
            }

            this.props.submitRating(this.props.apptId, this.state.rating);
          }}
        >
          <Button basic color="green">
            Send Rating
          </Button>
        </div>
      </div>
    );
  }
}

// Export component and give it access to mapStateToProps and all of our actions
export default connect(null, actions)(RatingForm);
