import React from 'react'
import { InputText } from 'primereact/inputtext'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { Button } from 'primereact/button'

function index() {
	return (
		<div>
			<div className='lg:flex md:flex gap-4'>
				<div className='w-full mb-3'>
					<div className='heading-md'>Token Name</div>
					<InputText
						name='Name'
						value=''
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
						value=''
						className='p-inputtext-custom w-full'
						placeholder='MTK'
					/>
					<div className='input-comment-text'>
						Symbol of your NFT token,no spaces, max 10 charaters(3 Recommended)
					</div>
				</div>
			</div>
			<div className='w-full mb-3'>
				<div className='heading-md'>Token Symbol</div>
				<InputText
					name='Symbol'
					value=''
					className='p-inputtext-custom w-full'
					placeholder='Overall Collection Size'
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
						<div className='w-full font-normal'>lable Text</div>
					</div>

					<div className='flex gap-3 align-items-center mb-2'>
						<div className='heading-md lg:w-25rem w-12rem text-right'>
							Metadata Standard :
						</div>
						<div className='w-full'>
							<InputText
								name='Symbol'
								value=''
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
								value=''
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
								name='Symbol'
								value=''
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
								name='Symbol'
								value=''
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
				<Button label='Deploy' className='p-button-sm' />
				<Button label='Download' className='p-button-sm' />
				<Button label='Upload' className='p-button-sm' />
			</div>
		</div>
	)
}

export default index

const code =
	'// SPDX-License-Identifier: MIT\r\npragma solidity ^0.8.9;\r\n\r\n import "@openzeppelin/contracts/access/Ownable.sol"; \r\n import "@openzeppelin/contracts/security/Pausable.sol";\r\n import "@openzeppelin/contracts/token/ERC721/ERC721.sol";\r\n import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";\r\nimport "@openzeppelin/contracts/utils/Strings.sol";\r\nimport "@openzeppelin/contracts/utils/Counters.sol";\r\n\r\ncontract MyToken is ERC721, ERC721Enumerable, Ownable, Pausable {\r\n\r\n  using Strings for uint256;\r\n  string private baseURIextended;\r\n\r\n  using Counters for Counters.Counter;\r\n\r\n  Counters.Counter private tokenIdCounter;\r\n      \r\n  uint256 public price = 10;\r\n \r\n  constructor() ERC721("MyToken", "MTK") {   }\r\n\r\n function Mint(address to) public onlyOwner {\r\n    uint256 tokenId = tokenIdCounter.current();\r\n    tokenIdCounter.increment();\r\n    safeMint(to, tokenId+1);\r\n  }\r\n\r\nfunction priceChange(uint256 price) public onlyOwner {\r\n          price = price;\r\n      }\r\n\r\nfunction tokenURI(uint256 tokenId) public view virtual override returns (string memory) {\r\n      requireMinted(tokenId);\r\n\r\n      string memory baseURI = baseURI();\r\n      return bytes(baseURI).length > 0 ? string(abi.encodePacked(baseURI, tokenId.toString(),".json")) : "";\r\n  }\r\n\r\n   function setBaseURI(string memory baseURI) public onlyOwner {\r\n    baseURIextended = baseURI;\r\n  }\r\n\r\n  function baseURI() internal view virtual override  returns (string memory) {\r\n      return _baseURIextended;\r\n  }\r\n\r\nfunction withdraw() external {\r\n      uint256 balance = address(this).balance;\r\n      require(balance > 0, "Insufficent funds");\r\n      payable(owner()).transfer(balance);\r\n  }\r\n}'
