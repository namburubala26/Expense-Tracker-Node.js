const express = require('express')

const router = express.Router()

const userController = require('../controllers/userSignup')


router.post('/user/signup',userController.addUser)

router.post('/user/login', userController.checkUser)

module.exports = router