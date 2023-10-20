import React, { useState, useRef, useEffect } from 'react'
import PreMint from './PreMint'

import { Steps } from 'primereact/steps'
import { useParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import Api from '../../services/Api'
import { useToast } from '../../components/ToastContext'
import useProject from '../../services/projectsHooks/useProject'
import { ProgressSpinner } from 'primereact/progressspinner'
import { TabPanel, TabView } from 'primereact/tabview'

const Manage = () => {
	const { collectionName } = useParams()
	const { project, isLoading, setProject } = useProject(
		collectionName.split('-')[0]
	)

	return (
		<>
			{isLoading ? (
				<center>
					<ProgressSpinner />
				</center>
			) : (
				<div className='container mt-4'>
					<TabView>
						<TabPanel header='Pre-Mint'>
							<PreMint project={project} />
						</TabPanel>
					</TabView>
				</div>
			)}
		</>
	)
}

export default Manage
