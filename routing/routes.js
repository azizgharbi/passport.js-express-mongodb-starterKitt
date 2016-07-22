var users=require('../controller/UserController');
module.exports = function(app, passport){

app.get('/',isLoggedIn,users.findAllUserPromise);
app.post('/',isLoggedIn,users.CreateUserPromise);
app.get('/:id',isLoggedIn,users.DeleteUserPromise);

};

//authentication function

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}

	res.redirect('/login');
}
