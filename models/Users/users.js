const Sequelize = require('sequelize')
const db = require('../../config/database')

const Users = db.define('Users',{
	username : {
		type : Sequelize.STRING,
	} ,
	password : {
		type : Sequelize.STRING,
	}
})

module.exports = Users