var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;


var User= require('../model/users');
var configFacbook = require('./auth');

module.exports = function(passport) {


	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});

// Signup Strategy

	passport.use('local-signup', new LocalStrategy({
		usernameField: 'email',
		passwordField: 'password',
		passReqToCallback: true
	},
	function(req, email, password, done){
		process.nextTick(function(){
			User.findOne({'email': email}, function(err, user){
				if(err)
					return done(err);
				if(user){
					return done(null, false, req.flash('signupMessage', 'That email already taken'));
				} else {
					var newUser = new User();
					newUser.email = email;
					newUser.name=req.body.name;
					newUser.password = newUser.generateHash(password);

					newUser.save(function(err){
						if(err)
							throw err;
						return done(null, newUser);
					})
				}
			})

		});
	}));
//Login Strategy
	passport.use('local-login', new LocalStrategy({
			usernameField: 'email',
			passwordField: 'password',
			passReqToCallback: true
		},
		function(req, email, password, done){
			process.nextTick(function(){
				User.findOne({ 'email': email}, function(err, user){
					if(err)
						return done(err);
					if(!user)
						return done(null, false, req.flash('loginMessage', 'No User found'));
					if(!user.validPassword(password)){
						return done(null, false, req.flash('loginMessage', 'inavalid password'));
					}
					return done(null, user);

				});
			});
		}
	));

// Facebook Strategy

passport.use(new FacebookStrategy({
	    clientID: configFacbook.facebookAuth.clientID,
	    clientSecret: configFacbook.facebookAuth.clientSecret,
	    callbackURL: configFacbook.facebookAuth.callbackURL
	  },
	  function(accessToken, refreshToken, profile, done) {
	    	process.nextTick(function(){
	    		User.findOne({'facebook.id': profile.id}, function(err, user){
	    			if(err)
	    				return done(err);
	    			if(user)
	    				return done(null, user);
	    			else {
							console.log(profile);
	    				var newUser = new User();
	    				newUser.facebook.id = profile.id;
	    				newUser.facebook.token = accessToken;
	    				newUser.facebook.name = profile.displayName;
	    				//newUser.facebook.email = profile.emails[0].value;

	    				newUser.save(function(err){
	    					if(err)
	    						throw err;
	    					return done(null, newUser);
	    				})
	    				console.log(profile);
	    			}
	    		});
	    	});
	    }

	));

};
