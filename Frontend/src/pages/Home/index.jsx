import React, { useState, useEffect } from 'react'
import { Carousel } from 'primereact/carousel'
import step1 from '../../assets/landing_slider/steps1.png'
import step2 from '../../assets/landing_slider/steps2.png'
import step3 from '../../assets/landing_slider/steps3.png'
import ipfs from '../../assets/BuiltWithTheBest/ipfs.png'
import MetaMask from '../../assets/BuiltWithTheBest/MetaMask.png'
import openzeppelin from '../../assets/BuiltWithTheBest/openzeppelin.png'
import hardhat from '../../assets/BuiltWithTheBest/hardhat.png'
import mantle from '../../assets/BuiltWithTheBest/mantle.png'
import membership_card from '../../assets/membership_card.png'

function Home() {
	const [products, setProducts] = useState([])

	const jsonData = [
		{
			name: 'Create Metadata Template For Your Members',
			step: 'Step 1',
			icon: 'pi pi-cog',
			img_step: step1,
		},
		{
			name: 'Upload Metadata to IPFS',
			step: 'Step 2',
			icon: 'pi pi-download',
			img_step: step2,
		},
		{
			name: 'Deploy Smart Contract',
			step: 'Step 3',
			icon: 'pi pi-upload',
			img_step: step3,
		},
	]

	const productTemplate = (product) => {
		return (
			<div>
				<div className='landing-slider-bgcolor border-round'>
					<div className='flex align-items-center gap-6 px-6 py-5'>
						<div className='w-4'>
							<div className='landing-slider-step-text border-round max-w-max'>
								{product.step}
							</div>
							<div className='text-4xl font-semibold text-white mt-4'>
								{product.name}
							</div>
						</div>

						<div className='w-8'>
							<img className='w-full border-round' src={product.img_step} />
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className='container mt-8 '>
			<div className='text-center'>
				<h1>Create your NFT membership projects in 3 easy steps</h1>
				<p>
					Zero/Low Code Solution For Enterrprises to Deploy Metadata and Smart
					contract For NFT Memberships
				</p>
			</div>

			<div className='flex align-items-center justify-content-center mt-6'>
				<Carousel
					value={jsonData}
					numVisible={1}
					numScroll={1}
					itemTemplate={productTemplate}
					autoplayInterval={2000}
					className='w-full'
				/>
			</div>
			<div className='mt-8 mb-8 pt-4'>
				<div className='flex gap-6'>
					<div className='w-7'>
						<h1>Instant NFT Membership for your subscribers</h1>
						<h2 className='font-normal'>
							Powered by Non-Fungible Token Standard(ERC-721)
						</h2>
						<div className='list-arrow'>
							<ul className='text-lg font-normal'>
								<li>VIP Access To Exclusive Events</li>
								<li>Avail Special Discounts</li>
								<li>Opportunity To Earn </li>
								<li>Tradable Memberships</li>
							</ul>
						</div>
					</div>
					<div className='w-5'>
						<img className='w-full border-round' src={membership_card} />
					</div>
				</div>
			</div>
			<div className='text-center mt-8 mb-8 pt-4'>
				<h1>Built With The Best</h1>
				<div className='built-logo-pannel mt-6'>
					<div className='built-pannel-bg panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={hardhat} className='w-full px-6 py-2' />
					</div>
					<div className='built-pannel-bg panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={ipfs} className='w-full px-6 py-2' />
					</div>
					<div className='built-pannel-bg panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={mantle} className='w-full px-6 py-2' />
					</div>
					<div className='built-pannel-bg panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={MetaMask} className='w-full px-6 py-2' />
					</div>
					<div className='built-pannel-bg panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={openzeppelin} className='w-full px-6 py-2' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
