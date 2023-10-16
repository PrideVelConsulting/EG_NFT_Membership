const express = require('express')
const router = express.Router()

const projectRouter = require('./project_route.js')
const userRouter = require('./user_route.js')

router.use('/project', projectRouter)
router.use('/user', userRouter)

module.exports = router
