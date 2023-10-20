import {
	Route,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom'
import Layout from './_static/layout'
import Home from './Home'
import Dashboard from './Dashboard'
import Project from './Project'
import Manage from './Manage'

// @all For any page please create folder with it's name and have index.jsx in it

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route exact element={<Layout />}>
			<Route exact path='/home' element={<Home />} />
			<Route exact path='/' element={<Home />} />
			<Route exact path='/dashboard' element={<Dashboard />} />
			<Route exact path='/draft/:collectionName' element={<Project />} />
			<Route exact path='/manage/:collectionName' element={<Manage />} />
		</Route>
	)
)

export default router
