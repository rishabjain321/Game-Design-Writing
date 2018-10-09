**CIS454: Software Implementation
Group 5 - Daniel Stewart, Derek Dumani, Samuel Haws, Rishabh Jain**

This is a patient-volunteering system developed for a class project, following
the _MERN_ stack software architecture.

**MERN Stack**:

* MongoDB for our database
* Express for our backend routes; primarily for interacting with MongoDB and relaying information back to the client, as well as
  external API calls.
* ReactJS for our front end application and user interfaces
* Redux (optional, however this project makes us of it) for client side state management
* Node as a "JavaScript runtime environment – lets you implement your application back-end in JavaScript" https://www.mongodb.com/blog/post/the-modern-application-stack-part-1-introducing-the-mean-stack

**Our development methods/workflow**:

* We followed the Extreme Programming methodology (with slight variation)
  * Instead of pair programming, we programmed everything together as an entire Group
  * Several members had no experience working with these technologies, so this was the most time-efficient solution
* _Why aren't our single contributions stated in-line? (Dan worked on this method: ... , Sam worked on this method: ... , etc)_
  * Because of the methodology stated above, we essentially worked on everything together
  * Everyone was constantly active in discussion as well as coding

**How to run our software for grading and evaluation**:

* **Option 1: Using your local development server (more setup work, but potentially faster)**
  * You will need the following technologies to run and test our system:
    * Node (as well as included npm): [Node.js Official Website](https://nodejs.org/en/)
      * If on a mac, I recommend easy installation via [Homebrew](https://brew.sh/)
    * MongoDB: https://www.mongodb.com/
      * (we have our developlment environment wired up for use with a a local machine instance of MongoDB)
      * Again, if on a mac - I reccommend using Homebrew
      * We also recommend [Mongotron](http://mongotron.io/#/) for checking contents of the database, making initial changes to a user (ONE TIME promoting to an admin, etc)
    * Chrome is recommended as your browser of choice - we have wired up React and Redux chrome developer tools to
      trace changes to our Redux store
  * Once all required technologies are installed, here are the following steps:
    * 1.  Open up the terminal or equivalent shell, and start your local MongoDB instance
      * On mac: sudo mongod
    * 2.  Leaving the terminal running mongoDB open, open up a new terminal window and cd into the root folder of our project titled "server"
      * run the command "npm install" to install all required dependencies for our Express server
    * 3.  One installation in step 2 is complete, cd into "client" and run another "npm install" to install required dependencies for our client side application
    * 4.  cd back into "server", and run "npm run dev" - this should start both our Express server and client side "server" simultaneously, as well as open up the project in localhost:3000
    * 5.  Setup should now be complete! As shown in our demo, we make a one-time manual database manipulation for the user we wish to store as an admin, so go ahead and login to enter yourself in the database, and open up Mongotron or your preferred MongoDB GUI and change your accountType to "super" instead of "patient" (patient is the default)
    * 6.  Only have one gmail account? Not wanting to create more just for the sake of testing this software? We've got you covered.
      * Here are 3 gmail accounts we give you permission to use only for the sake of login in and testing this software:
        * cis400pvtdev1@gmail.com, cis400pvtdev2@gmail.com, cis400pvtdev3@gmail.com
        * Password for all three: patientvolunteering400
* **Option 2: Using our production-ready application hosted on _Heroku_ (less setup work, but potentially slower)**
  * Simply visit [our application hosted on Heroku](https://patient-volunteering.herokuapp.com/)
  * We are making use of [mlab](https://mlab.com/) for our remote (and entirely free) database-as-a-service
    * Login with the following: username: dasiii password: Andrew1995d
    * This is my (Daniel Stewart) personal mlab account - please only access this for the purpose of evaluating this class project.
    * The database wired up for this project is titled "pvt-prod" - feel free to edit and delete documents there as you please!
* _If any questions, concerns, or unanticipated problems arise when trying to run our system - please reach out to dastew02@syr.edu and I will promptly help out!_

**Highlighting each piece of functionality in our application**:

* Upon first starting the system, you will be presented with a Header component showing "Patient Volunteering System", as well as a button labeled "Login" which kicks off the Google OAuth flow. Try loggin in - once you select a Google account to login with you will be redirected to the Dashboard which is rendering the PatientDashboard, signifying that you are a patient (default account type when first registering)
  * Note that if you did not manually select a Google account, it is likely because you only have one account stored on your machine and it has been selected automatically for you
* If this is an account that you would like to be an admin instead (and there is not already an admin in the system), you will need to make a one-time direct database manipulation - select your user, and change the accountType field to "super"
* Admin accounts can view pending account type requests - and either accept or deny. If the admin clicks accept, the user in question's accountType field is changed to the requested account type and the "requested" property is changed to "none". If you do not accept the request, the user's "requested" property is just simply set to "none". Admins are also shown a full list of every user in the system, and can click a button that changes the user's accountType field to the field shown to the admin in each button.
* Patient accounts have more functionality present. They are shown a list of all appointments that they have created that have not been accepted (aka, appointment objects that have a patientId = their user.id, and a volunteerId = 0 (the default patientId)). They are also shown a list of appointments that they have created that a volunteer has accepted (aka, the appointment objects that have a patientId = their user.id, and a volunteerId = the user id of the volunteer that accepted that is != 0). Patients can click "Cancel Appointment" for their pending/unaccepted appointments, which deletes the appointment. For accepted appointments, they are shown an estimated arrival of the volunteer, and the volunteers average rating. They also have two choices for each accepted appointment. They have the option to provide a rating (out of 5), and then click "Send Rating", which will not only do absolutely nothing if a user as not selected a rating value - but if a value is present, clicking the "Send Rating" button will push the rating value into the list of ratings for the volunteer, then delete the appointment. Finally,
  patients can click the "New Appointment" button, which will redirect them to a form which is all wired up with validation testing and other functionalities (like clearing the form values). Once each form value is considered an appropriate input, the user can click "Submit" which will create the new appointment. (Or the user can click cancel and be redirected back to the dashboard they were at previously).
* Volunteer accounts have similar functionality to the patients. They are shown a list of all appointments seeking their specified volunteer type (for example a "specialist" will only be shown unaccepted appointments seeking specialists, and not appointments seeking a "general-practitioner"). If there are any unaccepted appointments following this criteria, the volunteer can input a wait time to represent how long until they are able to assist in minutes, then can click "Accept". The volunteer cannot click Accept unless the form is filled and is an integer. Volunteers are also shown a list of appointments that they have accepted. If they are no longer able to assist, they just click the "Cancel" button, which does not delete the appointment entirely - this action will instead just remove their involvement with the appointment, and will revert the appointment back to unaccepted status so other volunteers have the ability to accept and provide assistance.

**Time to give some credit where it's due**:

We made use of several third party libraries in this assignment, that save us from doing a lot of boilerplate work and make our development process incredibly enjoyable.

**Client side dependencies** (excluding discussion of react, react-scripts, and react-dom which are all pillars of every React app)

* [Create-React-App](https://github.com/facebook/create-react-app)
  * This is a command line tool provided by the engineers at Facebook (the same who actually created and continue to maintain React) to very easily get started creating a React application all wired up with tools like Babel and Webpack for ES6 syntax support, live/hot-reloading, production build procedures, etc.
* [React Router](https://reacttraining.com/react-router/core/guides/philosophy)
  * This is a library that allows us to very easily define and incorporate client side routes in our React application - not to be confused with any routes contained within our Express application and have no relation to each other. (Note that we are using react-router-dom, the version intended for web applications (others are meant for mobile or other types of applications))
* [Redux form](https://redux-form.com/7.3.0/)
  * This is a library that makes form values automatically stored in our Redux store (allowing us to easily access these values again in other components, even though we didn't really do that in this project), as well as providing a great and simplified process with form validation (unacceptable/null values leading error messages, easily clearing form values, etc)
* [Axios](https://github.com/axios/axios)
  * This is a very popular library that we chose to make HTTP requests (get, post, etc) from our React application.
* [Moment](http://momentjs.com/)
  * We actually ran into a huge problem with correctly displaying the estimated arrival times between different operating systems (solution that would work for mac would no longer work for windows, etc). So we used Moment to standardize our timestamps as well as to easily add the wait time in minutes to the previously constructed "moment"
* [React-Redux](https://github.com/reactjs/react-redux)
  * This is a library that provides the "Official React bindings for Redux". In other words - both React and Redux are unopinionated (sp?), meaning that React is in no way built for working with Redux, and Redux is in no way built around being compatible with React. Therefore, using the "react-redux" library allows us to easily wire up our Redux store and all required functionality to our React application.
* [Redux-Thunk](https://github.com/gaearon/redux-thunk)
  * This is a library that provides us a middleware for our Redux action-creators. Essentially, vanilla action-creators simply return an action (a javascript object with an action type, and a payload containing the incoming data) and that's it. However, redux-thunk allows us to dispatch our action to the appropriate reducer whenever we like - in our case, allowing us to make a call to our Express routes (searching for and retrieving data from MongoDB), and then dispatch once a response is received.
* [React-Semantic-UI](https://react.semantic-ui.com/)

  * Semantic-UI is a very modern, clean CSS framework that we are making use of in our project. However, Semantic-UI has even gone one step further and provided us with a complete catalog of "styled components" (premade wrapper/container components) that essentially allow us to write very minimal amounts of CSS, and instead just render our own components and their contents within Semantic's provided styled components. They even offer a very easy to use grid system that we made use of.

  **Server side dependencies** (Express)

* [Body-Parser](https://www.npmjs.com/package/body-parser)
  * This is a library that gives us access to each property including in POST bodies via the syntax "req.body.property", where property one of the fields includes in the POST body. This is really needed for working with POST requests in Express.
* [Concurrently](https://www.npmjs.com/package/concurrently)
  * This is a library that allows us to execute multiple command line statements at once. We are using this to start both development servers (Express and React) at the same time in our custom npm command "npm run dev"
* [Cookie-Session](https://www.npmjs.com/package/cookie-session)
  * We are making use of cookies to store user data that is referenced for authorization to different pages in our application.
* [Mongoose](http://mongoosejs.com/)
  * We are using mongoose for a very nice and simplified experience modeling our collections with mongoose schemas, as well as included MongoDB syntax queries
* [Nodemon](https://nodemon.io/)
  * Express applications do not come with live/hot reloading when you make new changes like Create-React-App provides. For that reason, we use Nodemon to start our Express server so we do not need to manually restart the server everytime a change is made.
* [Passport](http://www.passportjs.org/)
  * We are making use of the passport library (in combination with their Google OAuth 2.0 strategy library) for very easy wiring up to the Google+ API, as well as user storage logic + storing the user in the request body as req.body.user

**Other References**

* Prior to enrolling in CIS454, I (Daniel Stewart) have had a strong interest in developing full stack web applications. I have taken several of Professor [Stephen Grider's](https://www.udemy.com/user/sgslo/) courses on [Udemy](https://www.udemy.com/), which is how I have developed a strong fundamental knowledge and foundation surrounding the React and Redux ecosystem. The main course of his in particular that I had finished prior to working on this patient volunteering system, was [Node with React: Fullstack Web Development](https://www.udemy.com/node-with-react-fullstack-web-development/). In this course, I learned how to wire up each element of the MERN stack, use passport for authentication with Google, structure a project using React Router, as well as wire up a MERN stack application to provide seamless deployment to Heroku - and applied these principles to our patient volunteering system. I have been sure to properly cite and give credit to him (in-line comments) in each portion of our application's code that applies to any work or knowledge that was provided from that course and used in our class project. However, I felt it necessary to also include this section in the README that discusses this further. I am biased to follow his methodology in any projects I have worked on in the past or future (including this project to an extent) due to the fact that he is the one that has taught me everything encompassing web development. This course was absolutely the perfect reference for our class project. Absolutely nothing was taken from this course that has not been properly cited. We as a group have a very strong interest in maintaining academic and moral integrity. If there are any specific questions regarding this topic, please shoot me an email at _dastew02@syr.edu_ and I will be more than glad to answer! While we believe that we have done everything possible to maintain academic integrity in terms of providing Syracuse University staff with the proper information regarding our references etc, we have also personally reached out to Stephen Grider verifying that we can use his best practices and portions of his code (which to be honest, do not deviate much from examples provided in the official documentation of the libraries we are making use of). Professor Grider told us that he has no issues with us using or referencing any content provided in his courses. If you would care to see our email exchange with him, again - please shoot me an email at _dastew02@syr.edu_ and I will gladly forward it your way.

We believe that we have successfully provided an extensive README highlighting our development process, how to run our software, as well as provide in-depth citation regarding the libraries used and materials referenced. Please reach out if there are still any issues/concerns/questions about anything present in this project. Thank you for taking the time to read!
