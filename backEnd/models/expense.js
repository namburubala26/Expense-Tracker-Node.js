const Sequelize = require('sequelize');

const { DataTypes } = require('sequelize')
const sequelize = require('../util/dataBase')

const ExpenseData = sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    desc:{
        type:Sequelize.STRING,
        allowNull:false
    },
    categ:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = ExpenseData