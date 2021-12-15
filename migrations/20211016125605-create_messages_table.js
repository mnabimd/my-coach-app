'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("messages", {
      _id: {
        type: Sequelize.CHAR(45),
        allowNull: false,
        unique: true,
        primaryKey: true
      },
      userId: {
        type: Sequelize.CHAR(45),
        allowNull: false,
      },
      senderId: {
        type: Sequelize.CHAR(45),
        allowNull: false,
      },
      email: {
        type: Sequelize.CHAR(40),
        allowNull: false,
      },
      message: {
        type: Sequelize.CHAR,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    });

  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("messages")
  }
};