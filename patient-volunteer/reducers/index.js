// This file contains our global Redux store.

import { combineReducers } from 'redux';
import authReducer from './authReducer';
import allUsersReducer from './allUsersReducer';
import allUnacceptedPatAppointmentsReducer from './allUnacceptedPatAppointmentsReducer';
import allAcceptedPatAppointmentsReducer from './allAcceptedPatAppointmentsReducer';
import allVolAppointmentsReducer from './allVolAppointmentsReducer';
import allSpecVolAppts from './allSpecVolAppts';
import { reducer as reduxForm } from 'redux-form';

// Connect data provided from the reducers to our defined properties in the store.
// AKA - we can make use of these values in our components wired up to Redux.
// Will be passed to the components as props.
// https://redux.js.org/api-reference/combinereducers
export default combineReducers({
  // the auth piece of state is being manufactured by the authReducer
  // (auth is the currently signed in user)
  auth: authReducer,
  // the allUsers piece of state is being created by the allUsersReducer, etc.
  allUsers: allUsersReducer,
  // reduxForm is the reducer provided by redux-form library
  form: reduxForm,
  allUnacceptedPatAppointments: allUnacceptedPatAppointmentsReducer,
  allAcceptedPatAppointments: allAcceptedPatAppointmentsReducer,
  allVolAppointments: allVolAppointmentsReducer,
  allSpecVolAppts: allSpecVolAppts
});
