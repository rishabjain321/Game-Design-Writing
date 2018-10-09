// This file houses all of our Redux action creators.
// Note that some of these actions are not connected the store, but still
// dispatched to follow convention.

// axios will be used for our HTTP requests
import axios from 'axios';

// Bring in all of our action types for use in this file.
import {
  FETCH_USER,
  FETCH_ALL_USERS,
  SUBMIT_APPOINTMENT,
  FETCH_ALL_UNACCEPTED_PAT_APPOINTMENTS,
  FETCH_ALL_ACCEPTED_PAT_APPOINTMENTS,
  FETCH_ALL_VOL_APPOINTMENTS,
  FETCH_ALL_SPEC_VOL_APPOINTMENTS,
  ACCEPT_APPOINTMENT,
  CHANGE_USER_TYPE,
  REQUEST_USER_TYPE,
  SUBMIT_RATING,
  CANCEL_APPOINTMENT,
  CANCEL_VOLUNTEERING_APPOINTMENT
} from './types';

// Using redux thunk middleware in all of these actions!
// redux-thunk: https://github.com/gaearon/redux-thunk.
// Action creator will normally just return an object,
// but redux-thunk inspects the return type of all actions
// and if that returned object is a function, gives you access to the dispatch function
// to call whenever you like!
// This allows you to decide when to dispatch instead of all right away like default -
// for example; making calls to our Express routes before dispatching.

// fetchUser will be called when the App component is initially rendered
// (in ComponentDidMount() lifecycle method).
export const fetchUser = () => {
  return async dispatch => {
    // Make a get request using axios to Express route '/api/current_user'.
    // res = User instance of the currently signed-in user.
    const res = await axios.get('/api/current_user');

    // Dispatch res.data to authReducer
    dispatch({ type: FETCH_USER, payload: res.data });
  };
};

// fetchAllUsers will be called when the AdminDashboard component is initally
// rendered (in ComponentDidMount() lifecycle method).
export const fetchAllUsers = () => {
  return async dispatch => {
    // Get all users stored in mongoDB, set it equal to res
    const res = await axios.get('/api/all_users');

    // res.data = an object that contains all users.
    // Dispatch to allUsersReducer.
    dispatch({ type: FETCH_ALL_USERS, payload: res.data });
  };
};

// Fetch all unaccepted appointments for a specific patient.
export const fetchAllUnacceptedPatAppointments = () => {
  return async dispatch => {
    // Get all patient's appointments with no volunteerId assigned yet -
    // aka volunteerId = "0" which is default - and store in res.
    const res = await axios.get('/api/all_unaccepted_patient_appointments/');

    // Dispatch to allUnacceptedPatAppointmentsReducer.
    dispatch({
      type: FETCH_ALL_UNACCEPTED_PAT_APPOINTMENTS,
      payload: res.data
    });
  };
};

// Fetch all accepted appointments for a specific patient.
export const fetchAllAcceptedPatAppointments = () => {
  return async dispatch => {
    // Get all patient's appointments with a volunteerId != "0",
    // store in res.
    const res = await axios.get('/api/all_accepted_patient_appointments/');

    // Dispatch to allAcceptedPatAppointmentsReducer.
    dispatch({
      type: FETCH_ALL_ACCEPTED_PAT_APPOINTMENTS,
      payload: res.data
    });
  };
};

// Fetching all accepted appointments accepted by a specific volunteer.
export const fetchAllVolAppointments = () => {
  return async dispatch => {
    // Get all volunteer's accepted appointments,
    // store in res.
    const res = await axios.get('/api/all_vol_appointments');

    // Dispatch to allVolAppointmentsReducer.
    dispatch({ type: FETCH_ALL_VOL_APPOINTMENTS, payload: res.data });
  };
};

// Fetch all unaccepted appointments looking for a specific volunteer type.
// Accepts one argument volType = the currently logged-in volunteers account type.
export const fetchAllSpecVolAppts = volType => {
  return async dispatch => {
    // Get all appointments looking for the specific volType,
    // store in res.
    // Using a template string here!
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
    const res = await axios.get(`/api/all_spec_vol_appts/${volType}`);

    // Dispatch to allSpecVolAppts reducer.
    dispatch({ type: FETCH_ALL_SPEC_VOL_APPOINTMENTS, payload: res.data });
  };
};

// Submit an appointment as a patient, called from the AppointmentNew component.
// values = { title, body, volunteerType }
export const submitAppointment = values => {
  return async dispatch => {
    // Getting the current date+time, shortening the produced string,
    // and adding the property to values object.
    // createdAt will represent the time in which the appointment was created.
    var a = Date();
    values.createdAt = a;

    // Make a post request passing in the values object
    // values = { title, body, volunteerType, createdAt }
    const res = await axios.post('/api/appointments', values);

    // once the post request has finished, redirect the user back
    // to the Dashboard component
    window.location.href = '/dashboard';

    dispatch({ type: SUBMIT_APPOINTMENT, payload: res.data });
  };
};

// Accept an appointment as a volunteer, called from WaitTimeForm component.
// Arguments:
// apptId = the appointment id (mongoDB _id)
// volId = the accepting volunteer's id (mongoDB _id)
// waitTime = the wait time/number of minutes until assistance
// rating = the volunteers average patient-supplied rating
export const acceptAppointment = (apptId, volId, waitTime, rating) => {
  return async dispatch => {
    // Get the date+time of the volunteer accepting,
    // assign it to acceptedAt.
    var a = Date();
    var acceptedAt = a;

    // Make a post request to Express route '/api/appointments/accept' with
    // the 5 values stored in the post body.
    // Using es6 syntax here when defining this object
    // instead of writing "volId: volId,", just write "volId,"
    const res = await axios.post('/api/appointments/accept', {
      volId,
      apptId,
      acceptedAt,
      waitTime,
      rating
    });

    // Reload the dashboard to force a re-render and fetch most recent
    // data for the user.
    window.location.reload();

    dispatch({ type: ACCEPT_APPOINTMENT, payload: res.data });
  };
};

// Action to change a user's account type.
// Called from AdminDashboard component.
export const changeUserType = (googleId, accountType) => {
  return async dispatch => {
    // Make a post request to Express route '/api/users/change_account_type'
    // with a body containing the users googleId and the newly
    // decided acountType value (the accountType they will be changed to)
    const res = await axios.post('/api/users/change_account_type', {
      googleId,
      accountType
    });

    // Reload the dashboard to force a re-render and fetch most recent
    // data for the user.
    window.location.reload();

    dispatch({ type: CHANGE_USER_TYPE, payload: res.data });
  };
};

// Action to request an account type change from the admin/super user(s).
// Called from both PatientDashboard and VolunteerDashboard components.
export const requestAccountType = (googleId, accountType) => {
  return async dispatch => {
    // Make a post request to the Express route '/api/users/request_account_type'
    // with a body containing the currently signed in user's googleId
    // as well as their desired accountType.
    const res = await axios.post('/api/users/request_account_type', {
      googleId,
      accountType
    });

    // Reload the dashboard to force a re-render and fetch most recent
    // data for the user.
    window.location.reload();

    dispatch({ type: REQUEST_USER_TYPE, payload: res.data });
  };
};

// Action to submit a rating/rank (out of 5) the service recieved by a volunteer
// for a specific appointment. Called from the RatingForm component.
// apptId = the appointment's id (mongoDB _id) that is being rated
// rating = the rating supplied from the patient.
export const submitRating = (apptId, rating) => {
  return async dispatch => {
    // make a post request to the Express route '/api/appointments/submit_rating'
    // with a body containing the appointment ID and the submitted rating
    const res = await axios.post('/api/appointments/submit_rating', {
      apptId,
      rating
    });

    // Reload the dashboard to force a re-render and fetch most recent
    // data for the user.
    window.location.reload();

    dispatch({ type: SUBMIT_RATING, payload: res.data });
  };
};

// Action to cancel an existing appointment.
// Called from the PatientDashboard component.
// apptId = the appointment's ID that the patient wants to cancel.
export const cancelAppointment = apptId => {
  return async dispatch => {
    // Make a post request to the Express route '/api/appointments/cancel'
    // with a body containing the appointment ID
    const res = await axios.post('/api/appointments/cancel', {
      apptId
    });

    // Reload the dashboard to force a re-render and fetch most recent
    // data for the user.
    window.location.reload();

    dispatch({ type: CANCEL_APPOINTMENT, payload: res.data });
  };
};

// Action to cancel a volunteers interest in assisting with an appointment.
// Called from the VolunteerDashboard component.
// apptId = the appointment's ID that the volunteer wants to opt out of.
export const cancelVolunteering = apptId => {
  return async dispatch => {
    // Make a post request to the Express route '/api/appointments/cancel_volunteering'
    // with a body containing the appointment ID.
    const res = await axios.post('/api/appointments/cancel_volunteering', {
      apptId
    });

    // Reload the dashboard to force a re-render and fetch most recent
    // data for the user.
    window.location.reload();

    dispatch({ type: CANCEL_VOLUNTEERING_APPOINTMENT, payload: res.data });
  };
};
