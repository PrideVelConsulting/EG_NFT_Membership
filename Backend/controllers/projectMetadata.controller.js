//controllers/projectMetadataController.js
const ProjectMetadata = require('../Models/projectMetadata.model')
const Project = require('../Models/project.model')

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

async function createProjectMetadata(req, res) {
	try {
		const project = new ProjectMetadata(req.body)
		const savedProjectMetadata = await project.save()
		res.status(201).json(savedProjectMetadata)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

async function addCSVProject(req, res) {
	try {
		const projectId = req.csvData[0]?.projectId
		await ProjectMetadata.deleteMany({ projectId })
		const openseaPrefixes = [
			'attrbn_',
			'attrbp_',
			'attrn_',
			'attrr_',
			'attrd_',
			'serialNo',
		]
		const dataToSave = req.csvData.map((entry) => {
			// Iterate over the keys (columns) in each entry
			for (const key in entry) {
				if (openseaPrefixes.some((prefix) => key.startsWith(prefix))) {
					// Convert the value associated with the key to a number
					entry[key] = parseInt(entry[key])
				}
			}
			return new ProjectMetadata(entry)
		})
		await ProjectMetadata.insertMany(dataToSave)
		res.status(200).json({ message: 'CSV data saved to DB' })
	} catch (error) {
		res.status(500).json({ error: 'An error occurred.' })
	}
}

async function createMulProjectMetadata(req, res) {
	try {
		const data = req.body //[{},{},{}] = data structure
		const savedProjectMetadata = await ProjectMetadata.insertMany(data)
		res.status(201).json(savedProjectMetadata)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

async function getProjectMetadatas(req, res) {
	try {
		const projects = await ProjectMetadata.find()
		res.json(projects)
	} catch (error) {
		res.status(500).json({ error: 'An error occurred.' })
	}
}

async function updateProjectMetadata(req, res) {
	try {
		const updatedProjectMetadata = await ProjectMetadata.findByIdAndUpdate(
			req.params.id,
			req.body,
			{
				new: true, // Return the updated project after update
			}
		)

		if (!updatedProjectMetadata) {
			return res.status(404).json({ error: 'ProjectMetadata not found.' })
		}

		res.json(updatedProjectMetadata)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

async function deleteProjectMetadata(req, res) {
	try {
		const deletedProjectMetadata = await ProjectMetadata.findByIdAndDelete(
			req.params.id
		)

		if (!deletedProjectMetadata) {
			return res.status(404).json({ error: 'ProjectMetadata not found.' })
		}

		res.json({ message: 'ProjectMetadata deleted successfully.' })
	} catch (error) {
		res.status(500).json({ error: 'An error occurred.' })
	}
}

async function getProjectMetadataById(req, res) {
	try {
		const project = await ProjectMetadata.findById(req.params.id)

		if (!project) {
			return res.status(404).json({ error: 'ProjectMetadata not found.' })
		}

		res.json(project)
	} catch (error) {
		res.status(500).json({ error: 'An error occurred.' })
	}
}

const fetchAndSerialize = async (req, res, next) => {
	const projectId = req.body.projectId
	const n = req.body.n
	try {
		const count = await ProjectMetadata.countDocuments({ projectId })
		if (n > count) {
			console.log(count)
			return res.status(400).json({
				error: 'You can only generate NFT upto total number : ' + count,
			})
		}
		const metadata = await ProjectMetadata.find({ projectId })
			.sort({
				serialNo: 1,
			})
			.limit(n)
		const plainObjects = metadata.map((doc) => doc.toJSON())
		req.sortedMetadata = plainObjects // Attach sorted metadata to the request object
		return next() // Move to the next middleware/route handler
	} catch (error) {
		console.error('Error fetching and processing data:', error)
		return res.status(500).json({ error: 'Error fetching and processing data' })
	}
}

const handleIPFSRes = async (req, res) => {
	console.log(req.body.stepCompleted)
	try {
		const metadataCID = req.ipfsResponse
		const filter = { _id: req.body.projectId }
		const update = {
			$set: {
				finalCIDR:
					metadataCID && metadataCID.IpfsHash ? metadataCID.IpfsHash : '',
				isUploadedToIPFS: true,
				NftOnIpfsUpload: req.nftCount,
				stepCompleted: req.body.stepCompleted,
				configurationTab: {},
			},
		}

		await Project.updateOne(filter, update)
		return res.status(200).json({ message: metadataCID.IpfsHash })
	} catch (error) {
		console.error('Error fetching and processing data:', error)
		return res.status(500).json({ error: 'Error Storing CID to DB' })
	}
}

const generateAndSendZip = (req, res) => {
	const generatedFilesDirectory = path.join(__dirname, '../generated_files')
	const latestFolder = `Project_${req.params.id}`
	const zipFileName = `${latestFolder}.zip`

	if (!fs.existsSync(path.join(generatedFilesDirectory, latestFolder))) {
		return res.status(404).json({ error: 'Folder not found' })
	}

	const archive = archiver('zip', {
		zlib: { level: 9 }, // Compression level
	})

	res.setHeader('Content-Type', 'application/zip')
	res.setHeader('Content-Disposition', `attachment; filename="${zipFileName}"`)

	archive.on('error', (archiveErr) => {
		console.error('Error creating zip archive:', archiveErr)
		res.status(500).json({ error: 'Error creating zip archive' })
	})

	archive.pipe(res)
	archive.directory(path.join(generatedFilesDirectory, latestFolder), false)
	archive.finalize()
}

async function getProjectMetadata(req, res) {
	try {
		const projectId = req.params.projectId
		const projectMetadata = await ProjectMetadata.find({
			projectId: projectId,
		})
		console.log(projectMetadata, 'projectMetadata')
		if (!projectMetadata) {
			return res.status(404).json({ error: 'Project not found.' })
		}

		res.json(projectMetadata)
	} catch (error) {
		console.error('Error fetching project metadata:', error)
		res.status(500).json({ error: 'An error occurred.' })
	}
}

async function downloadcontract(req, res) {
	const directoryPath = path.join(process.cwd(), 'HARDHAT', 'contracts')
	fs.readdir(directoryPath, (err, files) => {
		if (err) {
			return res.status(500).send(err)
		}

		files.sort((a, b) => {
			return (
				fs.statSync(path.join(directoryPath, b)).mtime.getTime() -
				fs.statSync(path.join(directoryPath, a)).mtime.getTime()
			)
		})

		const latestFile = files[0]

		const filePath = path.join(directoryPath, latestFile)

		// Set the content-disposition header with the filename
		res.setHeader('Content-Disposition', `attachment; filename="${latestFile}"`)

		res.download(filePath) // Download the latest contract file
	})
}

module.exports = {
	createProjectMetadata,
	getProjectMetadatas,
	updateProjectMetadata,
	deleteProjectMetadata,
	getProjectMetadataById,
	createMulProjectMetadata,
	addCSVProject,
	fetchAndSerialize,
	handleIPFSRes,
	generateAndSendZip,
	getProjectMetadata,
	downloadcontract,
}
