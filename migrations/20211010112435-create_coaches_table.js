'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("coaches", {
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
      description: {
        type: Sequelize.CHAR,
        allowNull: false,
        trim: true
      },
      hourlyRate: {
        type: Sequelize.BIGINT,
        allowNull: false,
        trim: true
      },
      phone: {
        type: Sequelize.BIGINT,
        trim: true
      },
      language: {
        type: Sequelize.CHAR(20),
        trim: true
      },
      cv: {
        type: Sequelize.TEXT('long'),
        required: true
      },
      requestApproved: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE
    })

  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("coaches")
  }
};