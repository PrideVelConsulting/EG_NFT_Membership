import React, { useEffect, useState } from 'react'
import { InputText } from 'primereact/inputtext'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Button } from 'primereact/button'
import Api from '../../../services/Api'
import { useWallet } from '../../../services/context/WalletContext'
import { useToast } from '../../../components/ToastContext'
import { getAddress } from 'ethers'
import GenericDialog from '../../../components/GenericDialog'
import { useNavigate } from 'react-router-dom'

function index({ project }) {
	console.log('🚀 ~ file: index.jsx:13 ~ index ~ project:', project)
	const [userData, setUserData] = useState({
		...userInputData,
		ipfsHash: `ipfs://${project?.finalCIDR}/`,
		CollectionSize: project?.NftOnIpfsUpload,
	})
	const { walletAddress } = useWallet()
	const [userWalletAddress, setUserWalletAddress] = useState('')
	const [visible, setVisible] = useState(false)
	const [contractDeployResposne, setContractDeployResponse] = useState()
	const toast = useToast()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [downloadLoading, setDownloadLoading] = useState(false)

	useEffect(() => {
		if (walletAddress !== null) {
			setUserWalletAddress(getAddress(walletAddress))
		}
	}, [walletAddress])

	let code = `// SPDX-License-Identifier: MIT
	pragma solidity ^0.8.20;
	
	import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
	import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
	import "@openzeppelin/contracts/access/Ownable.sol";
	
	contract ${userData.Name} is ERC721, ERC721Enumerable, Ownable {
		uint256 private _nextTokenId = 1;
		string private _baseTokenURI;
		uint256 private maxSupply;
	
		constructor() ERC721("${userData.Name}","${userData.Symbol}") Ownable(${userWalletAddress}) {
			_baseTokenURI = "${userData.ipfsHash}";
			maxSupply = ${userData.CollectionSize};
		}
	
		function setBaseTokenURI(string memory baseTokenURI) external onlyOwner {
			_baseTokenURI = baseTokenURI;
		}
	
		function batchMint(address[] memory to) public onlyOwner {
			for (uint256 i; i < to.length; ) {
				safeMint(to[i]);
				unchecked {
					++i;
				}
			}
		}
	
		function safeMint(address to) public onlyOwner {
			uint256 tokenId = _nextTokenId++;
			require(totalSupply()+1 <= maxSupply, "Max token Minted!");
			_safeMint(to, tokenId);
		}
	
		function _baseURI() internal view override returns (string memory) {
			return _baseTokenURI;
		}
	
		function baseURI() public view returns (string memory) {
			return _baseURI();
		}

		function CollectionMaxSupply() public view returns (uint256) {
			return maxSupply;
		}
	
		function tokenURI(uint256 tokenId)
			public
			view
			override
			returns (string memory)
		{
			_requireOwned(tokenId);
			return
				string(
					abi.encodePacked(
						_baseTokenURI,
						Strings.toString(tokenId),
						".json"
					)
				);
		}
	
		// The following functions are overrides required by Solidity.
	
		function _update(
			address to,
			uint256 tokenId,
			address auth
		) internal override(ERC721, ERC721Enumerable) returns (address) {
			return super._update(to, tokenId, auth);
		}
	
		function _increaseBalance(address account, uint128 value)
			internal
			override(ERC721, ERC721Enumerable)
		{
			super._increaseBalance(account, value);
		}
	
		function supportsInterface(bytes4 interfaceId)
			public
			view
			override(ERC721, ERC721Enumerable)
			returns (bool)
		{
			return super.supportsInterface(interfaceId);
		}
	
	}
	`

	const handleUserInputData = (e) => {
		setUserData((prevData) => ({
			...prevData,
			[e.target.name.replace(/\s/g, '')]: e.target.value,
		}))
	}

	const accept = () => {
		return navigate('/dashboard')
	}
	const handleDeployContract = async () => {
		try {
			console.log('Contract Deploying')
			if (walletAddress !== null) {
				if (
					(code !== undefined,
					userData.Name != undefined,
					userData.Symbol !== undefined,
					userData.ipfsHash !== undefined,
					userData.CollectionSize !== undefined,
					walletAddress !== null)
				) {
					setLoading(true)
					const res = await Api.post('user/deploy_smart_contract', {
						SmartContractCode: code,
						projectName: userData.Name,
						projectId: project._id,
						tokenName: userData.Name,
						tokenSymbol: userData.Symbol,
						ipfsHashContract: userData.ipfsHash,
						ownerAddress: getAddress(walletAddress),
						maxCollectionSize: userData.CollectionSize,
					})

					// Validate the response from the first API call
					if ((res.status !== 201 && res.status !== 200) || !res.data) {
						toast.error('Error while deploying contract.')
						console.log('Error while deploying contract.')
						setLoading(false)
						return
					}

					setContractDeployResponse(
						<a
							href={`https://explorer.testnet.mantle.xyz/address/${res.data.contractAddress}`}
							target='_blank'
						>
							Smart Contract Address is : {res.data.contractAddress}
						</a>
					)

					const { contractAddress } = res.data

					const result = await Api.put(`/project/${project._id}`, {
						contractAddress,
						isDeployed: true,
					})

					console.log(result)
					setLoading(false)
					setVisible(true)
				} else {
					toast.error('User Enter Wrong Details!')
				}
			} else {
				toast.error('Please Connect With Metamask')
			}
		} catch (error) {
			console.log('chk2')
		}
	}

	const handleDownloadLatestContract = async () => {
		try {
			setDownloadLoading(true)
			const response = await Api.get(
				'/project_metadata/download-latest-contract',
				{
					responseType: 'blob',
				}
			)

			// Use a predefined filename for the downloaded file
			const filename = 'Smart-contract.sol'
			const blob = new Blob([response.data], {
				type: 'application/octet-stream',
			})
			const url = window.URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = filename
			a.click()
			window.URL.revokeObjectURL(url)
			setDownloadLoading(false)
		} catch (error) {
			console.error('Error downloading latest contract:', error)
		}
	}

	return (
		<div>
			<div className='lg:flex md:flex gap-4'>
				<div className='w-full mb-3'>
					<div className='heading-md'>Token Name</div>
					<InputText
						name='Name'
						value={userData.Name}
						onChange={handleUserInputData}
						className='p-inputtext-custom w-full'
						placeholder='Token Name'
					/>

					<div className='input-comment-text'>
						Name of your NFT Token,No Special characters,max 50,start with a
						letter
					</div>
				</div>
				<div className='w-full mb-3'>
					<div className='heading-md'>Token Symbol</div>
					<InputText
						name='Symbol'
						value={userData.Symbol}
						onChange={handleUserInputData}
						className='p-inputtext-custom w-full'
						placeholder='MTK'
					/>
					<div className='input-comment-text'>
						Symbol of your NFT token,no spaces, max 10 charaters(3 Recommended)
					</div>
				</div>
			</div>
			<div className='w-full mb-3'>
				<div className='heading-md'>Collection Size</div>
				<InputText
					name='CollectionSize'
					value={userData.CollectionSize}
					onChange={handleUserInputData}
					className='p-inputtext-custom w-full'
					placeholder='CollectionSize'
				/>
				<div className='input-comment-text'></div>
			</div>

			<div className='mt-5'>
				<div className='border-top-1 border-300'></div>
			</div>

			<div className='mt-3 lg:flex gap-4 w-full'>
				<div className='lg:w-5'>
					<div className='mb-2 mt-3'>
						<div className='heading-md'>IPFS Hash :</div>
						<div className='w-full font-normal'>
							<InputText
								name='Symbol'
								value={userData.ipfsHash}
								className='p-inputtext-custom w-full'
								placeholder='Metadata Standard'
							/>
						</div>
					</div>

					<div className='mb-2 mt-1'>
						<div className='heading-md'>Metadata Standard :</div>
						<div className='w-full'>
							<InputText
								name='Symbol'
								value={userData.metadataStandard}
								className='p-inputtext-custom w-full'
								placeholder='Metadata Standard'
							/>
						</div>
					</div>

					<div className='mb-2 mt-1'>
						<div className='heading-md'>Token Type :</div>
						<div className='w-full'>
							<InputText
								name='Symbol'
								value={userData.TokenType}
								className='p-inputtext-custom w-full'
								placeholder='Token Type'
							/>
						</div>
					</div>
					<div className='mb-2 mt-1'>
						<div className='heading-md'>Token ID Starts From :</div>
						<div className='w-full'>
							<InputText
								name='tokenIdStartingIndex'
								value={userData.StartingIndex}
								className='p-inputtext-custom w-full'
								placeholder='Token ID Starts From '
							/>
						</div>
					</div>
					<div className='mb-2 mt-1'>
						<div className='heading-md'>Token Standard :</div>
						<div className='w-full'>
							<InputText
								name='tokenStandard'
								value={userData.tokenStandard}
								className='p-inputtext-custom w-full'
								placeholder='Token Standard'
							/>
						</div>
					</div>
				</div>
				<div className='overflow-hidden lg:mt-0 mt-3 w-full'>
					<div className='text-right'>
						<Button
							label='Download'
							className='p-button-sm'
							onClick={handleDownloadLatestContract}
							loading={downloadLoading}
						/>
					</div>
					<SyntaxHighlighter
						language='javascript'
						className='lg:h-20rem w-full border-1 border-300 border-round'
						// style={nord}
					>
						{code || 'No Code Found'}
					</SyntaxHighlighter>
				</div>
			</div>

			<div className='flex gap-2 align-items-center justify-content-center mt-4 mb-4'>
				<Button
					label='Deploy'
					onClick={handleDeployContract}
					className='p-button-sm'
					loading={loading}
				/>
			</div>
			<GenericDialog
				visible={visible}
				onHide={() => accept()}
				header='Success'
				onSubmit={() => accept()}
				saveButtonTitle='Okay'
			>
				{contractDeployResposne}
			</GenericDialog>
		</div>
	)
}

export default index

var userInputData = {
	Name: '',
	Symbol: '',
	metadataStandard: 'Mantle',
	StartingIndex: '1',
	TokenType: 'Basic',
	tokenStandard: 'ERC721',
}
