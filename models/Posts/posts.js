const Sequelize = require('sequelize')
const db = require('../../config/database')
const Comment = require('../Comment/comment')

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

})

Posts.association = (models) => {
	Posts.hasMany(Comment);
	Comment.belongsTo(Posts);
}
module.exports = Posts;