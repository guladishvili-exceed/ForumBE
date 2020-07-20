'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
   return queryInterface.createTable('Users', {
     id : {
       type : Sequelize.INTEGER,
       autoIncrement : true,
       primaryKey : true
     },
     username : {
       type : Sequelize.STRING,
       unique : true
     },
     password : {
       type: Sequelize.STRING
     },
     name : {
       type : Sequelize.STRING
     },
     gender : {
       type : Sequelize.STRING
     },
     age : {
       type : Sequelize.STRING
     } ,
     role : {
       type : Sequelize.STRING
     },
     createdAt : {
       type : Sequelize.DATE
     },
     updatedAt : {
       type : Sequelize.DATE
     }
   })
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
