const Sequelize = require('sequelize');
const {
    sequelize
} = require('../connection');

const Messages = sequelize.define("messages", {
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
})

module.exports = Messages;