const mongoose = require('mongoose')

const Schema = mongoose.Schema

var userDataScheme = new Schema(
	{
		userAddress: {
			type: String,
			isLowerCase: true,
		},
		nonce: {
			type: Number,
			required: true,
			default: () => Math.floor(Math.random() * 1000000),
		},
		contractAddress: {
			type: String,
			isLowerCase: true,
			unique: true,
			sparse: true,
		},
		collectionName: String,
		tokenName: String,
		tokenSymbol: String,
		uriHash: String,
	},
	{
		timestamps: { createdAt: 'created_at' },
	}
)

const userData = mongoose.model('userData', userDataScheme)

module.exports = userData
