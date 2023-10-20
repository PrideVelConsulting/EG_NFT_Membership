const userData = require('../Models/userData.model')
const { bufferToHex } = require('ethereumjs-util')
const { recoverPersonalSignature } = require('eth-sig-util')
const session = require('express-session')
const ethers = require('ethers')
const ABI = require('../ABIs/EthGlobalAbi.json')
const projectModal = require('../Models/project.model')

class User {
	preMint = async (req, res) => {
		const { contractAddress, id } = req.body
		console.log(id)
		console.log('contractAddress', contractAddress)

		const project = await projectModal.findById(req.body.id)

		const rpcURL = 'https://rpc.testnet.mantle.xyz'
		let provider = ethers.getDefaultProvider(rpcURL)

		let wallet_erc = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

		const contract = new ethers.Contract(
			contractAddress,
			project.abi,
			wallet_erc
		)

		const csvData = req.body.csvData
		const name = await contract['name']()
		const owner = await contract['owner']()

		try {
			const result = await contract['batchMint'](csvData)

			if (result) {
				return res
					.status(200)
					.json({ message: 'NFTs Minted Successfully', success: true })
			}
		} catch (error) {
			console.log(error, 'error')
			return res.status(500).json({ message: 'Failed', success: false })
		}
	}

	checkMembership = async (req, res) => {
		const { userAddress } = req.params
		const contractAddress = '0x674A6a6D040bD7f4831F7efDA2346Ee1e47Af965'
		const rpcURL = 'https://rpc.testnet.mantle.xyz'
		let provider = ethers.getDefaultProvider(rpcURL)

		const contract = new ethers.Contract(contractAddress, ABI, provider)
		const name = await contract['balanceOf'](userAddress)

		console.log(name)

		console.log(userAddress)
		return res
			.status(200)
			.json({ message: 'data found', noOfNfts: name.toString() })
	}

	createUser = async (req, res) => {
		const {
			userAddress,
			contractAddress,
			collectionName,
			tokenName,
			tokenSymbol,
			uriHash,
		} = req.body
		const user = new userData({
			userAddress: userAddress,
			contractAddress: contractAddress,
			collectionName: collectionName,
			tokenName: tokenName,
			tokenSymbol: tokenSymbol,
			uriHash: uriHash,
			processStep: 1,
		})

		//saves the document in mongodb
		user
			.save()
			.then((result) => {
				return res
					.status(200)
					.json({ message: 'User data stored successfully', data: result })
			})
			.catch((err) => {
				console.log(err)
				return res
					.status(500)
					.json({ message: 'Failed to store data', data: err })
			})
	}

	checkUser = (req, res) => {
		const { walletAddress } = req.body
		userData
			.findOne({ userAddress: walletAddress })
			.then((docs) => {
				if (!docs) {
					const newUser = new userData({
						userAddress: walletAddress,
					})
					newUser
						.save()
						.then((savedUser) => {
							console.log('New user created:', savedUser)
						})
						.catch((saveErr) => {
							console.log('Error creating user:', saveErr)
						})

					console.log(walletAddress)

					return res.json({ message: 'new user created', userObject: newUser })
				} else {
					return res.json({ message: 'user found', userObject: docs })
				}
			})
			.catch((err) => {
				console.log(err)
				return res.status(500).json({ error: 'server error' })
			})
	}

	handleAuth = (req, res) => {
		const { userAddress, signature } = req.body
		req.session.name = 'ethan'
		req.session.age = 32
		console.log(req.session.name)

		// console.log(req.session.walletAddress)
		userData.findOne({ userAddress: userAddress }).then((user) => {
			const msg = `I am signing a one time nonce ${user?.nonce}`

			const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'))
			const address = recoverPersonalSignature({
				data: msgBufferHex,
				sig: signature,
			})

			if (address.toLowerCase() === userAddress.toLowerCase()) {
				user.nonce = Math.floor(Math.random() * 10000)

				user.save().catch((err) => {
					console.log(err)
					return res
						.status(500)
						.json({ message: 'error saving nonce', data: err })
				})

				req.session.walletAddress = address
				req.session.isAuthenticated = true
				req.session.cookie.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)

				// console.log(req.session.isAuthenticated, 'req.session.isAuthenticated')
				// console.log(req.session.walletAddress, 'req.session.address')

				req.session.save(() => {
					return res
						.status(200)
						.json({ message: 'Login Successful', allowed: true })
				})
			} else {
				return res.status(401).send({ error: 'Signature verification failed' })
			}
		})
	}

	getAuth = (req, res) => {
		console.log(req.session, 'req.session in getAuth')

		if (req.session.isAuthenticated) {
			return res.json({
				msg: 'user authenticated',
				walletAddress: req.session.walletAddress,
			})
		} else {
			console.log('please sign in')
			return res.json({ msg: 'sign in please' })
		}
	}

	logOut = (req, res) => {
		req.session.destroy(() => {
			console.log('signed out')
			return res.json({ msg: 'user signed out', success: true })
		})
	}
}

const user = new User()

module.exports = user
