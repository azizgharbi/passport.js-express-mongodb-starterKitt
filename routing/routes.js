var users=require('../controller/UserController');

module.exports = function(app, passport){
// protected routes
app.get('/',isLoggedIn,users.findAllUserPromise);
app.post('/',isLoggedIn,users.CreateUserPromise);
app.delete('/pow/:id',isLoggedIn,users.destroy);

};

//authentication function
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()){
		return next();
	}
	res.redirect('/login');
}
