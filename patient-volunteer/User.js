// This is the model for the Users stored in mongo
// Making use of mongoose.js to easily define Schemas (what the model shoud
// be structured like)

const mongoose = require('mongoose');
// code below is equivalent to: const Schema = mongoose.Schema;
const { Schema } = mongoose;
var ObjectId = mongoose.Schema.Types.ObjectId;

// different account types:
//// - 'super' (admin)
//// - 'patient' (default for new users),
//// -  volunteers ('virtual-specialist', 'specialist', or 'general-practitioner')
// super user handles changing account types if requested internally to the system

// different schema fields:
//// googleId: googleId provided by googleId
//// name: "First Name" + " " + "Last Name", provided by google
//// accountType: see above
//// requested: the desired account type the user wants to be switched to
//// ratings: a list of ratings (for a volunteer) each submitted by a patient
//// avgRating: an average rating for the volunteer

const userSchema = new Schema({
  googleId: String,
  name: String,
  accountType: { type: String, default: 'patient' },
  requested: { type: String, default: 'none' },
  ratings: [String],
  avgRating: { type: String, default: 'Not yet rated!' }
});

// create a mongoDB collection called 'users' and apply the schema
mongoose.model('users', userSchema);
