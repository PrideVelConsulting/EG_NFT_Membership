import { ethers } from 'ethers'
import Api from '../../services/Api'
import { useWallet } from '../../services/context/WalletContext'
import { useToast } from '../ToastContext'

let signer
let provider
let walletAddress

const useMetaConnector = () => {
	const { setWalletAddress } = useWallet()
	const toast = useToast()

	const connectToMeta = async () => {
		if (window.ethereum) {
			const networkVersion = window.ethereum.networkVersion
			console.log(networkVersion)

			if (networkVersion !== '5001') {
				try {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: '0x1389' }],
					})
				} catch (switchError) {
					if (switchError.code === 4001) {
						return toast.error('Switch to Mantle Testnet')
					}
					if (switchError.code === 4902) {
						try {
							await window.ethereum.request({
								method: 'wallet_addEthereumChain',
								params: [
									{
										chainId: '0x1389',
										chainName: 'Mantle Testnet',
										nativeCurrency: {
											name: 'MNT',
											symbol: 'MNT',
											decimals: 18,
										},
										rpcUrls: ['https://rpc.testnet.mantle.xyz/'],
										blockExplorerUrls: ['https://explorer.testnet.mantle.xyz/'],
									},
								],
							})
						} catch (addError) {
							console.log('Failed to add the Mantle Testnet', addError)
						}
					}
				}
			}

			console.log('hello')
			provider = new ethers.BrowserProvider(window.ethereum)
			signer = await provider.getSigner()

			walletAddress = await signer.getAddress()

			const res = await Api.post('/user/check_user', {
				walletAddress: walletAddress.toLowerCase(),
			})

			if (res) {
				try {
					return handleSignIn(res.data.userObject)
				} catch (error) {
					console.log(error)
				}
			}
		} else {
			toast.info('Please install Metamask')
		}
	}

	const handleSignIn = async ({ userAddress, nonce }) => {
		const msg = `I am signing a one time nonce ${nonce}`

		try {
			const signature = await signer.signMessage(msg)
			return handleAuthentication(signature, userAddress)
		} catch (error) {
			console.log(error)
		}
	}

	const handleAuthentication = async (signature, userAddress) => {
		const res = await Api.post('/user/wallet_auth', {
			signature: signature,
			userAddress: userAddress,
		})

		console.log(res)

		if (res.data.allowed) {
			setWalletAddress(walletAddress.toLowerCase())
			return walletAddress.toLowerCase()
		} else {
			alert('Access denied')
			return null
		}
	}

	return { connectToMeta }
}

export default useMetaConnector
