exports.init = function(app, passport) {

    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res) {
        res.render('index.ejs'); // load the index.ejs file
    });

    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login.ejs', { message: req.flash('loginMessage') }); 
    });


    app.post('/login',
      passport.authenticate('local'),
      function(req, res) {
        // If this function gets called, authentication was successful.
        // `req.user` contains the authenticated user.
        console.log("signed in");
        res.redirect('/users/' + req.user.username);
    });

    // process the login form
    // app.post('/login', 
    //     passport.authenticate('local', { 
    //         successRedirect: '/',
    //         failureRedirect: '/login', 
    //         failureFlash: "Invalid username or password" ,
    //         successFlash: "Welcome!"
    //     }));

//     var authenticate = function(request, response){
//         console.log('hello')
//         passport.authenticate('local', { 
//             successRedirect: '/',
//             failureRedirect: '/login', 
//             failureFlash: "Invalid username or password" ,
//             successFlash: "Welcome!"});
//     // res.redirect('/users/' + req.user.username);
// }

    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    app.get('/signup', function(req, res) {

        // render the page and pass in any flash data if it exists
        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });

    // process the signup form
    // app.post('/signup', do all our passport stuff here);

    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}
