const express = require("express");
const passport = require("passport"); // This works for the authentication
const connectionEnsureLogin = require("connect-ensure-login"); // This serves as authorisation middleware
const bodyParser = require("body-parser");
// const cookieSession = require('cookie-session');
const userModel = require("./models/books"); // Adjust path if needed

const session = require("express-session");

require("dotenv").config(); // This helps to have access to the enviroment variables through the mongoose database

const db = require("./db");

const PORT = 1010;
const app = express();

// Connect to the MONGO db

db.connectToMongoDB();

require("./auth/google"); // This is the Google OAuth Strategy Middleware.
require("./auth/github"); // This is the Github OAuth Strategy Middleware

app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize()); // This is to initialize passport middleware.
app.use(passport.session()); // use passport session middleware.

// This below is to Serialize and deserilise the user object to and from the session

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

const booksRoute = require("./routes/books");

// This below secures the /books route

app.use("/books", connectionEnsureLogin.ensureLoggedIn(), booksRoute); //  connectionEnsureLogin.ensureLoggedIn(), This helps user to access the books when logged in. as middleware

// Googgle Login Start Route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// Google Call back  Auth route Response
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/success",
    failureRedirect: "/",
  })
);

//  Github Login Start Route

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

// Github Call back  Auth route Response

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/failed" }),
  (req, res) => {
    res.redirect("/success");
  }
);

// Succces Route
app.get("/success", (req, res) => {
  if (!req.user) {
    return res.redirect("/"); // Redirect to home page if user not found
  }
  // Output message to the browser on success.
  res.send(`
      <h1>Welcome, ${req.user.displayName || req.user.username}!</h1>
      <p>Your email: ${req.user.email || "Email not available"}</p>
      <img src="${
        req.user.photos ? req.user.photos[0].value : ""
      }" alt="Profile Picture">
      <br><br>
      <a href="/logout">Logout</a>
  `);
});

app.get("/failed", (req, res) => {
  res.send("Failed to Authenticate");
});

// This renders the Home page

app.get("/", (req, res) => {
  res.send("Welcome to the book API");
});

// This renders the login page
app.get(
  "/login/google",
  passport.authenticate("google", {
    scope: ["email", "profile"],
  })
);

// This renders the CallBack page for Google after user logs in.
app.get(
  "/google-auth/callback",
  passport.authenticate("google", {
    failureRedirect: "/failed",
  }),
  (req, res) => {
    res.redirect("/success");
  }
);

// This renders the Logout page

app.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy(); // Destroy session
    res.redirect("/");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started successfully on PORT: http://localhost:${PORT}`);
});
