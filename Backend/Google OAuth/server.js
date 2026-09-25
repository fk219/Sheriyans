// Express helps us create the web server and its URLs (routes).
import express from "express"

// dotenv loads private values from our .env file into process.env.
import {config} from "dotenv"

// Passport is a tool that helps us add login systems to our app.
import passport from "passport"

// This is Passport's special strategy for logging in with Google.
import {Strategy as GoogleStrategy} from "passport-google-oauth20"

// Create an Express application.
const app = express ()

// Read variables from the .env file, such as GOOGLE_CLIENT_ID and
// GOOGLE_CLIENT_SECRET. These credentials should not be hard-coded.
config()

// Our server will listen for requests on port 3000.
const port = 3000

// Add Passport to Express so Passport can handle authentication requests.
// This must be done before using passport.authenticate() below.
app.use(passport.initialize())

// Tell Passport how Google login should work in this application.
// clientID and clientSecret identify our app to Google.
// callbackURL is where Google sends the user after login.
// The callback function receives the Google profile and tells Passport
// whether authentication succeeded.
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
}, (_accessToken, _refreshToken, profile, done) => {
    return done(null, profile)
}));

// This route is only a quick way to check that our server is running.
// req means request and res means response.
app.get('/', (req, res) => {
    res.send('Server is Up & Running!!')
})

// Step 1: the user visits /auth/google to start logging in.
// Passport redirects the user from our app to Google's login page.
// The scopes tell Google which user information our app wants.
app.get('/auth/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}))

// Step 2: Google redirects the user back to this route after login.
// Passport checks Google's response and runs the GoogleStrategy callback.
// If login fails, the user is sent back to the home page.
// session: false means we are not saving the login in a session.
// When authentication succeeds, Passport puts the profile in req.user.
app.get('/auth/google/callback', 
    passport.authenticate('google', {
        failureRedirect: '/',
        session: false
    }),
    (req, res) => {
        console.log('User Profile:', req.user)
        res.send('Google Authentication Successful!')
    }
)

// Start the server and wait for browser requests.
// The message inside this function appears after the server starts.
app.listen(port, () => {
    console.log(`Server is Running at http://localhost:${port}`)
})


