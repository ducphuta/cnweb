var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var dburl = undefined;
exports.connect = function(thedburl, callback){
	dburl = thedburl;
	mongoose.connect(dburl);
}

exports.disconnect = function(callback){
	mongoose.disconnect(callback);
}

var UserSchema = new Schema({
	user : String,
	password: String,
	name: String
});

mongoose.model('accounts', UserSchema);
var User = mongoose.model('accounts');

exports.create = function(user, password, name, callback){
	var newUser = new User();
	newUser.user = user;
	newUser.password = password;
	newUser.name = name;
	newUser.save(function(err){
		if (err) {
			callback(err);
		}
		else callback();
	});
}

exports.update = function(user, password, name, callback){
	exports.read(user, function(err,doc){
		if (err) {
			callback(err);
		}
		else {
			doc.user = user;
			doc.password = password;
			doc.name = name;
			doc.save(function(err){
				if (err) {
					callback(err);
				}
				else callback();
			});
		}
	});
}

exports.read = function(user1, callback){
	User.findOne({user : user1}, function(err, doc){
		if (err) {
			callback(err);
		}
		else callback(null, doc);
	});
}

exports.destroy = function(user1, callback){
	exports.read(user1, function(err, doc){
		if (err) {
			callback(err);
		}
		else{
			doc.remove();
			callback();
		}
	});
}

exports.titles = function(callback){
	User.find().exec(function(err, docs){
		if (err) {
			callback(err);
		}
		else{
			if (docs) {
				var userList = [];
				docs.forEach(function(user){
					userList.push({
						user : user.user;
						password : user.password;
						name : user.name
					});
				});
				callback(null,userList);
			}
			else {
				callback();
			}
		}
	});
}