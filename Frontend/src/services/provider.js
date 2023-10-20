import { ethers } from "ethers"

const initializeProvider = (contractAddress, contractAbi) => {
  const provider = new ethers.BrowserProvider(window.ethereum)
  const contract = new ethers.Contract(contractAddress, contractAbi, provider)

  return contract
}

export default initializeProvider
