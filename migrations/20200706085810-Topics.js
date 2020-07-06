'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable('Topics', {
      id : {
        type : Sequelize.INTEGER,
        autoIncrement : true,
        primaryKey : true
      },
      title : {
        type : Sequelize.STRING,
      },
      description : {
        type: Sequelize.STRING
      },
      comment : {
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
