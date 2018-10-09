// This component is the dashboard for the volunteer(s)

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import WaitTimeForm from './WaitTimeForm';
import {
  Container,
  List,
  Header,
  Table,
  Rating,
  Icon,
  Divider,
  Input,
  Grid,
  Button,
  Card
} from 'semantic-ui-react';

class VolunteerDashboard extends Component {
  // when the component mounts, fetch all of their accepted appointments
  // and all unaccepted appointments seeking this users specific volunteer type
  componentDidMount() {
    // this is all accepted appointments for the user
    this.props.fetchAllVolAppointments();
    // this is all appointments for a requested user type:
    if (this.props.auth) {
      this.props.fetchAllSpecVolAppts(this.props.auth.accountType);
    }
  }

  // accept date as string from mongodb, as well as waitTime as string from mongodb
  // add wait time to the accepted at date-time (coming in as string from mongo)
  // reformat and return.
  // We ran into a problem with cross-compatibility between different operating systems in this approach.
  // On mac: Tue May 01 2018 22:39:05 GMT-0400 (EDT)
  // On windows: Tue May 01 2018 22:39:06 GMT-0400 (Eastern Daylight Time)
  // Had to introduce moment for this reason
  getApproxTime(acceptedDate, waitTime) {
    var moment = require('moment');

    var b = moment(acceptedDate);

    // add the wait time (in minutes) to the newly created date
    var waitTimeAdded = moment(b).add(parseInt(waitTime), 'minutes');

    return waitTimeAdded.format('YYYY-MM-DD hh:mm:ss a');
  }

  // Reformat the createdAt time so it looks nice for the user
  getCreatedAt(date) {
    var moment = require('moment');
    var b = moment(date);

    return b.format('YYYY-MM-DD hh:mm:ss a');
  }

  // Render a set of buttons that kick off a user-requested account type change
  renderAccountTypeChange() {
    switch (this.props.auth.requested) {
      case null:
        return;
      case false:
        return <h1>no requested property</h1>;
      default:
        var user = this.props.auth;
        return (
          <div>
            <p>
              {user.requested != 'none' ? (
                <div>
                  <p>
                    You have requested to change to: <b>{user.requested}</b>
                  </p>
                  <Button
                    onClick={() =>
                      this.props.requestAccountType(user.googleId, 'none')
                    }
                    style={{ 'margin-left': '5px' }}
                    color="red"
                  >
                    Cancel request
                  </Button>
                </div>
              ) : (
                ' '
              )}
            </p>
            <Button
              onClick={() =>
                this.props.requestAccountType(user.googleId, 'patient')
              }
            >
              Change to Patient
            </Button>
            {user.accountType != 'specialist' ? (
              <Button
                onClick={() =>
                  this.props.requestAccountType(user.googleId, 'specialist')
                }
              >
                Change to Specialist
              </Button>
            ) : (
              ''
            )}
            {user.accountType != 'virtual-specialist' ? (
              <Button
                onClick={() =>
                  this.props.requestAccountType(
                    user.googleId,
                    'virtual-specialist'
                  )
                }
              >
                Change to Virtual-Specialist
              </Button>
            ) : (
              ''
            )}
            {user.accountType != 'general-practitioner' ? (
              <Button
                onClick={() =>
                  this.props.requestAccountType(
                    user.googleId,
                    'general-practitioner'
                  )
                }
              >
                Change to General-Practitioner
              </Button>
            ) : (
              ''
            )}
          </div>
        );
    }
  }

  // Render a list of React components representing all accepted appointments
  // for this user.
  renderAcceptedAppts() {
    switch (this.props.allVolAppointments) {
      case null:
        return;
      case false:
        return (
          <div>
            <h1>No accepted appointments found!</h1>
          </div>
        );
      default:
        var appts = this.props.allVolAppointments;
        // successfully getting all of the users, but it is an object
        // containing nested objects
        // ex { 1: { title: 'body'}, 2: { title: 'body'} }

        // converting the nested objects into an array of objects like react likes
        // https://medium.com/chrisburgin/javascript-converting-an-object-to-an-array-94b030a1604c
        // userArray is a list of all users stored as objects in an array
        var apptArray = Object.keys(appts).map(i => appts[i]);

        const listAppts = apptArray.map(appt => (
          <div key={appt._id}>
            <List.Item>
              <Card>
                <Card.Content header={appt.title} />
                <Card.Content description={appt.body} />
                <Card.Content extra>
                  Estimated Arrival:
                  <br />
                  <Icon name="alarm outline" />
                  {this.getApproxTime(appt.acceptedAt, appt.waitTime)}
                  <br />
                  <br />
                  Patient Name:
                  <br />
                  <Icon name="user outline" />
                  {appt.patientName}
                  <br />
                  <br />
                  No longer able to assist?
                  <br />
                  <Button
                    basic
                    color="red"
                    onClick={() => this.props.cancelVolunteering(appt._id)}
                    style={{ 'margin-top': '5px' }}
                  >
                    Cancel
                  </Button>
                </Card.Content>
              </Card>
            </List.Item>
          </div>
        ));

        if (listAppts.length == 0) {
          return (
            <div>
              <p>No appointments accepted at this time.</p>
            </div>
          );
        }

        return listAppts;
    }
  }

  // Render a list of React components representing all unaccepted appointments
  // for this user's specific volunteer type
  renderUnacceptedAppts() {
    switch (this.props.allSpecVolAppts) {
      case null:
        return;
      case false:
        return (
          <div>
            <h1>No accepted appointments found!</h1>
          </div>
        );
      default:
        var appts = this.props.allSpecVolAppts;

        // converting the nested objects into an array of objects like react likes
        // https://medium.com/chrisburgin/javascript-converting-an-object-to-an-array-94b030a1604c
        // userArray is a list of all users stored as objects in an array
        var apptArray = Object.keys(appts).map(i => appts[i]);

        const listAppts = apptArray.map(appt => (
          <List.Item>
            <Card>
              <Card.Content header={appt.title} />
              <Card.Content description={appt.body} />
              <Card.Content extra>
                Patient Name:
                <br />
                {appt.patientName}
                <br />
                <br />
                Created at:
                <br />
                <Icon name="clock outline" />
                {this.getCreatedAt(appt.createdAt)}
                <br />
                <br />
                Seeking a:
                <br />
                <Icon name="user outline" />
                {appt.volunteerType}
                <br />
                <br />
                Wait time (in minutes):
                <br />
                <WaitTimeForm appointment={appt} user={this.props.auth} />
              </Card.Content>
            </Card>
          </List.Item>
        ));

        if (listAppts.length == 0) {
          return (
            <div>
              <p>No appointments to accept at this time.</p>
              <b>
                <p style={{ color: 'blue' }}>Please check back later!</p>
              </b>
            </div>
          );
        }

        return listAppts;
    }
  }

  // dynamically change the color of the average rating
  // to help represent a good/bad rating
  chooseColor(rating) {
    if (rating < 3) {
      return 'red';
    } else return 'green';
  }

  render() {
    return (
      <div style={{ 'text-align': 'center' }}>
        <Container>
          <h4>Volunteer Dashboard</h4>
          <Divider />
        </Container>
        <Container>
          <Grid>
            <Grid.Row columns={2}>
              <Grid.Column>
                <Container>
                  <h3 style={{ 'text-align': 'left' }}>
                    Accepted appointments:
                  </h3>
                  <List>{this.renderAcceptedAppts()}</List>
                </Container>
              </Grid.Column>
              <Grid.Column>
                <Container>
                  <h3 style={{ 'text-align': 'left' }}>
                    Pending appointments:
                  </h3>
                  <List>{this.renderUnacceptedAppts()}</List>
                </Container>
              </Grid.Column>
            </Grid.Row>
          </Grid>
          <Divider />
          <h3>Your average volunteer rating is:</h3>
          <h4 style={{ color: this.chooseColor(this.props.auth.avgRating) }}>
            {this.props.auth.avgRating}
          </h4>
          <Divider />
        </Container>
        <Container>
          <h4>Wrong account type?</h4>
          {this.renderAccountTypeChange()}
          <Divider />
          <p>Any other issues?</p> <b>admin@notarealemail.com</b>
        </Container>
      </div>
    );
  }
}

// auth = signed in user object
// allVolAppointments = list of appointments accepted by user (user = volunteer right now)
// appSpecVolAppts = list of appointments (unaccepted) but looking for the account type of the current user
function mapStateToProps({ auth, allVolAppointments, allSpecVolAppts }) {
  return { auth, allVolAppointments, allSpecVolAppts };
}

// Export component and give it access to mapStateToProps and all of our actions
export default connect(mapStateToProps, actions)(VolunteerDashboard);
