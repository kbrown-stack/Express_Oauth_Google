const express = require("express");
const passport = require("passport"); // This works for the authentication
const connectionEnsureLogin = require("connect-ensure-login"); // This serves as authorisation middleware
const bodyParser = require("body-parser");
// const cookieSession = require('cookie-session');
const session = require('express-session');

require("dotenv").config(); // This helps to have access to the enviroment variables through the mongoose database

const db = require("./db");

const PORT = 1010;
const app = express();

// Connect to the MONGO db

db.connectToMongoDB();

require('./auth/google') // This is the Google OAuth Strategy Middleware.

app.use(session({
    secret: "secret key here",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));



app.use(bodyParser.urlencoded({ extended: true }));

app.use(passport.initialize()); // This is to initialize passport middleware.
app.use(passport.session()); // use passport session middleware.




// This below is to Serialize and deserilise the user object to and from the session

// passport.serializeUser(userModel.serializeUser()); // This is like getting back the object.
// passport.deserializeUser(userModel.deserializeUser());
const booksRoute = require("./routes/books");

// This below secures the /books route

app.use("/books", connectionEnsureLogin.ensureLoggedIn(), booksRoute); //  connectionEnsureLogin.ensureLoggedIn(), This helps user to access the books when logged in. as middleware


//Then this renders the home page

app.get("/", (req, res) => {
  res.send("Welcome to the book API");
});

app.get("/success", (req,res) => {
    console.log(req.user);
    // res.send('Welcome ${req.user.email}');
    res.send(`Welcome ${req.user.email}`);
})

app.get("/failed", (req,res) => {
    res.send('Failed to Authenticate');
    
})

// This renders the login page

app.get("/login/google", 
    passport.authenticate('google', {
        scope: 
        ['email', 'profile']
    }
    ));

    // app.get("/login/github", 
    //     passport.authenticate('github', {
    //         scope: 
    //         ['email', 'profile']
    //     }
    //     ));

    app.get('/google-auth/callback', passport.authenticate('google', {
        failureRedirect: '/failed',
    }),
     (req, res) => {
        res.redirect('/success')
    }
);

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.session.destroy(); // Destroy session
        res.redirect("/");
    });
});
 


app.listen(PORT, () => {
  console.log(`Server started successfully on PORT: http://localhost:${PORT}`);
});
