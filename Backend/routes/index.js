const express = require('express')
const router = express.Router()

const projectRouter = require('./project_route.js')
const projectMetadataRouter = require('./projectMetadata_route.js')
const userRouter = require('./user_route.js')

router.use('/project', projectRouter)
router.use('/user', userRouter)
router.use('/project_metadata', projectMetadataRouter)

module.exports = router
