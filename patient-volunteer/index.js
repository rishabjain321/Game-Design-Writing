// startup file in a node project
// backend server logic to communicate with mongodb
const express = require('express');
const mongoose = require('mongoose');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
const requireLogin = require('./middlewares/requireLogin');
require('./models/User');
require('./models/Appointment');

// this is our User model class to interact with the
// database in our route handlers
const User = mongoose.model('users');

// this is our Appointment model class to interact with the
// database in our route handlers
const Appointment = mongoose.model('appointments');

// connect mongoose with our database
mongoose.connect(keys.mongoURI);

// initialize our Express application
const app = express();

// Tell our Express app that we will be using cookies
// Must provide an expiration date for the cookie,
// as well as a cookie key that we defined.
// 3600000 = 1 hour in miliseconds
app.use(
  cookieSession({
    maxAge: 3600000,
    keys: [keys.cookieKey]
  })
);

// Tell our Express app that we will be making use of passport.
app.use(passport.initialize());

// Tell our Express app that we will be using passport to manage our user sessions
app.use(passport.session());

// Body parser package is needed for accessing req.body properties in post requests
app.use(bodyParser.json());

////////////////////////////////////////////////////////////////////////////////

// Our passport routes + logic
// This approach was based on implementation by Stephen Grider in his course:
// https://www.udemy.com/node-with-react-fullstack-web-development/
// In this course he covers how to deal with cookies, and how to set up
// user authentication with Google+ API.
// This is very similar to the amazing documentation provided by passport:
// http://www.passportjs.org/docs/google/
// We are also instead making use of this package for OAuth 2.0:
// https://github.com/jaredhanson/passport-google-oauth2 which also has great documentation

// take in a user, turn them into a cookie
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// take in a cookie, turn it into a user
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// telling passport to be aware that there is a new strategy available (being google)
// new GoogleStrategy() -> creates a new instance of GoogleStrategy
// GoogleStrategy needs a clientID and clientSecret at the least
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // async await syntax
      // checking to see if a user exists already based on googleID
      const existingUser = await User.findOne({ googleId: profile.id });

      // if user already exists in the system based on googleID unique identifier
      if (existingUser) {
        return done(null, existingUser);
      }

      // if reached here, user does not already exist in the database

      // concat first name + last name provided by google profile
      const userName = profile.name.givenName + ' ' + profile.name.familyName;

      // create a new user in the database, save it
      const user = await new User({
        googleId: profile.id,
        name: userName
      }).save();

      // call done, following passport's conventions
      return done(null, user);
    }
  )
);

////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////

// Our authentication routes:

// This approach was based on implementation by Stephen Grider in his course:
// https://www.udemy.com/node-with-react-fullstack-web-development/

// When client is redirected to /auth/google, kick off the Google+
// authentication flow.
app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

// Must provide a trusted callback URL that Google+ can validate
// Using passport.authenticate() as middleware
// Redirect to the dashboard after a successful login
app.get(
  '/auth/google/callback',
  passport.authenticate('google'),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Because passport automatically binds the currently logged in user to
// req.user -> can simply just call req.logout() to logout. Thanks passport!
// AKA - logout of Google, clear the cookie of any user data
app.get('/api/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// A route to return the currently logged-in user object that is stored in
// req.user by passport
app.get('/api/current_user', (req, res) => {
  res.send(req.user);
});

////////////////////////////////////////////////////////////////////////////////

// route to return all users in the system for the admin dashboard
// query to find all users from:
// https://stackoverflow.com/questions/14103615/mongoose-get-full-list-of-users
// This is a very convenient approach - must send a JSON formatted object back
// to the react client side app.
// User map will be an object of nested objects, one for each user.
app.get('/api/all_users', (req, res) => {
  User.find({}, function(err, users) {
    var userMap = {};

    users.forEach(function(user) {
      userMap[user._id] = user;
    });

    res.send(userMap);
  });
});

// route to return all unaccepted appointments for a given patient
app.get('/api/all_unaccepted_patient_appointments/', (req, res) => {
  Appointment.find({ patientId: req.user._id, volunteerId: 0 }, function(
    err,
    appointments
  ) {
    var apptMap = {};

    appointments.forEach(function(appt) {
      apptMap[appt._id] = appt;
    });

    res.send(apptMap);
  });
});

// route to return all accepted appointments for a given patient
app.get('/api/all_accepted_patient_appointments/', (req, res) => {
  Appointment.find(
    { patientId: req.user._id, volunteerId: { $ne: 0 } },
    function(err, appointments) {
      if (err) {
        console.log('error fetching all accepted patient appointments');
        res.status(422).send(err);
      }
      var apptMap = {};

      appointments.forEach(function(appt) {
        apptMap[appt._id] = appt;
      });

      res.send(apptMap);
    }
  );
});

// create a new appointment in mongo:
app.post('/api/appointments', requireLogin, async (req, res) => {
  // getting the three attributes from req.body
  //console.log('HERE IS THE REQ BODY:', req.body);
  const { title, body, volunteerType, createdAt } = req.body;
  // console.log('req.users _id', req.user._id);
  // console.log('req.users id', req.user.id);
  // create the appointment object (not yet saved in mongo)
  const appointment = new Appointment({
    patientId: req.user._id,
    patientName: req.user.name,
    title, // same as title: title, es6 syntax
    body,
    volunteerType,
    createdAt,
    volunteerId: 0,
    dateCreated: Date.now()
  });

  // console.log('req.users _id 2', req.user._id);
  // console.log('appointment object created: ', appointment);
  // console.log('_id of appointment object', appointment._id);

  try {
    // save the appointment
    await appointment.save();
    // add the appointment to the patients appointment list
    //req.user.appointments.push(appointment._id);
    // save the user with the appointment added
    await req.user.save();
    //console.log('user: ', req.user);
    res.send(req.user);
  } catch (err) {
    // 422 = bad data
    res.status(422).send(err);
  }
});

// route to accept an appointment
// req.user is a volunteer accepting an appointment
// coming in with one param: the appointmentId

// route to return all appointments accepted by a user with specified volunteerId
app.get('/api/all_vol_appointments', requireLogin, async (req, res) => {
  // console.log('Volunteers user id: ');
  // console.log(req.user._id);

  Appointment.find({ volunteerId: req.user._id }, function(err, appointments) {
    var apptMap = {};

    appointments.forEach(function(appt) {
      apptMap[appt._id] = appt;
    });
    // send all appointments accepted by req.user to client
    res.send(apptMap);
  });
});

// route to return all unaccepted appointments looking for a specified volunteer type
app.get('/api/all_spec_vol_appts/:volType', requireLogin, async (req, res) => {
  //console.log('Volunteer type as req.params.volType: ', req.params.volType);

  Appointment.find(
    { volunteerType: req.params.volType, volunteerId: 0 },
    function(err, appointments) {
      var apptMap = {};

      appointments.forEach(function(appt) {
        apptMap[appt._id] = appt;
      });
      // send all appointments accepted by req.user to client
      res.send(apptMap);
    }
  );
});

// route to accept an appointment as a volunteer
// find the appointment,
// set the volunter id in the appointments
// add the appointment id to the volunteers object (STILL NEED TO DO!)
app.post('/api/appointments/accept', requireLogin, async (req, res) => {
  Appointment.findOne({ _id: req.body.apptId }, async function(
    err,
    appointment
  ) {
    if (err) {
      console.log('error finding the appointment!');
      // 422 = bad data
      res.status(422).send(err);
    } else {
      appointment.volunteerId = req.body.volId;
      appointment.volunteerName = req.user.name;
      appointment.acceptedAt = req.body.acceptedAt;
      appointment.waitTime = req.body.waitTime;
      appointment.volunteerRating = req.body.rating;

      await appointment.save();
    }
  });

  // res.send(req.user);

  // send success status
  res.sendStatus(200);
});

// route to change a users account type
app.post('/api/users/change_account_type', requireLogin, async (req, res) => {
  User.findOne({ googleId: req.body.googleId }, async function(err, user) {
    if (err) {
      console.log('error finding the user!');
      // 422 = bad data
      res.status(422).send(err);
    } else {
      if (req.body.accountType != 'none') {
        user.accountType = req.body.accountType;
      }
      user.requested = 'none';

      await user.save();

      // We have now changed the user's account type and removed their pending
      // account type request.
      // Now, find all appointments that the user is a part of and delete the appointment
      // OR remove their affiliation with that appointment.

      // If the user had made an appointment as a patient and then switches to another
      // account type, delete the appointment completely. (nobody to assist!)

      // If the user accepted an appointment as a volunteer and then switched to a new
      // account type, just remove their affiliation with the appointment.
      // Patient still needs assistance even though this volunteer messed up!
      // https://docs.mongodb.com/manual/reference/operator/query/or/
      Appointment.find(
        { $or: [{ patientId: user._id }, { volunteerId: user._id }] },
        async function(err, appts) {
          if (err) {
            console.log('error finding the appointment(s)!');
            res.status(422).send(err);
          } else {
            // we found appointment(s) that the user is either a patient or volunteer for
            // https://www.w3schools.com/js/js_loop_for.asp
            var i;
            for (i = 0; i < appts.length; i++) {
              // if the user is a patient for an appointment, delete the appointment
              if (appts[i].patientId == user._id) {
                appts[i].remove();
              }
              // if the user accepted the appointment as any volunteer type,
              // remove their affiliation with the appointment
              if (appts[i].volunteerId == user._id) {
                appts[i].volunteerId = '0';
                appts[i].volunteerName = '0';
                appts[i].waitTime = '0';
                await appts[i].save();
              }
            }
          }
        }
      );
      // send success status
      res.sendStatus(200);
    }
  });
});

// route to request an account type change
app.post('/api/users/request_account_type', requireLogin, async (req, res) => {
  User.findOne({ googleId: req.body.googleId }, async function(err, user) {
    if (err) {
      console.log('error finding the user!');
      // 422 = bad data
      res.status(422).send(err);
    } else {
      // console.log('user found: ');
      // console.log(user);
      user.requested = req.body.accountType;
      await user.save();
      // res.send({ hey: 'hey' });

      // send success status
      res.sendStatus(200);
    }
  });
});

// route to submit a rating
// find the appointment
// find volunteer for that appointment
// add the rating to the volunteers ratings list
// finally, delete the appointment
app.post('/api/appointments/submit_rating', requireLogin, async (req, res) => {
  Appointment.findOne({ _id: req.body.apptId }, async function(
    err,
    appointment
  ) {
    if (err) {
      console.log('error finding the appointment!');
      res.status(422).send(err);
    } else {
      User.findOne({ _id: appointment.volunteerId }, async function(err, user) {
        if (err) {
          console.log('couldnt find the volunteer!');
          res.status(422).send(err);
        } else {
          // add the patients rating to the list of ratings for one volunteer
          user.ratings.push(req.body.rating);
          await user.save();
          // https://stackoverflow.com/questions/10359907/array-sum-and-average
          // referenced to get average of a list of ints as strings
          // for rounding: http://www.javascripter.net/faq/rounding.htm
          var sum = 0;
          for (var i = 0; i < user.ratings.length; i++) {
            sum += parseInt(user.ratings[i], 10); //don't forget to add the base
          }

          var avg = sum / user.ratings.length;
          var finalAvg = Math.round(10 * avg) / 10;
          user.avgRating = finalAvg + '';
          await user.save();
        }
      });
      appointment.remove();
      // res.send({ hey: 'hey' });

      // send success status
      res.sendStatus(200);
    }
  });
});

// route to cancel an appointment
app.post('/api/appointments/cancel', requireLogin, async (req, res) => {
  Appointment.findOne({ _id: req.body.apptId }, async function(
    err,
    appointment
  ) {
    if (err) {
      console.log('problem finding the appointment!');
      res.status(422).send(err);
    } else {
      // console.log('appt found: ');
      // console.log(appointment);
      appointment.remove();
      //res.send({ hey: 'hey' });

      // send success status
      res.sendStatus(200);
    }
  });
});

// route to cancel a volunteers involvement with an appointment
app.post(
  '/api/appointments/cancel_volunteering',
  requireLogin,
  async (req, res) => {
    Appointment.findOne({ _id: req.body.apptId }, async function(
      err,
      appointment
    ) {
      if (err) {
        console.log('problem finding the appointment!');
        res.status(422).send(err);
      } else {
        appointment.volunteerId = 0;
        appointment.volunteerName = 0;
        await appointment.save();
        // res.send({ hey: 'hey' });

        // send success status
        res.sendStatus(200);
      }
    });
  }
);

// This logic/route below is based on Stephen Grider's MERN Stack course
// This portion is responsible for wiring up our build assets (which are created after
// npm run build is ran in the client application)
// This is needed because in the production ready version of our application, we do not
// have access to all of our components the same way we do in development ->
// they are converted to one static HTML and Javascript file instead! (by webpack)
if (process.env.NODE_ENV === 'production') {
  // Express will serve product assets like main.html or main.css file
  app.use(express.static('client/build'));

  // Express will serve up the html file if it doesn't recognize the route
  // Meaning it is present in the client
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

// if there isnt already an env variable defined by heroku, we must be
// in development so use port 5000
const PORT = process.env.PORT || 5000;

// Hey Express, we want our app to be hosted on the following port ^^^
app.listen(PORT);
