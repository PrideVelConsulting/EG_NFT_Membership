import React, { useState, useEffect } from 'react'
import { Carousel } from 'primereact/carousel'
import step1 from '../../assets/landing_slider/steps1.png'
import ipfs from '../../assets/BuiltWithTheBest/ipfs.png'
import MetaMask from '../../assets/BuiltWithTheBest/MetaMask.png'
import openzeppelin from '../../assets/BuiltWithTheBest/openzeppelin.png'
import hardhat from '../../assets/BuiltWithTheBest/hardhat.png'
import mantle from '../../assets/BuiltWithTheBest/mantle.png'

function Home() {
	const [products, setProducts] = useState([])

	const jsonData = [
		{
			name: 'Pick and Choose NFT Contract Features',
			step: 'Step 1',
			icon: 'pi pi-cog',
			img_step: step1,
		},
		{
			name: 'Customize and download Metadata Template',
			step: 'Step 2',
			icon: 'pi pi-download',
			img_step: step1,
		},
		{
			name: 'Upload Metadata to IPFS',
			step: 'Step 3',
			icon: 'pi pi-upload',
			img_step: step1,
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
		<div className='container mt-8'>
			<div className='text-center'>
				<h1>Publish Your NFT Collection With 3 Easy Steps</h1>
				<p>
					Seamless Solution For Enterprises to Deploy Metadata and Smart
					Contract For NFT collection
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

			<div className='text-center mt-8 mb-8'>
				<h1>Built With The Best</h1>
				<div className='built-logo-pannel mt-6'>
					<div className='panel-color panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={hardhat} className='w-full px-6 py-2' />
					</div>
					<div className='panel-color panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={ipfs} className='w-full px-6 py-2' />
					</div>
					<div className='panel-color panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={mantle} className='w-full px-6 py-2' />
					</div>
					<div className='panel-color panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={MetaMask} className='w-full px-6 py-2' />
					</div>
					<div className='panel-color panel-color-border border-1 border-round flex align-items-center justify-content-center'>
						<img src={openzeppelin} className='w-full px-6 py-2' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default Home
