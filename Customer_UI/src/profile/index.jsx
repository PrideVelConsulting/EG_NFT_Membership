import nftimg2 from '../assets/images.jfif'

const Profile = () => {
	const userData = {
		name: 'John Doe',
		Role: 'User.',
		email: 'johndoe@gmail.com',
		Contact: '9820666278',
		age: 30,
		dateOfBirth: 'January 1, 1993',
		Education: 'MCA',
		profession: 'Blockchain Developer.',
	}

	return (
		<div className='w-full lg:flex justify-content-center'>
			<div
				className='bg-white border-round border-2 border-200 text-800 py-3 px-4'
				style={{
					width: '480px',
					height: '265px',
				}}
			>
				<div>
					<div className='flex align-items-center gap-6'>
						<div className='text-center mt-3'>
							<img
								src={nftimg2}
								alt='Profile Image'
								style={{
									width: '120px',
									height: '120px',
									borderRadius: '50%',
								}}
							/>
							<h3 className='mt-2 m-0'>{userData.name}</h3>
							<p className='m-1'>Education: {userData.Education}</p>
						</div>
						<div className='profile-info'>
							<p>Email: {userData.email}</p>
							<p>Age: {userData.age}</p>
							<p>Date of Birth: {userData.dateOfBirth}</p>
							<p>Contact Number: {userData.Contact}</p>

							<p>Profession: {userData.profession}</p>
							<p>Role: {userData.Role}</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Profile
