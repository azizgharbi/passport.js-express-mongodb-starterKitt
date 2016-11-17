var User = require('../model/users');
module.exports = function(app, passport){



	app.get('/login', function(req, res){
		res.render('auth/login', { message: req.flash('loginMessage') });
	});
	app.post('/login', passport.authenticate('local-login', {
		successRedirect: '/',
		failureRedirect: '/login',
		failureFlash: true
	}));

	app.get('/signup', function(req, res){
		res.render('auth/signup', { message: req.flash('signupMessage') });
	});


	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect: '/',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	app.get('/profile', isLoggedIn, function(req, res){
		res.render('profile', { user: req.user });
	});



	app.get('/:username/:password', function(req, res){
		var newUser = new User();
		newUser.name = req.params.username;
		newUser.password = req.params.password;
		console.log(newUser.name + " " + newUser.password);
		newUser.save(function(err){
			if(err)
				throw err;
		});
		res.send("Success!");
	});

	app.get('/auth/facebook', passport.authenticate('facebook'));

	app.get('/auth/facebook/login',
	  passport.authenticate('facebook', { successRedirect: '/profile',
	                                      failureRedirect: '/login' }));

	app.get('/logout', function(req, res){
		req.logout();
		res.redirect('/');
	})
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}
