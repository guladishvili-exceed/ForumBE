const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Users = require('./models/Users/users')
const Posts = require('./models/Posts/posts')
const Comment = require('./models/Comment/comment')
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const verify = require('./verifyToken')
const app = express()
const multer = require('multer')
const path = require('path')
const fileUrl = require('file-url');


app.engine('handlebars', exphbs({defaultLayout: "main"}))
app.set('view engine', 'handlebars')
app.use(bodyParser.json());
app.use(cors())

app.use('/uploads', express.static('uploads'))

//Uploads

const storage = multer.diskStorage({
	destination: './uploads',
	filename: (req, file, cb) => {
		cb(null, file.fieldname + "-" + Date.now() + ".jpeg" +
			path.extname(file.originalname));
	}
})

// Init upload

const upload = multer({
	storage: storage,
	fileFilter: (req, file, cb) => {
		checkFileType(file, cb)
	}
}).single('avatar')

// Check file type

const checkFileType = (file, cb) => {
	// Allowed extensions
	const fileTypes = /jpeg|jpg|png|gif/;
	//Check extensions
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
	//Check mimeType
	const mimetype = fileTypes.test(file.mimetype)

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		return cb("Error: Images Only")
	}

}


//Database
const db = require('./config/database')


//Test DB

db.authenticate().then(() => {
	console.log('Database conntected')
}).catch((err) => {
	console.log('error', err)
})


//Get Home Page
app.get('/', verify, (req, res) => {
	Users.findAll()
		.then((users) => {
			console.log(users)
			res.status(200).send('Access Granted')
		})
		.catch((err) => console.log('--------err', err))
})

//Add user
app.post('/addUser', async (req, res) => {
	const usernameExist = await Users.findOne({
		where: {
			username: req.body.username
		}
	})
	if (usernameExist) {
		return res.status(400).send("Email already exist");
	}
	//Hash password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);
	// - - - - - - - - - - - - -
	const addUser = Users.create({
		username: req.body.username,
		password: hashPassword,
		role: "user"
	})
	try {
		res.status(200).send(addUser)
	} catch (err) {
		res.status(404).send(err)
	}


})
//Log In
app.post('/logIn/:username', async (req, res) => {
	//Check is username is valid
	const user = await Users.findOne({where: {username: req.body.username}})
	//Username is not valid
	if (!user) {
		return res.status(400).send('Invalid username')
	}
	//Password validation
	const validPass = await bcrypt.compare(req.body.password, user.password)
	//Password is not valid
	if (!validPass) {
		return res.status(400).send('Invalid password')
	}
	//Create and assign token
	const token = jwt.sign({user}, "secretKey")
	res.header("auth-token", token).send(token)

})

// Get Current User Profile
app.get('/getUser/:id', (req, res) => {
	Users.findOne({
		where: {
			id: req.params.id
		},
		attributes: ['avatar', 'username', 'role','gender','age','name']
	})
		.then((user) => {
			res.send(user)
		})
		.catch((err) => {
			console.log('--------err', err);
		})
})

//Get All Users
app.get('/getUsers/', (req, res) => {

	Users.findAll({})
		.then((users) => {
			res.send(users)
		})
		.catch((err) => {
			console.log('--------err', err);
		})

})

//Delete Single Users 
app.delete('/deleteUser/:id', (req, res) => {
	Users.destroy({
		where: {
			id: req.params.id
		}
	})
		.then((user) => {
			res.sendStatus(200)
		})
		.catch((err) => {
			console.log('--------err', err);
		})
})

//Update User Role 
app.put('/updateUserRole/:id', (req, res) => {
	Users.update({
			role: req.body.role
		},
		{
			where: {
				id: req.params.id
			}
		})
		.then((user) => {
			res.send(user)
		})
		.catch((err) => {
			console.log('--------err', err);
		})
})


//Create Topic
app.post('/addPost', async (req, res) => {
	//Create new post
	const addPost = Posts.create({
		title: req.body.title,
		description: req.body.description,
		username: req.body.username
	})
	try {
		res.status(200).send(addPost)
	} catch (err) {
		res.status(404).send(err)
	}

})

//Get all topics on page

app.get('/getPost', (req, res) => {
	Posts.findAll({})
		.then((post) => {
			res.status(200).send(post);
		})
		.catch((err) => {
			console.log("err", err);
		});
})

//Get topic desc and title

app.get('/getTopic/:id', (req, res) => {
	Posts.findOne({
		where: {
			id: req.params.id
		},
		attributes: ['description', 'title', 'username', 'id']
	})
		.then((post) => {
			res.status(200).send(post);
		})
		.catch((err) => {
			console.log("err", err);
		});
})


//Delete Topic
app.delete('/deleteTopic/:id', (req, res) => {
	Posts.destroy({
		where: {
			id: req.params.id
		}
	})
		.then((post) => {
			res.sendStatus(200)
		})
		.catch((err) => {
			console.log("err", err);
		});
})

// Update Topic
app.put('/updateTopic/:id', (req, res) => {
	Posts.update({
			description: req.body.description,
		},
		{
			where: {
				id: req.params.id
			}
		})
		.then((post) => {
			res.sendStatus(200)
		})
		.catch((err) => {
			console.log("err", err);
		});
})

// Add Comment
app.post('/addComment/:id', (req, res) => {
	Comment.create({
		comment: req.body.comment,
		topicid: req.params.id,
		username: req.body.username
	})
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((err) => {
			console.log('--------err', err);
		})
})

//Delete comment

app.delete('/deleteComment/:id', (req, res) => {
	Comment.destroy({
		where: {
			commentid: req.params.id
		}
	})
		.then((comment) => {
			res.sendStatus(200)
		})
		.catch((err) => {
			console.log("err", err);
		});
})

//Edit comment

app.put('/editComment/:id', (req, res) => {
	Comment.update({
			comment: req.body.comment
		},
		{
			where: {
				commentid: req.params.id
			}
		})
		.then((result) => {
			res.status(200).send(result)
		})
		.catch((err) => {
			console.log('--------err', err);
		})
})

//Get comments
app.get('/getComment/:id', (req, res) => {
	Comment.findAll({
		where: {
			topicid: req.params.id
		},
		attributes: ['comment', 'commentid', 'username']
	})
		.then(posts => {
			res.send(posts)
		})
		.catch(err => {
			console.log('--------err', err);
		})
})

//Delete all comments when post is being deleted
app.delete(`/deleteAllComments/:id`, (req, res) => {
	Comment.destroy({
		where: {
			topicid: req.params.id
		}
	})
		.then((comment) => {
			res.sendStatus(200)
		})
		.catch((err) => {
			console.log("err", err);
		});
})

//Upload
app.post('/upload/:id', (req, res) => {
	upload(req, res, (err) => {
		if (err) {
			console.log('--------err', err);
		} else {
			if (req.file === undefined) {
				res.json({
					msg: "Error:No file selected"
				})
			} else {
				Users.update({
						avatar: req.file.filename
					},
					{
						where: {
							id: req.params.id
						}
					})
				res.json({
					msg: "File uploaded",
					file: `uploads/${req.file.filename}`
				})
			}
		}
	})
})

//Update user profile
app.put('/updateProfile/:id', (req, res) => {
	Users.update({
			name: req.body.name,
			age: req.body.age,
			gender: req.body.gender,
		},
		{
			where: {
				id: req.params.id
			}
		})
		.then((result)=>{
			res.send(result)
		})
		.catch((err) => {
			console.log('--------err', err);
		})
})


app.get('/getPicture/:path', (req, res) => {
	// ....
})


app.listen(4000, () => {
	console.log('Server is up')
})