const Sequelize = require('sequelize')
const Posts = require('../Posts/posts')
const db = require('../../config/database')


const Comment = db.define("comments", {
	commentid: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},

	topicid: {
		type: Sequelize.INTEGER,
		foreignKey: true,
	},

	comment: {
		type: Sequelize.STRING,
	}

})
Comment.association = (models) => {
	Posts.hasMany(Comment);
	Comment.belongsTo(Posts);
}

module.exports = Comment;