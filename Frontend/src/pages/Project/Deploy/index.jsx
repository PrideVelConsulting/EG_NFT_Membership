import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Button } from 'primereact/button'
import Api from '../../../services/Api'
import useWallet from '../../../services/context/WalletContext'
import { useToast } from '../../../components/ToastContext'

function index({ project, isLoading }) {
	const [userData, setUserData] = useState(userInputData)
	const { walletAddress } = useWallet()
	const toast = useToast()

	const handleUserInputData = (e) => {
		setUserData((prevData) => ({
			...prevData,
			[e.target.name]: e.target.value,
		}))
	}

	const handleDeployContract = async () => {
		try {
			const deployContractName = userData.Name
			console.log('Contract Deploying')

			const res = await Api.post('user/deploy_smart_contract', {
				projectName: deployContractName,
				projectId: project._id,
				tokenName: userData.Name,
				tokenSymbol: userData.Symbol,
				ipfsHashContract: userData.ipfsHashContract,
				ownerAddress: walletAddress,
				maxCollectionSize: userData.CollectionSize,
			})

			// Validate the response from the first API call
			if ((res.status !== 201 && res.status !== 200) || !res.data) {
				toast.error('Error while deploying contract.')
				console.log('Error while deploying contract.')
				return
			}
			toast.sucess('Contract deployed successfully!')
		} catch (error) {
			console.log(error)
		}
	}

	const handleDownloadLatestContract = async () => {
		try {
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
					name='bjdbnb'
					value={userData.CollectionSize}
					onChange={handleUserInputData}
					className='p-inputtext-custom w-full'
					placeholder='Colledcti'
				/>
				<div className='input-comment-text'>
					Overall Collection Size Dummy text Overall Collection Size Dummy text
				</div>
			</div>

			<div className='mt-8'>
				<div className='border-top-1 border-300'></div>
			</div>

			<div className='mt-8 lg:flex gap-4'>
				<div>
					<div className='flex gap-3 align-items-center mb-2 mt-3'>
						<div className='heading-md lg:w-25rem w-12rem text-right'>
							IPFS Hash :
						</div>
						<div className='w-full font-normal'>
							<InputText
								name='Symbol'
								value={userData.ipfsHash}
								className='p-inputtext-custom w-full'
								placeholder='Metadata Standard'
							/>
						</div>
					</div>

					<div className='flex gap-3 align-items-center mb-2'>
						<div className='heading-md lg:w-25rem w-12rem text-right'>
							Metadata Standard :
						</div>
						<div className='w-full'>
							<InputText
								name='Symbol'
								value={userData.metadataStandard}
								className='p-inputtext-custom w-full'
								placeholder='Metadata Standard'
							/>
						</div>
					</div>

					<div className='flex gap-3 align-items-center mb-2'>
						<div className='heading-md lg:w-25rem w-12rem text-right'>
							Token Type :
						</div>
						<div className='w-full'>
							<InputText
								name='Symbol'
								value={userData.TokenType}
								className='p-inputtext-custom w-full'
								placeholder='Token Type'
							/>
						</div>
					</div>
					<div className='flex gap-3 align-items-center mb-2'>
						<div className='heading-md text-right lg:w-25rem w-12rem'>
							Token ID Starts From :
						</div>
						<div className='w-full'>
							<InputText
								name='tokenIdStartingIndex'
								value={userData.StartingIndex}
								className='p-inputtext-custom w-full'
								placeholder='Token ID Starts From '
							/>
						</div>
					</div>
					<div className='flex gap-3 align-items-center mb-2'>
						<div className='heading-md text-right lg:w-25rem w-12rem'>
							Token Standard :
						</div>
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
				<div className='overflow-hidden lg:mt-0 mt-3'>
					<SyntaxHighlighter
						language='javascript'
						className='lg:h-20rem w-full'
						// style={nord}
					>
						{code || 'No Code Found'}
					</SyntaxHighlighter>
				</div>
			</div>

			<div className='flex gap-2 align-items-center justify-content-center mt-6 mb-8'>
				<Button
					label='Deploy'
					onClick={handleDeployContract}
					className='p-button-sm'
				/>
				<Button
					label='Download'
					className='p-button-sm'
					onClick={handleDownloadLatestContract}
				/>
				<Button label='Upload' className='p-button-sm' />
			</div>
		</div>
	)
}

export default index

const code = `// SPDX-License-Identifier: MIT
	pragma solidity ^0.8.20;
	
	import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
	import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
	import "@openzeppelin/contracts/access/Ownable.sol";
	
	contract EthGlobal is ERC721, ERC721Enumerable, Ownable {
		uint256 private _nextTokenId;
		string private _baseTokenURI;
	
		constructor(
			string memory name,
			string memory symbol,
			string memory baseTokenURI,
			address initialOwner
		) ERC721(name, symbol) Ownable(initialOwner) {
			_baseTokenURI = baseTokenURI;
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
			_safeMint(to, tokenId);
		}
	
		function _baseURI() internal view override returns (string memory) {
			return _baseTokenURI;
		}
	
		function baseURI() public view returns (string memory) {
			return _baseURI();
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

var userInputData = {
	Name: 'MyToken',
	Symbol: 'MTK',
	CollectionSize: '0',
	ipfsHash:
		'https://bafybeib2v3jdyoldb5ub2afo36sul5ecrcc3hw6y6lypqeugpoxqlfehh4.ipfs.nftstorage.link',
	metadataStandard: 'Mantle',
	StartingIndex: '0',
	TokenType: 'Basic',
	tokenStandard: 'ERC721',
}
