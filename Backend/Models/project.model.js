const mongoose = require('mongoose')
const Schema = mongoose.Schema

const projectSchema = new Schema(
	{
		projectName: {
			type: String,
			required: true,
		},

		configurationTab: {
			type: Object,
		},

		isDeployed: {
			type: Boolean,
			default: false,
		},

		NftOnIpfsUpload: {
			type: Number,
			default: 0,
		},

		metadataSchema: {
			type: Object,
		},

		isUploadedToIPFS: {
			type: Boolean,
			default: false,
		},

		finalCIDR: {
			type: String,
		},

		contractAddress: {
			type: String,
		},

		userAddress: {
			type: String,
		},

		isVerified: {
			type: Boolean,
		},

		stepCompleted: {
			type: [Boolean],
			default: [true, false, false],
		},

		isActive: {
			type: Boolean,
		},

		abi: {
			type: Object,
		},
	},
	{
		timestamps: { createdAt: 'created_at' },
		timestamps: { updatedAt: 'updated_at' },
	}
)

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
