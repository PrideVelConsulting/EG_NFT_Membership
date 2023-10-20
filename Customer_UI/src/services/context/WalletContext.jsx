import { createContext, useContext, useState } from 'react'

const WalletContext = createContext()

export const useWallet = () => {
	return useContext(WalletContext)
}

export const WalletProvider = ({ children }) => {
	const [walletAddress, setWalletAddress] = useState(null)

	const value = {
		walletAddress,
		setWalletAddress,
	}

	return (
		<WalletContext.Provider value={value}>{children}</WalletContext.Provider>
	)
}
