import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import './Navbar.css'
import companyLogo from '../../assets/cadmus_logo_webpage.png'
import useMetaConnector from '../MetamaskLogin'
import { useWallet } from '../../services/context/WalletContext'

const Navbar = () => {
	const [menuVisible, setMenuVisible] = useState(false)
	const { connectToMeta } = useMetaConnector()
	const { walletAddress } = useWallet()

	const handleConnectToMeta = async () => {
		const signer = await connectToMeta()
	}

	return (
		<nav className='container navbar mt-3'>
			<div className='flex justify-content-between flex-wrap'>
				<div className='navbar-header'>
					<Link className='no-underline' to='/'>
						<img
							src={companyLogo}
							alt='Brand logo'
							className='lg:w-14rem w-13rem'
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
					<ul className='navbar-nav lg:w-full md:w-full lg:mt-0 mt-4'>
						<li className='navbar-dropdown flex justify-content-between gap-3'>
							<div className='lg:ml-8'>
								<Link className='no-underline active' to='/dashboard'>
									<button className='nav-button active'>Dashboard</button>
								</Link>
							</div>

							<div>
								<Button
									label={
										walletAddress
											? walletAddress.slice(0, 15) + '...'
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
	)
}

export default Navbar
