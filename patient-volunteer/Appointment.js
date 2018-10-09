// This is the model for the Appointments stored in mongo
// Making use of mongoose.js to easily define Schemas (what the model shoud
// be structured like)

const mongoose = require("mongoose");
// code below is equivalent to: const Schema = mongoose.Schema;
const { Schema } = mongoose;

// different schema fields:
//// patientId: the user._id of the patient
//// patientName: the first and last name of the patient
//// volunteerId: the user._id of the volunteer, defaults to 0 if no volunteer has accepted yet
//// volunteerName: the first and last name of the volunteer, defaults to 0 if no volunteer has accepted yet
//// waitTime: wait time in minutes
//// title: title of the appointment ex. "Looking for help with ___"
//// body: a more in depth explanation of the assistance desired by patient
//// volunteerType: the specific volunteer type that the patient wants help from
//// createdAt: the time the appointment was created (patient initiated)
//// acceptedAt: the time that the appointment was accepted (volunteer initiated)
//// volunteerRating: the avg rating of the volunteer at the time of accepting the appointment

const appointmentSchema = new Schema({
  patientId: String,
  patientName: String,
  volunteerId: { type: String, default: 0 },
  volunteerName: { type: String, default: 0 },
  waitTime: { type: String, default: 0 },
  title: String,
  body: String,
  volunteerType: String,
  createdAt: String,
  acceptedAt: String,
  volunteerRating: String
});

// create a mongoDB collection called 'appointments' and apply the schema
mongoose.model("appointments", appointmentSchema);
