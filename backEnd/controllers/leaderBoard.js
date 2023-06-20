const User = require('../models/userSignup')
const Expense = require('../models/expense')
const sequelize = require('sequelize');

const userLeaderBoard = (req,res)=>{
    Expense.findAll({
        attributes: [[sequelize.fn('sum', sequelize.col('price')), 'totalPrice']],
        group: ['userId'],
        include: [{
            model: User,
            attributes: ['name'],
        }],
        order: [[sequelize.col('totalPrice'), 'DESC']],
    }).then(userPrices => {
        return res.status(200).json({success:true,data:userPrices})
    });  
}