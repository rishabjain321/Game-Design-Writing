// This component is the dashboard for the admin/super user(s)

import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {
  List,
  Table,
  Header,
  Divider,
  Button,
  Container
} from 'semantic-ui-react';

class AdminDashboard extends Component {
  // when this component mounts, fetch all users that are logged in the system/database
  componentDidMount() {
    this.props.fetchAllUsers();
  }

  // render all pending account type requests
  // aka all users that have a 'requested' property != 'none'
  renderRequests() {
    switch (this.props.allUsers) {
      case null:
        return;
      case false:
        return;
      default:
        var users = this.props.allUsers;

        // converting the nested objects into an array of objects like react likes
        // https://medium.com/chrisburgin/javascript-converting-an-object-to-an-array-94b030a1604c
        var userArray = Object.keys(users).map(i => users[i]);

        // filter out all users that have a pending account type request
        var requestedUsers = userArray.filter(user => user.requested != 'none');

        // all possible account types
        var types = [
          'super',
          'patient',
          'specialist',
          'virtual-specialist',
          'general-practitioner'
        ];

        // compose a list of semantic-ui styled Table components
        // one for each pending account type request
        const requests = requestedUsers.map(user => (
          <List.Item>
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Account Type</Table.HeaderCell>
                  <Table.HeaderCell>Requested Account Type</Table.HeaderCell>
                  <Table.HeaderCell>Accept</Table.HeaderCell>
                  <Table.HeaderCell>Deny</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.accountType}</Table.Cell>
                  <Table.Cell>{user.requested}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(user.googleId, user.requested)
                      }
                      color="green"
                    >
                      Accept
                    </Button>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(user.googleId, 'none')
                      }
                      color="red"
                    >
                      Deny
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </List.Item>
        ));

        if (requests.length == 0) {
          return (
            <div>
              <p>No pending account-type requests at this time!</p>
            </div>
          );
        }

        return requests;
    }
  }

  // render all users that are logged in the system/database
  renderUsers() {
    switch (this.props.allUsers) {
      case null:
        return;
      case false:
        return (
          <div>
            <h1>No users found!</h1>
          </div>
        );
      default:
        var users = this.props.allUsers;
        // successfully getting all of the users, but it is an object
        // containing nested objects
        // ex { 1: { title: 'body'}, 2: { title: 'body'} }

        // converting the nested objects into an array of objects like react likes
        // https://medium.com/chrisburgin/javascript-converting-an-object-to-an-array-94b030a1604c
        // userArray is a list of all users stored as objects in an array
        var userArray = Object.keys(users).map(i => users[i]);

        var superUsers = userArray.filter(user => user.accountType === 'super');

        var patientUsers = userArray.filter(
          user => user.accountType === 'patient'
        );

        // all volunteer types
        var types = [
          'specialist',
          'virtual-specialist',
          'general-practitioner'
        ];

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/includes
        var volunteerUsers = userArray.filter(user =>
          types.includes(user.accountType)
        );

        // rendering each user as a semantic-ui list item component
        // https://stackoverflow.com/questions/41374572/how-to-render-an-array-of-objects-in-react
        // above link was referenced to render an array of objects as react components
        const listSupers = superUsers.map(user => (
          <List.Item>
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Account Type</Table.HeaderCell>
                  <Table.HeaderCell>Change Account Type</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.accountType}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(user.googleId, 'patient')
                      }
                    >
                      Change to Patient
                    </Button>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(user.googleId, 'specialist')
                      }
                    >
                      Change to Specialist
                    </Button>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(
                          user.googleId,
                          'virtual-specialist'
                        )
                      }
                    >
                      Change to Virtual-Specialist
                    </Button>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(
                          user.googleId,
                          'general-practitioner'
                        )
                      }
                    >
                      Change to General-Practitioner
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </List.Item>
        ));

        const listPatients = patientUsers.map(user => (
          <List.Item>
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Account Type</Table.HeaderCell>
                  <Table.HeaderCell>Change Account Type</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.accountType}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(user.googleId, 'specialist')
                      }
                    >
                      Change to Specialist
                    </Button>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(
                          user.googleId,
                          'virtual-specialist'
                        )
                      }
                    >
                      Change to Virtual-Specialist
                    </Button>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(
                          user.googleId,
                          'general-practitioner'
                        )
                      }
                    >
                      Change to General-Practitioner
                    </Button>
                    <Button
                      style={{ 'margin-top': '5px' }}
                      onClick={() =>
                        this.props.changeUserType(user.googleId, 'super')
                      }
                    >
                      Change to Admin
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </List.Item>
        ));

        const listVolunteers = volunteerUsers.map(user => (
          <List.Item>
            <Table celled padded>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Name</Table.HeaderCell>
                  <Table.HeaderCell>Account Type</Table.HeaderCell>
                  <Table.HeaderCell>Change Account Type</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>
                <Table.Row>
                  <Table.Cell>{user.name}</Table.Cell>
                  <Table.Cell>{user.accountType}</Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() =>
                        this.props.changeUserType(user.googleId, 'patient')
                      }
                    >
                      Change to Patient
                    </Button>
                    {user.accountType != 'specialist' ? (
                      <Button
                        onClick={() =>
                          this.props.changeUserType(user.googleId, 'specialist')
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
                          this.props.changeUserType(
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
                          this.props.changeUserType(
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
                    <Button
                      style={{ 'margin-top': '5px' }}
                      onClick={() =>
                        this.props.changeUserType(user.googleId, 'super')
                      }
                    >
                      Change to Admin
                    </Button>
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table>
          </List.Item>
        ));

        // combining the lists of React components into one large list to return
        var finalList = listSupers.concat(listPatients).concat(listVolunteers);
        return finalList;
    }
  }

  // want to render accepted appointments
  // want to render pending/unaccepted appointments
  render() {
    return (
      <div style={{ 'text-align': 'center' }}>
        <Container>
          <h4>Admin Dashboard</h4>
          <Divider />
        </Container>
        <Container>
          <h3>Pending account-type requests:</h3>
          <List>{this.renderRequests()}</List>
          <Divider />
        </Container>
        <Container>
          <h3>List of all users:</h3>
          <List>{this.renderUsers()}</List>
        </Container>
      </div>
    );
  }
}

// auth = signed in user object
// allUsers = all users
// access Redux store values as props in the component
function mapStateToProps({ auth, allUsers }) {
  return { auth, allUsers };
}

// export component, link it with redux
export default connect(mapStateToProps, actions)(AdminDashboard);
