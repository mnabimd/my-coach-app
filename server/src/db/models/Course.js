const Sequelize = require('sequelize');
const {
    sequelize
} = require('../connection');

const Courses = sequelize.define("courses", {
    _id: {
        type: Sequelize.CHAR(45),
        allowNull: false,
        unique: true,
        primaryKey: true
    },
    coachId: {
        type: Sequelize.CHAR(45),
        allowNull: false,
        trim: true
    },
    name: {
        type: Sequelize.CHAR(40),
        allowNull: false,
        trim: true
    },
    description: {
        type: Sequelize.CHAR,
        allowNull: false,
        trim: true
    },
    goals: {
        type: Sequelize.CHAR,
        allowNull: false,
        trim: true
    },
    requirements: {
        type: Sequelize.CHAR,
        allowNull: false,
        trim: true
    },
    timestamp: {
        type: Sequelize.CHAR(40),
        allowNull: false,
        trim: true
    }
})

module.exports = Courses;