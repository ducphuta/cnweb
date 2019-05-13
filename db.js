var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/cnweb');
const userSchema = new mongoose.Schema({
	user: String,
	password: String,
	name: String
})

const mesSchema = new mongoose.Schema({
	accsend: String,
	accreic: String,
	content: String,
	time: Date,
})

const user = mongoose.model('account', userSchema)
const mess = mongoose.model('message', mesSchema)
// mess.create([
// 	{accsend: "20163180", accreic: "20163000", content: "hello", time: "06/05/2019"}

// ]);

user.find().exec((err, users) => {
	users.forEach(function(row){
		console.log(row.name);
	});
});
