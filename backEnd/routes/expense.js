const express = require('express')

const router = express.Router()

const expenseController = require('../controllers/expense')
const userAuthentication = require('../middleware/auth')

router.get('/user/download/',userAuthentication.authenticate,expenseController.downloadExpense)

router.post('/expense/add',userAuthentication.authenticate,expenseController.addExpense)
router.get('/expense/get/',userAuthentication.authenticate,expenseController.getExpense)
router.get('/expense/get/expensePerPage',userAuthentication.authenticate,expenseController.getExpensesPerPage)

router.delete('/expense/delData/:id',userAuthentication.authenticate,expenseController.delData)

module.exports = router