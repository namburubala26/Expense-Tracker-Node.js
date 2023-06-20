const express = require('express')
const router = express.Router()

const premiumController = require('../controllers/premium')
const userAuthentication = require('../middleware/auth')
const leaderBoard = require('../controllers/leaderBoard')

router.get('/purchase/premium',userAuthentication.authenticate,premiumController.purchasepremium)

router.post('/purchase/update',userAuthentication.authenticate,premiumController.updateTransactionStatus)

router.get('/purchase/showleaderboard',userAuthentication.authenticate,leaderBoard.userLeaderBoard)

module.exports = router