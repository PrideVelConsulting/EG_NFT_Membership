const dotenv = require('dotenv')
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const session = require('express-session')

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8301
const connect = mongoose.connect
const connection = mongoose.connection

app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)
app.use(express.json())

const DB = require('./db.js').DB
const router = require('./routes/index.js')

connect(DB, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
	.then(function () {
		console.log('Database Connected')
	})
	.catch(function (err) {
		console.log(err)
	})

connection.once('open', function () {
	console.log('Connection with MongoDB was successful')
})

connection.on('error', (error) => console.log(error, 'error error error'))

app.listen(PORT, function () {
	console.log('Server is running on Port: ' + PORT)
})

app.use(
	session({
		name: 'nft_session',
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: true,
		cookie: {
			path: '/',
			httpOnly: false,
			maxAge: 24 * 60 * 60 * 1000,
			secure: false,
			sameSite: true,
		},
	})
)
app.use('/', router)
