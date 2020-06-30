const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
const Users = require('./models/Users/users')
const Posts = require('./models/Posts/posts')
const cors = require('cors')
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const app = express()

app.engine('handlebars', exphbs({defaultLayout: "main"}))
app.set('view engine', 'handlebars')
app.use(bodyParser.json());
app.use(cors())


//Database
const db = require('./config/database')


//Test DB

db.authenticate().then(() => {
	console.log('Database conntected')
}).catch((err) => {
	console.log('error', err)
})


//Get user list
app.get('/', (req, res) => {
	Users.findAll().then((users) => {
		console.log(users)
		res.sendStatus(200)
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
		password: hashPassword
	})
	try {
		res.status(200).send(addUser)
	} catch (err) {
		res.status(404).send(err)
	}


})
//Log In
app.post('/logIn', async  (req,res)=>{
	//Check is username is valid
const user = await Users.findOne({where:{username:req.body.username}})
	//Username is not valid
	if(!user) {
		return res.status(400).send('Invalid username')
	}
	//Password validation
	const validPass = await bcrypt.compare(req.body.password, user.password)
	//Password is not valid
	if (!validPass) {
		return res.status(400).send('Invalid password')
	}
	//Create and assign token
	const token = jwt.sign({user},"secretKey")
	res.header("auth-token",token).send(token)

})

//Create Topic
app.post('/addPost', async (req,res) => {
	//Check if post already exists
	const postExists = await Posts.findOne({where:{
		title : req.body.title
		}})
	if (postExists) {
		return res.status(400).send('Post Already Exists')
	}
	//Create new post
	const addPost = Posts.create({
		title:req.body.title,
		description:req.body.description,
		username:req.body.username
	})
	try {
		res.status(200).send(addPost)
	} catch (err) {
		res.status(404).send(err)
	}

})

app.listen(4000, () => {
	console.log('Server is up')
})