const userData = require('../Models/userData.model')
const { bufferToHex } = require('ethereumjs-util')
const { recoverPersonalSignature } = require('eth-sig-util')
const session = require('express-session')

class User {
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
