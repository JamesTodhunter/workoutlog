const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define("user", {
    userName: {
        type: DataTypes.STRING,
        allowNULL: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNULL: false,
    },
});

module.exports = User;