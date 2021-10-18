const Sequelize = require('sequelize');

const sequelize = new Sequelize("postgres://postgres:Dragonburrito68@localhost:5432/workoutlog");

module.exports = sequelize;