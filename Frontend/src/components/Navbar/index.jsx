import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import './Navbar.css'
import companyLogo from '../../assets/cadmus_logo_webpage.png'
import useMetaConnector from '../MetamaskLogin'
import { useWallet } from '../../services/context/WalletContext'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import FileUploader from '../../components/csvFileUpload/FileUploader'
import Api from '../../services/Api'

const Navbar = () => {
	const [menuVisible, setMenuVisible] = useState(false)
	const { connectToMeta } = useMetaConnector()
	const { walletAddress, setWalletAddress } = useWallet()
	const location = useLocation()
	const currentURL = location.pathname
	const navigate = useNavigate()

	useEffect(() => {
		const handleAuthReq = async () => {
			const res = await Api.get('/user/get_auth')
			console.log(res.data)
			if (res.data.walletAddress) {
				setWalletAddress(res.data.walletAddress)
			}
		}

		handleAuthReq()
	})

	const acceptFunc = () => {
		Api.delete(`/project/${currentURL.split('/')[2].split('-')[0]}`)
		return navigate('/dashboard')
	}

	const confirm = (event) => {
		confirmDialog({
			message: 'Project will be Deleted',
			header: 'Are you sure you want to proceed?',
			icon: 'pi pi-exclamation-triangle',
			accept: () => acceptFunc(),
		})
	}

	const handleConnectToMeta = async () => {
		if (!walletAddress) {
			const signer = await connectToMeta()
			console.log(signer)
			if (signer) {
				return navigate('/dashboard')
			}
		}
	}

	const handleLogOut = async () => {
		const res = await Api.get('/user/logout')

		if (res.data.success) {
			console.log('user signed out')
			setWalletAddress(null)
		}
	}

	return (
		<>
			<nav className='navbar'>
				<div className='container'>
					<div className='flex justify-content-between flex-wrap'>
						<div className='navbar-header'>
							<Link className='no-underline' to='/'>
								<img
									src={companyLogo}
									alt='Brand logo'
									className='lg:w-14rem w-13rem'
									onClick={() => {
										if (currentURL?.split('/')[1] === 'draft') {
											confirm()
										} else {
											navigate('/')
										}
									}}
								/>
							</Link>
							<button
								className='navbar-toggler'
								onClick={() => {
									setMenuVisible((prev) => !prev)
								}}
							>
								<span></span>
								<span></span>
								<span></span>
							</button>
						</div>

						<div
							className={`navbar-menu flex-grow-1 ${menuVisible && 'active'}`}
						>
							<ul className='navbar-nav lg:w-full md:w-full lg:mt-0 mt-4'>
								<li className='navbar-dropdown flex align-items-center justify-content-between gap-3'>
									<div className='lg:ml-8'>
										{/* <Link className='no-underline active' to='/dashboard'> */}
										<button
											className='nav-button active'
											onClick={() => {
												if (currentURL?.split('/')[1] === 'draft') {
													confirm()
												} else {
													navigate('/dashboard')
												}
											}}
										>
											Dashboard
										</button>
										{/* </Link> */}
									</div>

									<div>
										{/* <FileUploader /> */}
										{/* <Button label='getReq' onClick={handleGetReq} /> */}
										{walletAddress ? (
											<div className='flex align-items-center gap-3'>
												<span className='font-normal text-md text-700'>
													{walletAddress && walletAddress.slice(0, 15) + '...'}
												</span>

												<Button
													severity='danger'
													outlined
													className='p-button-sm p-2'
												>
													<i
														className='pi pi-sign-out'
														onClick={handleLogOut}
													></i>
												</Button>
											</div>
										) : (
											<Button
												label='Connect'
												className='btn btn-primary p-button-sm'
												onClick={handleConnectToMeta}
											/>
										)}
									</div>
								</li>
							</ul>
						</div>
					</div>
					{/* <div className='border-top-1 navbar-border'></div> */}
				</div>
			</nav>
			<ConfirmDialog />
		</>
	)
}

export default Navbar
