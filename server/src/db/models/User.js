const Sequelize = require('sequelize');
const {
    sequelize
} = require('../connection');

const Users = sequelize.define("users", {
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
        type: Sequelize.JSON
    }
})

module.exports = Users;