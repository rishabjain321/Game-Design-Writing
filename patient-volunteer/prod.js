// production keys here - DO COMMIT THIS! (for Heroku)
// these reference our production keys stored manually via Heroku dashboard
module.exports = {
  googleClientID: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  mongoURI: process.env.MONGU_URI,
  cookieKey: process.env.COOKIE_KEY
};
