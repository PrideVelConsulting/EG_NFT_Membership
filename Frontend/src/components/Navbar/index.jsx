import { Button } from 'primereact/button'
import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import './Navbar.css'
import companyLogo from '../../assets/cadmus_logo_webpage.png'
import useMetaConnector from '../MetamaskLogin'
import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog'
import { useWallet } from '../../services/context/WalletContext'
import Api from '../../services/Api'

const Navbar = () => {
	const [menuVisible, setMenuVisible] = useState(false)
	const { connectToMeta } = useMetaConnector()
	const { setWalletAddress, walletAddress } = useWallet()
	const location = useLocation()
	const currentURL = location.pathname
	const navigate = useNavigate()

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
		} else {
			const res = await Api.get('/user/logout')

			if (res.data.success) {
				console.log('user signed out')
				setWalletAddress(null)
			}
		}
	}

	return (
		<>
			<nav className='container navbar mt-3'>
				<div className='flex justify-content-between flex-wrap'>
					<div className='navbar-header'>
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

					<div className={`navbar-menu flex-grow-1 ${menuVisible && 'active'}`}>
						<ul className='navbar-nav lg:w-full md:w-full lg:mt-0 mt-4'>
							<li className='navbar-dropdown flex justify-content-between gap-3'>
								<div className='lg:ml-8'>
									<button
										className='nav-button active'
										onClick={() => {
											console.log('first')
											if (currentURL?.split('/')[1] === 'draft') {
												confirm()
											} else {
												navigate('/dashboard')
											}
										}}
									>
										Dashboard
									</button>
								</div>

								<div>
									<Button
										label={
											walletAddress
												? walletAddress.slice(0, 5) + '...' + '| Log out'
												: `Connect`
										}
										className='btn btn-primary p-button-sm'
										onClick={handleConnectToMeta}
									/>
								</div>
							</li>
						</ul>
					</div>
				</div>
				<div className='border-top-1 theme-border-color'></div>
			</nav>
			<ConfirmDialog />
		</>
	)
}

export default Navbar
