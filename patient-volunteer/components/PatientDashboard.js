// This component is the dashboard for the patient(s)

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as actions from '../actions';
import RatingForm from './RatingForm';
import {
  Container,
  List,
  Header,
  Table,
  Rating,
  Icon,
  Divider,
  Button,
  Grid,
  Card
} from 'semantic-ui-react';

class PatientDashboard extends Component {
  // when this component mounts, fetch all accepted and unaccepted/pending
  // appointments for the patient signed in
  componentDidMount() {
    this.props.fetchAllUnacceptedPatAppointments();
    this.props.fetchAllAcceptedPatAppointments();
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
                    basic
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
              basic
              onClick={() =>
                this.props.requestAccountType(user.googleId, 'specialist')
              }
            >
              Change to Specialist
            </Button>
            <Button
              basic
              onClick={() =>
                this.props.requestAccountType(
                  user.googleId,
                  'virtual-specialist'
                )
              }
            >
              Change to Virtual-Specialist
            </Button>
            <Button
              basic
              onClick={() =>
                this.props.requestAccountType(
                  user.googleId,
                  'general-practitioner'
                )
              }
            >
              Change to General-Practitioner
            </Button>
          </div>
        );
    }
  }

  // Render all of the patient's appointments that are accepted
  renderAcceptedAppts() {
    switch (this.props.allAcceptedPatAppointments) {
      case null:
        return;
      case false:
        return (
          <div>
            <h1>No accepted appointments found!</h1>
          </div>
        );
      default:
        var appts = this.props.allAcceptedPatAppointments;
        // successfully getting all of the users, but it is an object
        // containing nested objects
        // ex { 1: { title: 'body'}, 2: { title: 'body'} }

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
                Estimated arrival:
                <br />
                <Icon name="alarm outline" />
                {this.getApproxTime(appt.acceptedAt, appt.waitTime)}
                <br />
                <br />
                Volunteer Name:
                <br />
                <Icon name="user outline" />
                {appt.volunteerName}
                <br />
                <br />
                Volunteer Rating:
                <br />
                <Icon name="line chart" />
                {appt.volunteerRating}
                <br />
                <br />
                <RatingForm apptId={appt._id} />
                <Button
                  basic
                  style={{ 'margin-top': '5px' }}
                  color="red"
                  onClick={() => this.props.cancelAppointment(appt._id)}
                >
                  Delete Appointment
                </Button>
              </Card.Content>
            </Card>
          </List.Item>
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

  // Render all patient's appointments that are unaccepted
  renderUnacceptedAppts() {
    switch (this.props.allUnacceptedPatAppointments) {
      case null:
        return;
      case false:
        return (
          <div>
            <h1>No accepted appointments found!</h1>
          </div>
        );
      default:
        var appts = this.props.allUnacceptedPatAppointments;
        // successfully getting all of the users, but it is an object
        // containing nested objects
        // ex { 1: { title: 'body'}, 2: { title: 'body'} }

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
                <Button
                  basic
                  style={{ 'margin-top': '5px', 'margin-bottom': '20px' }}
                  color="red"
                  onClick={() => this.props.cancelAppointment(appt._id)}
                >
                  Cancel Appointment
                </Button>
              </Card.Content>
            </Card>
          </List.Item>
        ));

        if (listAppts.length == 0) {
          return (
            <div>
              <p>No appointments created.</p>
              <b>
                <p style={{ color: 'blue' }}>Create an appointment below!</p>
              </b>
            </div>
          );
        }

        return listAppts;
    }
  }

  render() {
    return (
      <div style={{ 'text-align': 'center' }}>
        <Container>
          <h4>Patient Dashboard</h4>
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
        </Container>
        <br />
        <Link to="/appointments/new">
          <Button animated color="blue">
            <Button.Content visible>New Appointment</Button.Content>
            <Button.Content hidden>
              <Icon name="write" />
            </Button.Content>
          </Button>
        </Link>
        <Container>
          <Divider />
          <h4>Wrong account type?</h4>
          {this.renderAccountTypeChange()}
          <Divider />
          <p>Any other issues?</p> <b>admin@notarealemail.com</b>
        </Container>
      </div>
    );
  }
}

// all of these values from the store are available as props in this component
function mapStateToProps({
  auth,
  allUnacceptedPatAppointments,
  allAcceptedPatAppointments
}) {
  return { auth, allUnacceptedPatAppointments, allAcceptedPatAppointments };
}

// Export component and give it access to mapStateToProps and all of our actions
export default connect(mapStateToProps, actions)(PatientDashboard);
