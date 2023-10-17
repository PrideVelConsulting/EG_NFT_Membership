import React, { useState, useEffect } from 'react'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { ProgressBar } from 'primereact/progressbar'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Dialog } from 'primereact/dialog'
import { TabView, TabPanel } from 'primereact/tabview'
import { Message } from 'primereact/message'
import Api from '../../services/Api'
import { useToast } from '../../components/ToastContext'
import { useWallet } from '../../services/context/WalletContext'
import { CopyToClipboard } from 'react-copy-to-clipboard'

const Dashboard = () => {
	const [value, setValue] = useState('')
	const toast = useToast()
	const [NewProject, setNewProject] = useState(false)
	const [collectionData, setCollectionData] = useState([])
	const [deleteDialog, setDeleteDialog] = useState(false)
	const [objectId, setObjectId] = useState('')
	const [dialogValidation, setDialogValidation] = useState(false)

	const location = useLocation()

	const navigate = useNavigate()
	const { walletAddress } = useWallet()

	useEffect(() => {
		const getData = async () => {
			const data = await Api.get('/project')

			setCollectionData(data.data)
		}

		getData()
	}, [walletAddress])

	const handleVerifyContract = async (data) => {
		const contractAddress = data?.contractAddress

		if (!contractAddress) {
			toast.error('Contract address is missing.')
			return
		}

		try {
			const res = await Api.post('user/verify_contract', {
				ContractAddress: contractAddress,
			})

			if (res.status === 201 && res.data) {
				toast.success('Smart contract verified successfully!')
				console.log('Smart contract verified successfully:', res.data)
			} else {
				toast.error('Error while verifying smart contract.')
			}
		} catch (error) {
			toast.error('An error occurred: ' + error.message)
			console.error('An error occurred:', error)
		}
	}

	const handleDeleteDialog = async (id) => {
		setDeleteDialog(true)
		setObjectId(id)
	}

	const deleteRecord = async () => {
		const resp = await Api.delete(`/project/${objectId}`)

		if (resp.status === 200) {
			setDeleteDialog(false)
			setCollectionData((prev) => {
				return prev.filter((item) => {
					return item._id !== objectId
				})
			})
		}
	}

	const handlePost = async () => {
		if (value) {
			if (value.includes('/') || value.includes('\\')) {
				return toast.error(
					'Name error',
					"Space are not allowed use '\\,/' instead"
				)
			}
			setNewProject(false)
			try {
				const resp = await Api.post('/project', {
					projectName: value,
					isDeployed: false,
					userAddress: '',
				})
				navigate(`/draft/${resp.data._id}-${resp.data.projectName}`)
			} catch (error) {
				toast.error(error.response.data.error)
				setValue('')
			}
		} else {
			setDialogValidation(true)
		}
	}

	const RenderCard = ({ item }) => {
		const [symbol, setSymbol] = useState('')
		const [name, setName] = useState('')
		const [verify, setVerifying] = useState(false)

		const handleVerifyState = async () => {
			setVerifying(true)
			await handleVerifyContract(item)
			setVerifying(false)
		}

		return (
			item.isDeployed && (
				<div className='lg:col-3 md:col-4 sm:col-6 col-12 flex'>
					<div className='text-center bg-white border-1 panel-color-border border-round w-full px-5 pb-4'>
						<h3 className='text-center text-xl'>{item.projectName}</h3>
						<div className='flex align-items-center justify-content-center gap-1 mb-4'>
							<div className='card-text-color font-semibold text-lg'>
								ERC 721
							</div>

							<div className='flex align-items-center justify-content-center gap-1'>
								<div> | </div>
								<div>
									<a
										href={`https://explorer.testnet.mantle.xyz/address/${item?.contractAddress}`}
										target='_blank' // This opens the link in a new tab
									>
										{item?.contractAddress?.slice(0, 13) + '...'}
									</a>
								</div>
								<div>
									<CopyToClipboard text={item.contractAddress}>
										<Button
											onClick={() => toast.success('Address Copied!')}
											text
											className='p-1 px-0'
										>
											<i className='pi pi-copy theme-text-color'></i>
										</Button>
									</CopyToClipboard>
								</div>
							</div>
						</div>
						<div className='mt-6'>
							<div className='flex align-items-center justify-content-between'>
								<div className='text-center'>
									<p className='m-0 font-semibold text-lg'>Name </p>
									<p className='m-0 card-text-color'>Status</p>
								</div>
								<div className='text-center'>
									<p className='m-0 font-semibold text-lg'>Symbol</p>
									<p className='m-0 card-text-color'>Minted</p>
								</div>
							</div>
							<div className='mt-6'>
								<p className='m-0 font-semibold text-lg'>Total Supply</p>
								<p className='m-0 card-text-color'>Minting Price</p>
							</div>
						</div>
						<div className='mt-5 flex align-items-center justify-content-center'>
							<Link to={`/manage/${item._id}-${item.projectName}`}>
								<Button
									label='Manage'
									className={`border-1 theme-border-color w-full p-button-sm ${
										location.pathname.includes('/dashboard') ? '' : ''
									}`}
								/>
							</Link>
						</div>
					</div>
				</div>
			)
		)
	}

	const RenderCards = () => {
		console.log(collectionData.length)
		return (
			<>
				{collectionData.map((item, index) => (
					<React.Fragment key={item._id}>
						<RenderCard item={item} index={index} />
					</React.Fragment>
				))}
			</>
		)
	}

	return (
		<>
			{walletAddress ? (
				<div className='container mt-4 cursor-pointer'>
					<div className='flex align-items-center justify-content-between'>
						<div>
							<h2>Deployed</h2>
						</div>
						<div>
							<Button
								label='New Project'
								className='btn btn-primary p-button-sm'
								onClick={() => setNewProject(true)}
							/>
						</div>
					</div>
					{collectionData.length > 0 ? (
						<div className='grid mt-4 cursor-auto'>
							<RenderCards />
						</div>
					) : (
						<div className='flex justify-content-center mt-8'>
							<div className='w-6 bg-white p-6 text-center border-round'>
								<h3>
									No Project Available. Create{' '}
									<a onClick={() => setNewProject(true)}>New Project</a>
								</h3>
							</div>
						</div>
					)}
				</div>
			) : (
				<div className='container mt-8 mb-8 pb-8'>
					<div className='flex justify-content-center mt-8'>
						<div className='w-6 surface-100 p-6 text-center border-round'>
							<h3>Wallet Connection Required</h3>
						</div>
					</div>
				</div>
			)}

			<Dialog
				header='Confirm'
				visible={NewProject}
				onHide={() => {
					setNewProject(false)
					setValue('')
				}}
			>
				<div className='flex align-items-center justify-content-center mb-4'>
					<div className='mr-2'> Project Name</div>
					<InputText
						value={value}
						onChange={(e) => {
							setValue(e.target.value)
							setDialogValidation(false)
						}}
						className={`p-inputtext-custom ${
							dialogValidation && 'p-invalid m3'
						}`}
						placeholder=''
						autoFocus
					/>
				</div>
				{dialogValidation && (
					<Message severity='error' text='Name is required' />
				)}
				<Button
					label='Confirm'
					className={`border-1 theme-border-color w-full p-button-sm ${
						location.pathname.includes('/dashboard') ? '' : ''
					}`}
					onClick={handlePost}
				/>
			</Dialog>

			<Dialog
				header='Confirm'
				visible={deleteDialog}
				onHide={() => setDeleteDialog(false)}
			>
				<p>Do you want to delete this record?</p>
				<Button
					label='Confirm'
					className={`border-1 theme-border-color w-full p-button-sm ${
						location.pathname.includes('/dashboard') ? '' : ''
					}`}
					onClick={deleteRecord}
				/>
			</Dialog>
		</>
	)
}

export default Dashboard
