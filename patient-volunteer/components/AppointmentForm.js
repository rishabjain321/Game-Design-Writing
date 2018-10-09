// This is a component wired up with redux-form, a library with great documentation
// and easy to incorporate validation testing and connecting form values
// to the redux store.

import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { withRouter } from 'react-router-dom';
import { Form, Grid, Button } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

function validate(values) {
  const errors = {};

  if (!values.title) {
    errors.title = 'You must provide a title';
  }

  if (!values.body) {
    errors.body = 'You must provide an appointment body';
  }

  // only checking that the field is filled out currently, must check if it is a defined
  // volunteer type!
  if (!values.volunteerType) {
    errors.volunteerType =
      'You must specify which type of volunteer you are wanting assistance from';
  }

  return errors;
}

// This is a functional component that is based on the
// implementation in the redux-form docs:
// https://redux-form.com/7.3.0/examples/submitvalidation/
// This essentially tells the text field inputs (for title and body) what
// to look like.
const renderField = ({
  customPlaceholder,
  input,
  label,
  type,
  meta: { touched, error, warning }
}) => (
  <div>
    <label>{label}</label>
    <div>
      <input
        {...input}
        placeholder={customPlaceholder}
        type={type}
        style={{ 'margin-top': '15px', 'margin-bottom': '10px' }}
      />
      <div
        style={{ 'margin-top': '5px', 'margin-bottom': '10px', color: 'red' }}
      >
        {touched && (error && <span>{error}</span>)}
      </div>
    </div>
  </div>
);

// This is a functional component that is based on the
// implementation in the redux-form docs:
// https://redux-form.com/7.3.0/examples/submitvalidation/
// Render 2 text inputs, and one select input.
// handleSubmit points to the 'submit' function in parent component AppointmentNew
let AppointmentForm = props => {
  const { handleSubmit, pristine, reset, submitting } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <Field
        name="title"
        component={renderField}
        type="text"
        label="Appointment Title"
        customPlaceholder="Give your appointment a title."
      />

      <Field
        name="body"
        component={renderField}
        type="text"
        label="Appointment Body"
        customPlaceholder="Let us know more about what you need assistance with."
      />
      <label>Volunteer Type</label>
      <Grid columns={3}>
        <Grid.Row>
          <Grid.Column />
          <Grid.Column>
            <Field
              name="volunteerType"
              component="select"
              style={{ 'margin-top': '15px', 'margin-bottom': '10px' }}
            >
              <option />
              <option value="specialist">Specialist</option>
              <option value="virtual-specialist">Virtual Specialist</option>
              <option value="general-practitioner">General Practitioner</option>
            </Field>
          </Grid.Column>
          <Grid.Column />
        </Grid.Row>
      </Grid>
      <div style={{ 'margin-top': '15px', 'margin-bottom': '10px' }}>
        <Link to="/dashboard">
          <Button color="red" style={{ 'margin-right': '5px' }}>
            Cancel
          </Button>
        </Link>
        <Button
          color="yellow"
          type="button"
          disabled={pristine || submitting}
          onClick={reset}
          style={{ 'margin-right': '5px' }}
        >
          Clear Values
        </Button>
        <Button color="green" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

// link the component up to redux-form and export it
AppointmentForm = reduxForm({
  // a unique name for the form
  form: 'appointmentForm',
  validate
})(AppointmentForm);

export default AppointmentForm;
