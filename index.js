var express = require("express");
var app = express();
var mongoose = require("mongoose");
var path = require("path");
var obj = {};
var objname = {};
var messagelist = new Object();

messagelist.AddMessage = function(accsend, accreic, content, time){
	this.accsend = accsend;
	this.accreic = accreic;
	this.content = content;
	this.time = time;
}

mongoose.connect('mongodb://localhost/cnweb');
const userSchema = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	user: String,
	password: String,
	name: String
})

const friendSchema = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	account1: String,
	account2: String
})

const messSchema = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	accsend: String, 
	accreic: String, 
	content: String,
	time: String
})

const comSchema = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	account : String,
	name : String,
	content : String,
	date : String,
	time : String,
	idpost : mongoose.Schema.Types.ObjectId
})

const postSchemar = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	account : String,
	name : String,
	content : String,
	date : String,
	time : String
})

const requestSchemar = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	accsend : String,
	accreic : String
})

const likeSchemar = new mongoose.Schema({
	_id : mongoose.Schema.Types.ObjectId,
	acc : String,
	idpost : String
})

const message = mongoose.model('message', messSchema)
const user = mongoose.model('account', userSchema)
const friend = mongoose.model('addfriends', friendSchema)
const comment = mongoose.model('comments', comSchema)
const post = mongoose.model('posts', postSchemar)
const requestfri = mongoose.model('requestfris', requestSchemar)
const like = mongoose.model("likes", likeSchemar);
app.listen(3000);

var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
// cau hinh EJS
app.use(express.static(path.join(__dirname,'/public')));
app.set("view engine", "ejs");
app.set("views", "./views");


app.get("/message", function(req, res){
var mang = [];
var mangten = [];
var mangacc = [];
var list = [];
	friend.find().exec((err, users) => {
		users.forEach(function(row){
			if(row.account1 === obj.value){
				mang.push(row.account2);
			}
			else if(row.account2 === obj.value)
			{
				mang.push(row.account1);
			}
		});
	});
	message.find().exec((err, mess) => {
 	mess.forEach(function(row){
 		if(((row.accsend === obj.value) && (row.accreic === mang[0])) || ((row.accsend === mang[0]) && (row.accreic === obj.value))){
 			list.push(row);
 		}
 	});
 });

	user.find().exec((err, users) => {
	users.forEach(function(row){
		if (mang.indexOf(row.user) != -1) {
			mangten.push(row);
		}
	});
	var data = {
		hoten: mangten,
		first: mangten[0].name,
		firstacc : mang[0],
		listmess: list,
		mainacc: obj.value,
		mainname: objname.value

	};
	res.render("message",data);
});	
});


app.get("/messages", function(req, res){
var mang1 = [];
var mangten1 = [];
var mangacc1 = [];
var list1 = [];
	friend.find().exec((err, users) => {
		users.forEach(function(row){
			if(row.account1 === obj.value){
				mang1.push(row.account2);
			}
			else if(row.account2 === obj.value)
			{
				mang1.push(row.account1);
			}
		});
	});
	response = {
		accsend : req.query.accsend,
		namesend : req.query.namesend
	}
	message.find().exec((err, mess) => {
 	mess.forEach(function(row){
 		if(((row.accsend === obj.value) && (row.accreic === response.accsend)) || ((row.accsend === response.accsend) && (row.accreic === obj.value))){
 			list1.push(row);
 		}
 	});
 });

	user.find().exec((err, users) => {
	users.forEach(function(row){
		if (mang1.indexOf(row.user) != -1) {
			mangten1.push(row);
		}
	});
	console.log(mang1);
	console.log(mangten1);
	var data = {
		hoten: mangten1,
		first: response.namesend,
		firstacc : response.accsend,
		listmess: list1,
		mainacc: obj.value,
		mainname: objname.value

	};
	res.render("message",data);
});	
});


app.get("/", function(req, res){
	res.render("login");
})
app.get("/index", async function(req, res){
	var mangpost = [];
	var mang1 = [];
	var mang2 = [];
	var mangcmt = [];
	response = {
		username : req.query.username,
		password : req.query.pass
	};
	change(obj, response.username);

	
	await comment.find().exec((err, comments) =>{
		comments.forEach(function(row){
			mangcmt.push(row);
		});
	});


    friend.find().exec((err, users) => {
		users.forEach(function(row){
			if(row.account1 === obj.value){
				mang1.push(row.account2);
			}
			else if(row.account2 === obj.value)
			{
				mang1.push(row.account1);
			}
			
		});
	});

	user.find().exec((err, users) => {
				users.forEach(function(row){
					if (mang1.indexOf(row.user) != -1) {

					}
					else {
						if(row.user != obj.value){
							mang2.push(row);
							console.log(row);

						}
					}
				});
			});
	

	post.find().exec((err, posts) => {
		posts.forEach(function(row){
			mangpost.push(row);
		});
		mangpost.reverse();
	
	user.findOne({'user' : response.username}, 'user password name', function(err, users){
		if(err){
			res.render("login");
		}
		if (response.password === users.password)
		{
			change(objname, users.name);
		    var data = {
		    	post : mangpost,
		    	users : users,
		    	manggoiy : mang2,
		    	mangcmt : mangcmt

		    };
		    console.log(mangcmt);
			res.render("index", data);
		}
		else {res.render("login");}

});
	});
});
app.get("/index1", async function(req, res){
	var mangpost = [];
	var mang1 = [];
	var mang2 = [];
	var mangcmt = [];
	console.log(obj);
	await comment.find().exec((err, comments) =>{
		comments.forEach(function(row){
			mangcmt.push(row);
		});
	});
	 friend.find().exec((err, users) => {
		users.forEach(function(row){
			if(row.account1 === obj.value){
				mang1.push(row.account2);
			}
			else if(row.account2 === obj.value)
			{
				mang1.push(row.account1);
			}
			
		});
	});

	user.find().exec((err, users) => {
				users.forEach(function(row){
					if (mang1.indexOf(row.user) != -1) {

					}
					else {
						if(row.user != obj.value){
							mang2.push(row);

						}
					}
				});
			});
	user.findOne({'user' : obj.value}, 'user password name', function(err, users){
			if (err) {
				console.log("bye");
			}
			else {
				post.find().exec((err, posts) => {
		        posts.forEach(function(row){
			    mangpost.push(row);
		        });
				mangpost.reverse();
				var data = {
					post : mangpost,
					users : users,
					manggoiy : mang2,
					mangcmt : mangcmt
				}
				res.render("index",data);
			});
			}
		});
});

app.get("/post", async function(req, res){
	var d = new Date();
	var mangcmt = [];
	var month = d.getMonth() + 1;
	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	var date = d.getDate() + "/" + month + "/" + d.getFullYear();
	await comment.find().exec((err, comments) =>{
		comments.forEach(function(row){
			mangcmt.push(row);
		});
	});
	response = {
		user : req.query.account,
		name : req.query.name,
		content : req.query.description
	}

	await post.create({
		_id : new mongoose.Types.ObjectId(),
		account : response.user,
		name : response.name,
		content : response.content,
		date : date,
		time : time
	});
	var mangpost = [];
	var mang1 = [];
	var mang2 = [];
	console.log(obj);
	await friend.find().exec((err, users) => {
		users.forEach(function(row){
			if(row.account1 === obj.value){
				mang1.push(row.account2);
			}
			else if(row.account2 === obj.value)
			{
				mang1.push(row.account1);
			}
			
		});
	});

	await user.find().exec((err, users) => {
				users.forEach(function(row){
					if (mang1.indexOf(row.user) != -1) {

					}
					else {
						if(row.user != obj.value){
							mang2.push(row);

						}
					}
				});
			});
	mang2.reverse();
	await user.findOne({'user' : obj.value}, 'user password name', function(err, users){
			if (err) {
				console.log("bye");
			}
			else {
				post.find().exec((err, posts) => {
		        posts.forEach(function(row){
			    mangpost.push(row);
		        });
		        mangpost.reverse();
				
				var data = {
					post : mangpost,
					users : users,
					manggoiy : mang2,
					mangcmt : mangcmt
				}
				res.render("index",data);
			});
			}
		});
});

app.get("/send", function(req, res){
	response = {
		ten : req.query.ten
	};
	res.end(JSON.stringify(response));
})
// });
app.get("/test", function(req, res){
	response = {
		acc : req.query.accmain
	};
	console.log(response.acc);
	console.log(obj.value);
})
app.get('/process_get', async function(req, res){
	var d = new Date();
	var date = d.getDate() + "/" + d.getMonth() + "/" + d.getFullYear();
	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	var c = time + " " + date;
	var mang1 = [];
    var mangten1 = [];
    var mangacc1 = [];
    var list1 = [];
	response = {
		noidung : req.query.message,
		accsend : req.query.accsend,
		accreic : req.query.accreic,
		namereic : req.query.namereic 
	};
	await message.create({
		_id : new mongoose.Types.ObjectId(),
		accsend: response.accsend,
		accreic: response.accreic,
		content: response.noidung,
		time: c

	});
	friend.find().exec((err, users) => {
		users.forEach(function(row){
			if(row.account1 === obj.value){
				mang1.push(row.account2);
			}
			else if(row.account2 === obj.value)
			{
				mang1.push(row.account1);
			}
		});
	});
	message.find().exec((err, mess) => {
 	mess.forEach(function(row){
 		if(((row.accsend === obj.value) && (row.accreic === response.accreic)) || ((row.accsend === response.accreic) && (row.accreic === obj.value))){
 			list1.push(row);
 		}
 	});
 });

	user.find().exec((err, users) => {
	users.forEach(function(row){
		if (mang1.indexOf(row.user) != -1) {
			mangten1.push(row);
		}
	});
	console.log(mang1);
	console.log(mangten1);
	var data = {
		hoten: mangten1,
		first: response.namereic,
		firstacc : mang1[0],
		listmess: list1,
		mainacc: obj.value,
		mainname: objname.value


	};
	res.render("message",data);
});	
	// console.log(response);
	// res.end(JSON.stringify(response));
});
function change(obj, next){
	obj.value = next;
}

app.get('/sendComment', async function(req, res){
	var d = new Date();
	var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
	var date = d.getDate() + "/" + d.getMonth() + "/" +d.getFullYear();
	response = {
		content : req.query.content,
		accpost : req.query.accpost,
		idpost : req.query.idpost
	}
	console.log(response.accpost);
	
	await comment.create({
		_id : new mongoose.Types.ObjectId(),
		account : obj.value,
		name : objname.value,
		accpost : response.accpost,
		content : response.content,
		date : date,
		time : time,
		idpost : response.idpost

	});

	var mangpost = [];
	var mang1 = [];
	var mang2 = [];
	var mangcmt = [];
	console.log(obj);
	await comment.find().exec((err, comments) =>{
		comments.forEach(function(row){
			mangcmt.push(row);
		});
	});
	 friend.find().exec((err, users) => {
		users.forEach(function(row){
			if(row.account1 === obj.value){
				mang1.push(row.account2);
			}
			else if(row.account2 === obj.value)
			{
				mang1.push(row.account1);
			}
			
		});
	});

	await user.find().exec((err, users) => {
				users.forEach(function(row){
					if (mang1.indexOf(row.user) != -1) {

					}
					else {
						if(row.user != obj.value){
							mang2.push(row);

						}
					}
				});
			});
	user.findOne({'user' : obj.value}, 'user password name', function(err, users){
			if (err) {
				console.log("bye");
			}
			else {
				post.find().exec((err, posts) => {
		        posts.forEach(function(row){
			    mangpost.push(row);
		        });
				mangpost.reverse();
				var data = {
					post : mangpost,
					users : users,
					manggoiy : mang2,
					mangcmt : mangcmt
				}
				res.render("index",data);
			});
			}
		});

});



