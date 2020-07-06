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
