const Sequelize = require('sequelize')
const db = require('../../config/database')

const Posts =db.define("Topics",{
	title : {
		type : Sequelize.STRING,
	},
	description : {
		type: Sequelize.STRING
	},
	username : {
		type: Sequelize.STRING
	}
})
module.exports = Posts;