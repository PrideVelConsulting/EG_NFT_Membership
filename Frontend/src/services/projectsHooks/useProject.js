import { useQuery } from 'react-query'
import ApiService from '../Api'
import { useToast } from '../../components/ToastContext'
import { useState } from 'react'

async function fetchProject(projectId, toast, setProjectData) {
	try {
		const response = await ApiService.get(`/project/${projectId}`)
		setProjectData(response.data)
		return response.data
	} catch (error) {
		toast.error('Fetching issue')
		return error
	}
}

function useProject(projectId) {
	const toast = useToast()
	const [projectData, setProjectData] = useState()
	const {
		data: project,
		error,
		isLoading,
		refetch: refresh,
	} = useQuery(
		['project', projectId],
		async () => await fetchProject(projectId, toast, setProjectData),
		{
			refetchOnWindowFocus: false,
			staleTime: 1000,
			queryKey: ['project', projectId],
			retry: 0,
			cacheTime: 1000,
		}
	)

	// Define the setProject function to update specific keys
	const setProject = (newProject) => {
		setProjectData((prevProjectData) => ({ ...prevProjectData, ...newProject }))
		return
	}
	return {
		project: projectData || project,
		error,
		isLoading,
		refresh,
		setProject,
	}
}

export default useProject
