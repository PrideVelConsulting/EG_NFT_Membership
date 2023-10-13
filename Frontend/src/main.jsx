import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ToastProvider from './components/ToastContext.jsx'
import { WalletProvider } from './services/context/WalletContext.jsx'
import { QueryClient, QueryClientProvider } from 'react-query'
const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<WalletProvider>
				<ToastProvider>
					<App />
				</ToastProvider>
			</WalletProvider>
		</QueryClientProvider>
	</React.StrictMode>
)
