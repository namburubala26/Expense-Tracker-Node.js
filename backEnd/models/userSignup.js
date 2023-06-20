const Sequelize = require('sequelize');

const { DataTypes } = require('sequelize')
const sequelize = require('../util/dataBase')

const UserData = sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    email:{
        type:Sequelize.STRING,
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    ispremium:{
        type:Sequelize.STRING
    }
})

module.exports = UserData