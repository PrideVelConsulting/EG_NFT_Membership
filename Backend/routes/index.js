const express = require('express')
const router = express.Router()
const projectRouter = require('./project_route.js')

router.use('/project', projectRouter)

module.exports = router
