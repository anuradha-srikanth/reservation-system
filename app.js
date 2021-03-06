var express = require("express");
var http = require('http');
var morgan = require("morgan");
var ejs = require("ejs");
var mongo = require('mongodb');
var mongoose = require('mongoose');
var mongoDB = 'mongodb://asrikant:nodeproject@ds259305.mlab.com:59305/dist';
var fs   = require("fs");
var log = console.log.bind(this);
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

var passport = require('passport');
var session = require('express-session');
var flash    = require('connect-flash');
var LocalStrategy = require('passport-local').Strategy;

//Init App
var app = express();

// View Engine
app.use(morgan('tiny'));
app.set('view engine', 'ejs');

//Set Static Folder
app.use(express.static(__dirname + '/public'));

// Other routes
var generalRoutes = require('./routes/routes.js')
var users = require('./routes/user.js')

app.use(cookieParser());
app.use(bodyParser());

// Express Session information
app.use(session({ 
  secret: 'mySecretKey',
  saveUninitialized: true,
  resave: false }));

//Connect flash
app.use(flash());

//Initialize Passport
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions


var User = require('./models/users');
passport.use('local-login', new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      console.log(user);
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
  ));


passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, 
        // we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true 
        // allows us to pass back the entire 
        //request to the callback
      },
      function(req, username, password, done) {

        // asynchronous
        // User.findOne wont fire unless data is sent back
        process.nextTick(function() {

        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        User.findOne({ 'local.username' :  username }, function(err, user) {
            // if there are any errors, return the error
            if (err)
              return done(err);

            // check to see if theres already a user with that email
            if (user) {
              return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
            } else {

                // if there is no user with that email
                // create the user
                var newUser            = new User();

                // set the user's local credentials
                newUser.local.username    = username;
                newUser.local.password    =  password;
                newUser.username    = username;
                newUser.password    =  password;
                // newUser.generateHash(password);

                // save the user
                newUser.save(function(err) {
                  if (err)
                    throw err;
                  return done(null, newUser);
                });
              }

            });    

      });

      }));


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});


//Connect the database
mongoose.connect(mongoDB, {
  useMongoClient: true
});
//Get the default connection
var db = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function (callback) {
  generalRoutes.init(app, passport);
  users.init(app);
    // require('./routes/user.js').init(app);
  });

app.get("/username", function (req, res) {
  res.send(req.user);
});

/*1*/ var httpServer = http.Server(app);
/*2*/ var sio =require('socket.io');
/*3*/ var io = sio(httpServer);
/*4*/ httpServer.listen(50000, function() {
  console.log('Listening on 50000');
});

var ticketBookingSockets = require('./routes/ticketBooking_server.js');
ticketBookingSockets.init(io);


module.exports = app;






