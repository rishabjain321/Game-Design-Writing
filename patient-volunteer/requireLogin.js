// Express makes it very easy to make custom middlewares that
// are evaluated before a route handler is executed.
// This middleware verifies that a user is logged in!
// One of the middlewares taught by Stephen Grider

// next is called when the middleware is done (like done in passport)
module.exports = (req, res, next) => {
  // if there is not a user assigned by passport already:
  if (!req.user) {
    // send unauthorized status, and error message
    return res.status(401).send({ error: 'You must be logged in.' });
  }
  next();
};
