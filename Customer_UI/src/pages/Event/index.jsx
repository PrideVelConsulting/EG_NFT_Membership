import React from 'react'
import nftimg1 from '../../assets/Machinelearning.png'
import nftimg2 from '../../assets/blockchain_technology.png'
import { Button } from 'primereact/button'
import { useNavigate } from 'react-router-dom'

function index() {
	const navigate = useNavigate()
	return (
		<div className='container mt-8'>
			<div className='eventgrid-pannel'>
				<div className='bg-white border-round border-2 border-200'>
					<img
						src={nftimg1}
						alt='NFT Image'
						className='w-full border-round-top'
					/>
					<div className='px-6 py-2'>
						<div className='flex align-items-center justify-content-between text-600 font-normal mt-4'>
							<div>Wed, Oct 20th </div>
							<div>10:25am</div>
						</div>
						<h1 className='text-900 text-center mt-4'>
							The Complete Machine Learning Course with Python
						</h1>
						<div className='text-center text-xl font-semibold'>
							<span className='text-600'>Presenter name : </span>
							<span className='text-900'>NFTs Impact</span>
						</div>
					</div>

					<div className='text-center mt-5'>
						<Button
							label='Join'
							className='mb-6'
							onClick={() => navigate('/EventDetails/python')}
						/>
					</div>
				</div>

				<div className='bg-white border-round border-2 border-200'>
					<img
						src={nftimg2}
						alt='NFT Image'
						className='w-full border-round-top'
					/>
					<div className='px-6 py-2'>
						<div className='flex align-items-center justify-content-between text-600 font-normal mt-4'>
							<div>Wed, Oct 11th </div>
							<div>11:25am</div>
						</div>
						<h1 className='text-900 text-center mt-4'>
							Blockchain and Bitcoin Fundamentals
						</h1>
						<div className='text-center text-xl font-semibold'>
							<span className='text-600'>Presenter name : </span>
							<span className='text-900'>NFTs Impact</span>
						</div>
					</div>

					<div className='text-center mt-5'>
						<Button
							label='Join'
							className='mb-6'
							onClick={() => navigate('/EventDetails/blockchain')}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default index
