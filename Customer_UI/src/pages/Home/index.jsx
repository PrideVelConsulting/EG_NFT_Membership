import React from 'react'
import membership_card from '../../assets/membership_card.png'
import { Button } from 'primereact/button'

function index() {
	return (
		<div className='container mt-8'>
			<div className='w-full text-center'>
				<img
					src={membership_card}
					alt='NFT Image'
					className='w-6 border-round-top mb-4'
				/>
			</div>
		</div>
	)
}

export default index
