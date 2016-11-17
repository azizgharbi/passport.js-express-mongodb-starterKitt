var bcrypt = require('bcrypt');


userSchema = new mongoose.Schema({
  name:String,
  password: String,
  email:String,

  facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	}

});

// bcrypt function

userSchema.methods.generateHash = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(9));
}

userSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
}

var User = mongoose.model('User', userSchema);
module.exports = User;
