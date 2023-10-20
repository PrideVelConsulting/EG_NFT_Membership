const mongoose = require('mongoose')
const Schema = mongoose.Schema
const model = mongoose.model

const projectSchema = new Schema(
	{
		projectId: {
			type: Schema.Types.ObjectId,
			ref: 'Project',
			required: true,
		},
		serialNo: {
			type: Number,
			required: true, // This makes the serialNo field compulsory
		},
		// dynamicData: Schema.Types.Mixed, // Store dynamic properties here
	},
	{ strict: false }
)

const ProjectMetadata = model('ProjectMetadata', projectSchema)

module.exports = ProjectMetadata
