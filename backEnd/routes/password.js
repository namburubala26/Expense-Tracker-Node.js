const express = require('express')
const router = express.Router()

// const userAuthentication = require('../middleware/auth')
const passwordController = require('../controllers/password')

router.get('/updatepassword/:resetpasswordid',passwordController.updatepassword)

router.get('/resetpassword/:id', passwordController.passwordReset)

router.use('/forgotpassword',passwordController.forgotPassword)

module.exports = router