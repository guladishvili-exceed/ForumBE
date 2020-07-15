const Sequelize = require('sequelize')
const db = require('../../config/database')

const Users = db.define('Users',{

	username : {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
			unique : true
		},
		type : Sequelize.STRING,
	} ,
	role : {
		type : Sequelize.STRING
	},
	password : {
		type : Sequelize.STRING,
	},
	avatar : {
		type : Sequelize.STRING
	}
})

module.exports = Users