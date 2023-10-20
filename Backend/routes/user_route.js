const express = require('express')
const router = express.Router()
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
var user = require('../controllers/user.controller')
var smartContract = require('../controllers/smartContract.controller')
const path = require('path')

router.post('/pre_mint', jsonParser, user.preMint)
router.post('/check_user', jsonParser, user.checkUser)
router.post('/wallet_auth', jsonParser, user.handleAuth)
router.post('/deploy_smart_contract', smartContract.deploysmartContract)
router.post('/verify_contract', smartContract.verifySmartContract)
router.get('/get_auth', jsonParser, user.getAuth)
router.get('/check_membership/:userAddress', jsonParser, user.checkMembership)
router.get('/logout', jsonParser, user.logOut)

module.exports = router
