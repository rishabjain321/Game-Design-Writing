// keys.js - figure out which set of credentials to use (dev vs prod)
// this approach was taught to me by Stephen Grider, with the intention of keeping
// private keys private!
if (process.env.NODE_ENV === 'production') {
  // we are in production, return the prod set of keys
  module.exports = require('./prod');
} else {
  // we are in development, return the dev set of keys
  module.exports = require('./dev');
}
