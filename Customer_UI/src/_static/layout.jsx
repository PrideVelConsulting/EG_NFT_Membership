import { Outlet } from 'react-router-dom'
import '../App.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { Suspense } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer/Footer'
// import Navbar from '../../components/Navbar'

function Layout() {
	return (
		<div>
			{/* NavBar will come here */}
			<Navbar />
			<div className='content'>
				<div>
					<Suspense>
						<Outlet />
					</Suspense>
				</div>
			</div>
			{/* Footer will come here */}
			<Footer />
		</div>
	)
}

export default Layout
