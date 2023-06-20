const Sequelize = require("sequelize")
const sequelize = require("../util/dataBase");

const resetPassword = sequelize.define("reset",{
    id:{
        type:Sequelize.UUID,
        allowNull:false,
        primaryKey:true
    },
    active:Sequelize.BOOLEAN,
    expiresBy:Sequelize.DATE
})

module.exports = resetPassword;