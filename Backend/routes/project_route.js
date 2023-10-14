const express = require('express')
const projectController = require('../controllers/project.controller.js')

const router = express.Router()
router.post('/', projectController.createProject)
router.get('/', projectController.getProjects)
router.get('/:id', projectController.getProjectById)

module.exports = router
