import router from './pages/router'
import './MyStyle.css'
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.css'
import { RouterProvider } from 'react-router-dom'
function App() {
	return <RouterProvider router={router} />
}

export default App
