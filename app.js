const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()
const helmet = require("helmet")
const morgan = require('morgan')
const fs = require('fs')
const path = require('path')

const sequelize = require('./backEnd/util/dataBase')
const User = require('./backEnd/models/userSignup')
const Expense = require('./backEnd/models/expense')
const Order = require('./backEnd/models/orders')
const resetPassword = require('./backEnd/models/resetPassword')
const fileData = require('./backEnd/models/fileExpense')

const userRoutes = require('./backEnd/routes/userSignup')
const expenseRoutes = require('./backEnd/routes/expense')
const premiumRoutes = require('./backEnd/routes/premium')
const forgotRoutes = require('./backEnd/routes/password')

const accessLogStream = fs.createWriteStream(path.join(__dirname,'access.log'),
{flags:'a'}
)

const app = express()
app.use(cors())
app.use(bodyParser.json())

console.log(process.env.DATABASE_USER)
app.use(helmet())
app.use(morgan('combined',{stream:accessLogStream}))

app.use(userRoutes)
app.use(expenseRoutes)
app.use(premiumRoutes)
app.use("/password",forgotRoutes)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(resetPassword)
resetPassword.belongsTo(User)

User.hasMany(fileData)
fileData.belongsTo(User)

sequelize.sync({alter:true})
.then((res)=>{
    app.listen(process.env.PORT||3000,()=>{
        console.log('app started running')
    })
})