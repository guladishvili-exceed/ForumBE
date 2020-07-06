const Sequelize = require('sequelize')
const db = require('../../config/database')

const Users = db.define('Users',{

	username : {
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},
		type : Sequelize.STRING,
	} ,
	password : {
		type : Sequelize.STRING,
	}
})

module.exports = Users