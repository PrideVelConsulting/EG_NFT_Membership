import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom'

import Home from './Home'
import Event from './Event'
import EventDetails from './EventDetails'

import Layout from '../_static/layout'
import Profile from '../../../Customer_UI/src/profile/index'
import Comingsoon from './Comingsoon'

// @all For any page please create folder with it's name and have index.jsx in it

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route exact element={<Layout />}>
			<Route exact path='/' element={<Home />} />
			<Route exact path='/Event' element={<Event />} />
			<Route exact path='/EventDetails/:eventName' element={<EventDetails />} />
			<Route path='/profile' element={<Comingsoon />} />
			<Route path='/comingsoon' element={<Comingsoon />} />
			<Route path='/About' element={<Comingsoon />} />
			<Route path='/ProgrammesOffered' element={<Comingsoon />} />
			<Route path='/AdmissionProcess' element={<Comingsoon />} />
		</Route>
	)
)

export default router
