const data = require('./arguments')
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require('hardhat')

async function main() {
	// Hardhat always runs the compile task when running scripts with its command
	// line interface.
	//
	// If this script is run directly using `node` you may want to call compile
	// manually to make sure everything is compiled
	// await hre.run('compile');

	// We get the contract to deploy
	const DeployedContractFactory = await hre.ethers.getContractFactory('EthGlobal')
	const deployedContractFactory = await DeployedContractFactory.deploy(
		data[0],
		data[1],
		data[2],
		data[3],
        data[4]
	)

	await deployedContractFactory.deployed()

	console.log('Smart Contract Address:', deployedContractFactory.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error)
		process.exit(1)
	})
