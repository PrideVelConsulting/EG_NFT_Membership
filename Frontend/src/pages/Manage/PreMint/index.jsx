import React, { useEffect, useState } from 'react'
import ApiService from '../../../services/Api'
import Papa from 'papaparse'
import { Chip } from 'primereact/chip' // Import Chip
import FileUploader from './components/FileUploader'
import { Button } from 'primereact/button'
import { useToast } from '../../../components/ToastContext'
import MyDataTable from './components/MyDataTable' // Import MyDataTable
import GenericDialog from '../../../components/GenericDialog'
import Api from '../../../services/Api'
import Abi from '../../../assets/ABIs/EthGlobalABI.json'
import initializeProvider from '../../../services/provider'
import { InputNumber } from 'primereact/inputnumber'
import { ethers } from 'ethers'

const options = [
	{ name: 'name' },
	{ image: 'image' },
	{ description: 'description' },
]

function index({ project }) {
	console.log(project)
	const toast = useToast()
	const [tableData, setTableData] = useState([])
	const [csvIssues, setCsvIssues] = useState()
	const [isUploading, setIsUploading] = useState(false)
	const [totalSupply, setTotalSupply] = useState(0)
	const [isMinting, setIsMinting] = useState(false)
	const [noOfNft, setNoOfNft] = useState(0)

	const contract = initializeProvider(project.contractAddress, project.abi)

	useEffect(() => {
		const getTotalSupply = async () => {
			const totalSupp = await contract['totalSupply']()
			console.log(totalSupp.toString())
			setTotalSupply(Number(totalSupp.toString()))
		}

		getTotalSupply()
	})

	const {
		isOpen: isErrModalOpen,
		onOpen: openErrModal,
		onClose: closeErrModal,
	} = useDisclosure()

	const submit = async () => {
		setIsUploading(true)
		try {
			toast.success(
				'Upload completed',
				'CID For Uploaded Files : ' + res.data.message
			)
		} catch (error) {
			console.error('Error during submit:', error)
			if (csvIssues.length < 0) {
				toast.error('An error occurred during upload. Please try again.')
			}
		} finally {
			setIsUploading(false)
		}
	}

	const handlePreMint = async () => {
		setIsMinting(true)
		const addresses = []

		tableData.map((item) => {
			addresses.push(item.Addresses)
		})

		try {
			const provider = new ethers.BrowserProvider(window.ethereum)
			const signer = await provider.getSigner()

			const contract = new ethers.Contract(
				project.contractAddress,
				project.abi,
				signer
			)
			const result = await contract['batchMint'](addresses)
			console.log(result)

			// const postData = await Api.post('/user/pre_mint', {
			// 	csvData: addresses,
			// 	contractAddress: project.contractAddress,
			// 	id: project._id,
			// })

			// console.log(postData)
			// if (postData.data.success) {
			// 	toast.success('NFTs Minted Successfully!')
			// 	setIsMinting(false)
			// 	setTableData([])
			// }
		} catch (error) {
			console.log(error, 'error')
		}
	}

	return (
		<>
			<div className='flex align-items-center justify-content-between my-4'>
				<div>
					<h1>Pre Mint Tokens </h1>
				</div>

				<div
					className='panel-color theme-border-color border-1 p-2 text-center border-round-sm flex align-items-center gap-1 w-min'
					onClick={() => {
						if (csvIssues?.length > 0) return openErrModal()
					}}
				>
					<i className='pi pi-times-circle' style={{ color: 'red' }}></i>

					<div className='text-md'>
						{csvIssues?.length > 0
							? ` ${csvIssues?.length} invalid address`
							: 0}
					</div>
				</div>
			</div>
			<div className='w-full flex align-items-center justify-content-center'>
				<div className='lg:flex align-items-center gap-3'>
					<div>
						<InputNumber
							placeholder='No of Nfts to mint'
							onChange={(e) => setNoOfNft(e.value)}
						/>
					</div>

					<div className='text-center'>
						<i
							className='pi pi-angle-right text-600'
							style={{ fontSize: '2rem' }}
						></i>
					</div>

					<div>
						<Button
							disabled={!noOfNft}
							onClick={() => createCSV(noOfNft, totalSupply + 1)}
						>
							Download Template
						</Button>
					</div>
					<div className='text-center'>
						<i
							className='pi pi-angle-right text-600'
							style={{ fontSize: '2rem' }}
						></i>
					</div>
					<div>
						<FileUploader
							onDataLoaded={setTableData}
							setCsvIssues={setCsvIssues}
							onFileChange={() => setCsvIssues([])}
							className='p-button-sm'
						/>
					</div>
				</div>
			</div>

			{tableData.length > 0 && (
				<MyDataTable tableData={tableData} project={project} />
			)}
			<div className='text-center mt-8 '>
				<Button
					label={isMinting ? 'Minting...' : 'Mint'}
					loading={isMinting}
					className='my-2'
					icon='pi pi-save'
					iconPos='right'
					disabled={tableData?.length === 0 || isUploading}
					onClick={handlePreMint}
				/>
			</div>
			<GenericDialog
				visible={isErrModalOpen}
				onHide={closeErrModal}
				header='CSV Validation Issues'
			>
				{csvIssues?.map((issue, index) => (
					<div key={index}>
						<p>{issue}</p>
					</div>
				))}
			</GenericDialog>
		</>
	)
}

export default index

function useDisclosure() {
	const [isOpen, setIsOpen] = useState(false)

	const onOpen = () => {
		setIsOpen(true)
	}

	const onClose = () => {
		setIsOpen(false)
	}

	return {
		isOpen,
		onOpen,
		onClose,
	}
}

const createCSV = (n, start) => {
	console.log(n, start)
	console.log(n)
	let csvContent = 'Token ID,Addresses\n'

	for (let i = start; i < start + n; i++) {
		const row = `${i},\n`
		csvContent += row
	}

	const blob = new Blob([csvContent], { type: 'text/csv' })
	const url = window.URL.createObjectURL(blob)

	const a = document.createElement('a')
	a.href = url
	a.download = 'token_data.csv'
	a.click()

	window.URL.revokeObjectURL(url)
}
