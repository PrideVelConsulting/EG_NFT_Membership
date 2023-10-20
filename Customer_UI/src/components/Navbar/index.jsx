import { Button } from 'primereact/button'
import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useMetaConnector from '../MetamaskLogin'
import Api from '../../services/Api'

import './Navbar.css'
import companyLogo from '../../assets/customer_logo.png'
import { useWallet } from '../../services/context/WalletContext'

const Navbar = () => {
	const [menuVisible, setMenuVisible] = useState(false)
	const { connectToMeta } = useMetaConnector()
	const navigate = useNavigate()

	const { walletAddress, setWalletAddress } = useWallet()

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

	const handleConnectToMeta = async () => {
		if (!walletAddress) {
			const signer = await connectToMeta()
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
		<nav className='navbar'>
			<div className='container flex justify-content-between flex-wrap'>
				<div className='navbar-header'>
					<Link className='no-underline' to='/'>
						<img
							src={companyLogo}
							alt='Brand logo'
							className='lg:w-9rem w-9rem'
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

				<div className={`navbar-menu flex-grow-1 ${menuVisible && 'active'}`}>
					<ul className='navbar-nav'>
						{!walletAddress ? (
							<li className='navbar-dropdown'>
								<Link className='no-underline' to='/About'>
									<button className='nav-button'>About Hexa</button>
								</Link>
								<Link className='no-underline' to='/ProgrammesOffered'>
									<button className='nav-button'>Programmes Offered</button>
								</Link>
								<Link className='no-underline' to='/AdmissionProcess'>
									<button className='nav-button'>Admission Process</button>
								</Link>
							</li>
						) : (
							<>
								<Link to='/Profile' className='no-underline'>
									<button className='nav-button'>Profile</button>
								</Link>
								<Link to='/Event' className='no-underline'>
									<button className='nav-button'>Event for members</button>
								</Link>
							</>
						)}
					</ul>
					{walletAddress ? (
						<div className='flex align-items-center gap-3'>
							<span className='font-normal text-md text-500'>
								{walletAddress && walletAddress.slice(0, 15) + '...'}
							</span>
							<Button severity='danger' outlined className='p-button-sm p-2'>
								<i className='pi pi-sign-out' onClick={handleLogOut}></i>
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
			</div>
		</nav>
	)
}

export default Navbar
