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

			// filtering projects based on userAddress
			// const collectionArray = []
			// if (userAddress) {
			//   data.data.map(item => {
			//     console.log(item, item.userAddress, "outside if")
			//     if (item?.userAddress == userAddress && item.userAddress) {
			//       console.log(item, item.userAddress, "inside if")
			//       collectionArray.push(item)
			//     }
			//   })
			// }

			setCollectionData(data.data)
		}

		getData()
	}, [walletAddress])

	const handleVerifyContract = async (data) => {
		const contractAddress = data?.contractAddress

		// Validate contractAddress
		if (!contractAddress) {
			toast.error('Contract address is missing.')
			return
		}

		// Set the 'verifying' state to true to indicate that the verification is in progress
		try {
			const res = await Api.post('user/verify_contract', {
				ContractAddress: contractAddress,
			})

			// Validate the response from the API call
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
					return item._id !== objectId // Use 'return' here
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

		// code for fetching details from contract
		// useEffect(() => {
		//   const fetchContractData = async () => {
		//     if (item.isDeployed) {
		//       const contractAddress = item.contractAddress

		//     const contract = initializeProvider(contractAddress, contractAbi)
		//     const fetchedSymbol = await contract["symbol"]()
		//     const fetchedName = await contract["name"]()
		//     setSymbol(fetchedSymbol)
		//     setName(fetchedName)
		//   }
		// }

		//       const fetchedSymbol = await contract["symbol"]()
		//       const fetchedName = await contract["name"]()
		//       setSymbol(fetchedSymbol)
		//       setName(fetchedName)
		//     }
		//   }

		//   fetchContractData()
		// }, [item])

		return (
			item.isDeployed && (
				<div className='col-3 flex'>
					<div className='panel-color p-3 border-round w-full'>
						<center>
							<span className='card-text-color'>{item.ProjectName}</span>
						</center>
						<div className='text-center'>
							<span className='card-text-color'>
								{item.configurationTab?.tokenName}
							</span>{' '}
							| {''}
							<span className='card-text-color'>
								{item.configurationTab?.tokenSymbol}
							</span>{' '}
							| {''}
							<span className='card-text-color'>
								{item.configurationTab?.tokenstandard === 'Individual' &&
									'ERC-721'}
							</span>
							<span className='card-text-color'>
								{item.configurationTab?.tokenstandard === 'multiple' &&
									'ERC-1155'}
							</span>
							<div className='mt-3 text-md'>
								<a
									href={`https://mumbai.polygonscan.com/address/${item?.contractAddress}`}
									target='_blank' // This opens the link in a new tab
								>
									<i className='pi pi-check text-green-600 font-bold'></i>{' '}
									{item?.contractAddress?.slice(0, 13) + '...'}
								</a>
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
							<div>
								<Button
									text
									className='p-1 px-0 theme-text-color'
									onClick={() => handleVerifyState()}
									loading={verify}
								>
									Verify
								</Button>
							</div>
						</div>
						<div className='flex align-items-center justify-content-center mt-3'>
							<div className='text-center w-full'>
								<p className='m-0 font-bold text-lg'>
									{item.isActive ? 'Live' : 'Inactive'}
								</p>
								<p className='m-0 card-text-color'>Status</p>
								<p className='m-0 font-bold text-lg mt-4'>5556</p>
								<p className='m-0 card-text-color'>Minting Price</p>
							</div>
							<div className='text-center w-full'>
								<p className='m-0 font-bold text-lg'>1/52</p>
								<p className='m-0 card-text-color'>Minted</p>
								<p className='m-0 font-bold text-lg mt-4'>0 Matic</p>
								<p className='m-0 card-text-color'>Balance</p>
							</div>
						</div>
						<div className='mt-5 flex align-items-center justify-content-between'>
							<Link to={`/manage/${item._id}-${item.ProjectName}`}>
								<Button
									label='Manage'
									className={`border-1 theme-border-color w-full p-button-sm ${
										location.pathname.includes('/dashboard') ? '' : ''
									}`}
								/>
							</Link>

							<Link to='/dashboard/Newproject'>
								<Button
									label='Change Metadata'
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
							<h2>Dashboard</h2>
						</div>
						<div>
							<Button
								label='New Project'
								className='btn btn-primary p-button-sm'
								onClick={() => setNewProject(true)}
							/>
						</div>
					</div>
					<TabView>
						<TabPanel header='Deployed Projects'>
							<div className='grid mt-4 cursor-auto'>
								<RenderCards />
							</div>
						</TabPanel>

						<TabPanel header='Draft Projects'>
							<div className='grid mt-4 cursor-auto'>
								{collectionData?.map((item) => {
									if (!item.isDeployed) {
										return (
											<div className='col-3 flex' key={item._id}>
												<div className='text-center panel-color p-3 border-round w-full'>
													<div className='overflow-x-hidden'>
														<h1 className='heading-lg'>{item.ProjectName}</h1>
													</div>
													<div className='my-8'>
														<ProgressBar value={50}></ProgressBar>
													</div>
													<p className='m-0'>
														<span className='text-opacity-6'>Start Date:</span>{' '}
														{item?.createdAt &&
															new Date(item?.createdAt).toLocaleDateString()}
													</p>
													<p className='m-0'>
														<span className='text-opacity-6'>Updated:</span>{' '}
														{item?.updated_at &&
															new Date(item?.updated_at).toLocaleDateString()}
													</p>
													<div className='flex align-items-center justify-content-between mt-4 border-top-1 theme-border-color'>
														<Link to={`/draft/${item._id}-${item.ProjectName}`}>
															<Button text className='p-0 m-0 mt-2 p-button-sm'>
																<i className='pi pi-file-edit text-green-600 mr-1'></i>
																Edit
															</Button>
														</Link>
														<Button
															text
															onClick={() => handleDeleteDialog(item._id)}
															className='p-0 m-0 mt-2 p-button-sm'
														>
															<i className='pi pi-trash mr-1 text-red-600'></i>
															Delete
														</Button>
													</div>
												</div>
											</div>
										)
									}
								})}
							</div>
						</TabPanel>
					</TabView>

					{/* New Project Dialog ------------------------------*/}

					<Dialog
						header='Confirm'
						visible={NewProject}
						onHide={() => {
							setNewProject(false)
							setValue('')
						}}
					>
						<div className='flex align-items-center justify-content-center my-6'>
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

					{/* confirm delete pop up ------------------------------*/}
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
				</div>
			) : (
				<div className='container mt-8 mb-8 pb-8'>
					<div className='flex align-items-center justify-content-between'>
						<div>
							<h2>Deployed Project</h2>
						</div>
						<div>
							<Button label='New Project' className='p-button-sm' />
						</div>
					</div>
					<div className='flex justify-content-center mt-8'>
						{/* <h3>No Project Available. Create New Project</h3> */}
						<div className='w-6 surface-100 p-6 text-center border-round'>
							<h3>
								No Project Available. Create <a href='#'>New Project</a>
							</h3>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Dashboard
