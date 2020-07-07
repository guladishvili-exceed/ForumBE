const Sequelize = require('sequelize')
const db = require('../../config/database')

const Posts =db.define("Topics",{
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true
	},
	title : {
		type : Sequelize.STRING,
	},
	description : {
		type: Sequelize.STRING
	},
	username : {
		type: Sequelize.STRING
	},
	comment : {
		type:Sequelize.ARRAY(Sequelize.STRING),
		defaultValue : [],
		allowNull: false
	}

})
module.exports = Posts;