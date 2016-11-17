var path = require('path');
var express= require('express');
app=express();

// import the ODM mongoose in global
mongoose=require('mongoose');
mongoose.Promise=require('bluebird');
// packge imported
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var exphbs  = require('express-handlebars');
var passport = require('passport');
var flash = require('connect-flash');

//============================================
        /* Let's the game begin */
//============================================

// assets in the public folder
app.use('/static', express.static('public'));
// connexion too database
mongoose.connect('mongodb://localhost/start-kit');
//require passport config
require('./configuration/passport')(passport);

//body-parser & cookieParser
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
// set engine handlebars
app.engine('handlebars', exphbs({defaultLayout: 'default'}));
app.set('view engine', 'handlebars');
//Session
app.use(session({secret: 'blablabla',
				 saveUninitialized: true,
				 resave: true}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// require Routes
require("./routing/AuthRoutes")(app, passport);
require("./routing/routes")(app,passport);


//server connecting
var server = app.listen(3000, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Hi ! the server is running on port "+port);
})


/* promise mongoose
mongoosePromise=promise.promisifyAll(require('mongoose'));
*/
