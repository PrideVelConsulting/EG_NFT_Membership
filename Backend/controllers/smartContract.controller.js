const exec = require('child_process').exec
const path = require('path')
const fs = require('fs')
const os = require('os')
const Project = require('../Models/project.model')

var currentPath = process.cwd()
const execDir = path.join(currentPath, './', 'HARDHAT')
const envFilePAth = path.join(currentPath, './', 'HARDHAT', '.env')
const ENV_VARS = fs.readFileSync(envFilePAth, 'utf-8').split(os.EOL)
const argumentExe = path.join(execDir, '/argument1.jsx')
const directoryPath = path.join(execDir, 'contracts')

const addAbiToDB = async (abi, projectId) => {
	try {
		const updatedProject = await Project.findByIdAndUpdate(
			projectId,
			{ $set: { abi: abi } },
			{ new: true }
		)

		if (updatedProject) {
			console.log('ABI updated successfully')
		} else {
			console.log('Project not found or update failed')
		}
	} catch (error) {
		console.error('Error updating ABI:', error)
	}
}

async function deploysmartContract(req, res) {
	try {
		const { SmartContractCode, projectName, projectId } = req.body
		const createSmartContractFile = async (projectId, SmartContractCode) => {
			const FileName = `${projectId}.sol`
			const FilePath = path.join(directoryPath, FileName)
			fs.writeFileSync(FilePath, SmartContractCode)
			console.log('The file is saved at:', FilePath)
			setEnvContractName('PROJECT_NAME', projectName)
		}

		// find the Project Name in ENV file and replace it with the current project
		const setEnvContractName = async (key, value) => {
			// find the env we want based on the key
			const target = ENV_VARS.indexOf(
				ENV_VARS.find((line) => {
					return line.match(new RegExp(key))
				})
			)

			// replace the key/value with the new value
			ENV_VARS.splice(target, 1, `${key}=${value}`)
			console.log('Chk1 : ', key, ' ', value)
			// write everything back to the file system
			await fs.writeFileSync(envFilePAth, ENV_VARS.join(os.EOL))
			checkNodeModule()
		}

		const checkNodeModule = async () => {
			const check = path.join(execDir, 'node_modules')
			console.log('chk2 : ', check)
			if (fs.existsSync(check) == false) {
				await exec('npm install', { cwd: execDir }, (err, stdout, stderr) => {
					if (err) {
						console.error(`exec error: ${err} `)
					} else {
						console.log(` ${stdout}`)
						compileSmartContract()
					}
				})
			} else {
				compileSmartContract()
			}
		}

		const compileSmartContract = async () => {
			await exec(
				'npx hardhat compile',
				{ cwd: execDir },
				(err, stdout, stderr) => {
					if (err) {
						console.log(`exec error: ${err}`)
						return
					} else {
						deploySmartContract()
					}
				}
			)
		}

		const deploySmartContract = async () => {
			const abiFilePath = path.join(
				currentPath,
				'HARDHAT',
				'artifacts',
				'contracts',
				`${projectId}.sol`,
				`${projectName}.json`
			)
			try {
				await exec(
					`npx hardhat run ./scripts/deploy-script.js --network mantleTestnet`,
					{ cwd: execDir },
					(err, stdout, stderr) => {
						if (err) {
							console.log(`exec error: ${err}`)
							return
						} else {
							console.log('chk3')
							console.log(stdout, 'address')
							const data = fs.readFileSync(abiFilePath, 'utf-8')
							const jsonData = JSON.parse(data)

							const abi = jsonData.abi

							addAbiToDB(abi, projectId)

							res.status(200).json({
								message: 'Contract Deployed',
								contractAddress: stdout.trim(),
							})
						}
					}
				)
			} catch (error) {
				console.log(error)
			}
		}

		// function start from here
		createSmartContractFile(projectId, SmartContractCode)
		// res.status(201).json(`Contract deployed successfully!`)
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}

const verifySmartContract = async (req, res) => {
	const ContractAddress = req.body.ContractAddress
	// Need Smart Contract Address
	// ${ContractAddress}
	try {
		await exec(
			`npx hardhat verify --network mantleTestnet --constructor-args arguments.js 0xf17583408D373A47b1dE629B6D77dab93D28e802`,
			{ cwd: execDir },
			(err, stderr, stdout) => {
				if (err) {
					res.status(400).json({ error: err.message })
					console.log(`exec error: ${err}`)
					return
				}
				console.log(stderr)
				console.log(stdout)
				res.status(201).json(`${stderr}`)
			}
		)
	} catch (error) {
		console.log(error)
	}
}

module.exports = {
	deploysmartContract,
	verifySmartContract,
}
