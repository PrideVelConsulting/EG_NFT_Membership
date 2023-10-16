const express = require('express')
const router = express.Router()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var user = require('../controllers/user.controller')
const path = require('path')

router.post('/check_user', jsonParser, user.checkUser)
router.post('/wallet_auth', jsonParser, user.handleAuth)
router.get('/get_auth', jsonParser, user.getAuth)
router.get('/logout', jsonParser, user.logOut)

module.exports = router
