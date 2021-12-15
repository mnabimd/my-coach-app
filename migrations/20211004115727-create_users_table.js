'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("users", {
      _id: {
        type: Sequelize.CHAR(45),
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      firstname: {
        type: Sequelize.CHAR(50),
        allowNull: false,
        trim: true
      },
      lastname: {
        type: Sequelize.CHAR(50),
        allowNull: false,
        trim: true
      },
      profile: {
        type: Sequelize.TEXT('long')
      },
      email: {
        type: Sequelize.CHAR(40),
        allowNull: false,
        unique: true,
        trim: true
      },
      password: {
        type: Sequelize.CHAR(100),
        allowNull: false,
        trim: true
      },
      isAdmin: {
        type: Sequelize.BOOLEAN,
      },
      messageAlert: {
        type: Sequelize.BOOLEAN,
        default: true
      },
      tokens: {
        type: Sequelize.JSON,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users")
  }
};