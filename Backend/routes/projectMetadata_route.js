//controllers/routes/projectMetadataController.js
const express = require('express')
const ProjectMetadataController = require('../controllers/projectMetadata.controller') // Use lowercase "ProjectMetadata"
const csvMiddleware = require('../middleware/csvMiddleware')
const csvValidationMiddleware = require('../middleware/csvValidationMiddleware')
const jsonGeneratorMiddleware = require('../middleware/jsonGeneratorMiddleware.js')
const ipfsUploadMiddleware = require('../middleware/ipfsUploadMiddleware.js')

const router = express.Router()

router.post('/', ProjectMetadataController.createProjectMetadata)
router.get('/', ProjectMetadataController.getProjectMetadatas)
router.get("/download-latest-contract", ProjectMetadataController.downloadcontract);
router.put('/:id', ProjectMetadataController.updateProjectMetadata)
router.delete('/:id', ProjectMetadataController.deleteProjectMetadata)
router.get('/:id', ProjectMetadataController.getProjectMetadataById)
router.get('/project/:projectId', ProjectMetadataController.getProjectMetadata)
router.post(
	'/csv',
	csvMiddleware.uploadCSV,
	csvValidationMiddleware,
	ProjectMetadataController.addCSVProject
)

router.post(
	'/generate',
	ProjectMetadataController.fetchAndSerialize,
	jsonGeneratorMiddleware,
	ipfsUploadMiddleware,
	ProjectMetadataController.handleIPFSRes
)

router.get('/download/:id', ProjectMetadataController.generateAndSendZip)

module.exports = router
