import { Outlet } from 'react-router-dom'
import '../../App.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { Suspense } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer/Footer'
import Comingsoon from '../../../../Customer_UI/src/pages/Comingsoon'

function Layout() {
	return (
		<div className=' w-full m-0 p-0'>
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
