require('dotenv').config()
require('@nomiclabs/hardhat-waffle')
require('@nomiclabs/hardhat-etherscan')

module.exports = {
	defaultNetwork: 'mantleTestnet',
	networks: {
		hardhat: {},
		mantleTestnet: {
			url: process.env.MANTLE_TESTNET_URL,
			accounts:
				process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
		},
	},
	solidity: {
		compilers: [
			{
				version: '0.8.21',
				settings: {
					evmVersion: 'paris',
					optimizer: {
						enabled: true,
						runs: 450,
					},
				},
			},
		],
	},
	etherscan: {
		apiKey: {
			mantleTestnet: 'N6RCPDCETIXUSKZT2QIHYG7EK1ZHKC31YJ',
		},
		customChains: [
			{
				network: 'mantleTestnet',
				chainId: 5001,
				urls: {
					apiURL: 'https://explorer.testnet.mantle.xyz/api',
					browserURL: 'https://explorer.testnet.mantle.xyz',
				},
			},
		],
	},
}
