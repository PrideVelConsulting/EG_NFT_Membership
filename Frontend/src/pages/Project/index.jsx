import React, { useState, useRef, useEffect } from 'react'
import Metadata from './Metadata'
import Deploy from './Deploy'
import Template from './Template'
import { Steps } from 'primereact/steps'
import { useParams } from 'react-router-dom'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import Api from '../../services/Api'
import { useToast } from '../../components/ToastContext'
import useProject from '../../services/projectsHooks/useProject'
import { ProgressSpinner } from 'primereact/progressspinner'

const Project = () => {
	const [activeIndex, setActiveIndex] = useState(0)
	const { collectionName } = useParams()
	const projectName = collectionName.split('-')[1]
	const [doEdit, setDoEdit] = useState(false)
	const [value, setValue] = useState(projectName)
	const [title, setTitle] = useState(projectName)
	const { project, isLoading, setProject } = useProject(
		collectionName.split('-')[0]
	)

	const toast = useToast()

	const [visited, setVisited] = useState({
		0: true,
		1: false,
		2: false,
		3: false,
		4: false,
	})
	const errors = [
		"YOu'll never see this error",
		'Save a valid template first',
		'Upload the CSV file first',
		'Upload the metadata to IPFS first',
		'Generate the contract file first',
	]
	const selectTab = (index) => {
		if (visited[index] && project?.stepCompleted[index]) {
			setActiveIndex(index)
		} else {
			toast.warn(errors[index])
		}
	}
	const setStep = (step) => {
		setVisited((prev) => {
			prev[step] = true
			return { ...prev }
		})
		setActiveIndex(step)
	}
	const submit = async () => {
		try {
			if (value.includes('/') || value.includes('\\')) {
				return toast.error(
					'Name error',
					"Space are not allowed use '/ , \\' instead"
				)
			}
			const curr = window.location.href
			const newURL = curr.replace(/-(.*)$/, '-' + value)
			const data = {
				ProjectName: value,
			}
			const res = await Api.put(
				`/project/${collectionName.split('-')[0]}`,
				data
			)
			if (res.status === 200) {
				setTitle(value)
				setDoEdit(false)
				window.history.pushState(null, '', newURL)
				return toast.success(
					'Name Changed',
					'Project Name Updated successfully'
				)
			}
			return toast.error('Failed to update')
		} catch (error) {
			setDoEdit(false)
			return toast.error('updating issue', error.message)
		}
	}

	useEffect(() => {
		console.log('🚀 ~ file: index.jsx:90 ~ useEffect ~ project:', project)
		if (project?.metadataSchema && project?.stepCompleted[1]) {
			setVisited((prev) => {
				prev[1] = true
				return { ...prev }
			})
			setActiveIndex(1)
		}

		if (project?.metadataTab?.csvUpload && project?.stepCompleted[2]) {
			setVisited((prev) => {
				prev[2] = true
				return { ...prev }
			})
			setActiveIndex(2)
		}

		if (project?.NftOnIpfsUpload > 0 && project?.stepCompleted[3]) {
			setVisited((prev) => {
				prev[3] = true
				return { ...prev }
			})
			setActiveIndex(3)
		}
		if (project?.configurationTab && project?.stepCompleted[4]) {
			setVisited((prev) => {
				prev[4] = true
				return { ...prev }
			})
			setActiveIndex(4)
		}
	}, [project])

	return (
		<>
			{isLoading ? (
				<center>
					<ProgressSpinner />
				</center>
			) : (
				<div className='container mt-4'>
					<div className='flex justify-content-center'>
						{doEdit ? (
							<div className='p-inputgroup w-5 m-5'>
								<InputText
									placeholder='Vote'
									value={value}
									onChange={(e) => setValue(e.target.value)}
								/>
								<Button
									icon='pi pi-check'
									className='p-button-success'
									onClick={submit}
								/>
								<Button
									icon='pi pi-times'
									className='p-button-danger'
									onClick={() => setDoEdit(false)}
								/>
							</div>
						) : (
							<h1 className='mb-6'>
								{title}
								<i
									className='pi pi-pencil pl-2 carsur-pointer cursor-pointer theme-text-color'
									onClick={() => setDoEdit(true)}
								></i>
							</h1>
						)}
					</div>

					<div className='mb-8'>
						<Steps
							model={items}
							activeIndex={activeIndex}
							onSelect={(e) => setActiveIndex(e.index)} //plz do not remove it
							// onSelect={(e) => selectTab(e.index)} // plz do not remove it
							readOnly={false}
						/>
					</div>

					{activeIndex === 0 && (
						<Template
							project={project}
							setProject={setProject}
							setStep={() => setStep(1)}
						/>
					)}
					{activeIndex === 1 && (
						<Metadata
							setStep={() => setStep(2)}
							project={project}
							setProject={setProject}
						/>
					)}
					{activeIndex === 2 && (
						<Deploy
							setStep={() => setStep(3)}
							setProject={setProject}
							project={project}
							isLoading={isLoading}
						/>
					)}

					<div className='flex justify-content-between mt-5'>
						<div>
							<Button
								label='Back'
								className='p-button-sm custom-btn'
								icon='pi pi-chevron-left'
								iconPos='left'
								disabled={activeIndex === 0}
								onClick={() => selectTab(activeIndex - 1)}
							/>
						</div>
						<div>
							<Button
								label='Next'
								className='p-button-sm custom-btn'
								icon='pi pi-chevron-right'
								iconPos='right'
								disabled={activeIndex === 2}
								onClick={() => selectTab(activeIndex + 1)}
							/>
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default Project

const items = [
	{
		label: 'Template',
	},
	{
		label: 'Metadata',
	},
	{
		label: 'Configuration',
	},
]
