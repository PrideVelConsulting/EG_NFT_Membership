import React from 'react'
import group_meet from '../../assets/group_meet.png'
import { Button } from 'primereact/button'
import { useParams } from 'react-router-dom'

function index() {
	const { eventName } = useParams()
	return (
		<div className='container mt-6'>
			<h1 className='text-center'>
				{eventName === 'python'
					? 'The Complete Machine Learning Course with Python '
					: 'Blockchain and Bitcoin Fundamentals'}{' '}
			</h1>
			<div className='flex gap-2 mt-6'>
				<div className='w-full flex align-items-center justify-content-center'>
					<img src={group_meet} alt='NFT Image' className='w-8 border-round' />
					{/* <iframe
						width='600'
						height='350'
						className='border-round'
						src='https://www.youtube.com/embed/AYm3oKqrV58?si=k4scht0MV2jPav5F'
						title='YouTube video player'
						frameborder='0'
						allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
						allowfullscreen
					></iframe> */}
				</div>
			</div>
		</div>
	)
}

export default index
