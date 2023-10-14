const Project = require('../Models/project.model.js')

async function createProject(req, res) {
	try {
		const projectName = req.body.projectName
		const existingProject = await Project.findOne({ projectName })

		if (existingProject) {
			return res
				.status(400)
				.json({ error: 'Project with the same name already exists' })
		}

		const project = new Project(req.body)
		const savedProject = await project.save()
		console.log(savedProject)
		res.status(201).json(savedProject)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

async function getProjects(req, res) {
	try {
		const projects = await Project.find()
		res.json(projects)
	} catch (error) {
		res.status(500).json({ error: 'An error occurred.' })
	}
}

async function getProjectById(req, res) {
	try {
		const project = await Project.findById(req.params.id)

		if (!project) {
			return res.status(404).json({ error: 'Project not found.' })
		}

		res.json(project)
	} catch (error) {
		res.status(500).json({ error: 'An error occurred.' })
	}
}

module.exports = {
	createProject,
	getProjects,
	getProjectById,
}
