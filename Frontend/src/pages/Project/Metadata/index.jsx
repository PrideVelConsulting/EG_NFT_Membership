import React, { useEffect, useState } from 'react'
import ApiService from '../../../services/Api'
import Papa from 'papaparse'
import { Chip } from 'primereact/chip' // Import Chip
import FileUploader from './components/FileUploader'
import { Button } from 'primereact/button'
import { useToast } from '../../../components/ToastContext'
import MyDataTable from './components/MyDataTable' // Import MyDataTable
import GenericDialog from '../../../components/GenericDialog'

const options = [
	{ name: 'name' },
	{ image: 'image' },
	{ description: 'description' },
]

function index({ setStep, project, setProject }) {
	const toast = useToast()
	const [tableData, setTableData] = useState([])
	const [Mantle, setMantle] = useState([[], []]) // [[FIELDs],[Attributes]]
	const [csvIssues, setCsvIssues] = useState()
	const [isUploading, setIsUploading] = useState(false)
	const {
		isOpen: isWarnModalOpen,
		onOpen: openWarnModal,
		onClose: closeWarnModal,
	} = useDisclosure()
	const {
		isOpen: isErrModalOpen,
		onOpen: openErrModal,
		onClose: closeErrModal,
	} = useDisclosure()

	useEffect(() => {
		if (
			project &&
			project?.metadataSchema &&
			Object.keys(project.metadataSchema).length > 0
		) {
			const metadataKeys = Object.keys(project.metadataSchema)

			const selectFields = metadataKeys.filter((value) =>
				options.flatMap((obj) => Object.values(obj)).includes(value)
			)

			const attributeFields = metadataKeys.filter((value) =>
				['props_', 'propn_', 'propb_', 'propu_', 'proph_'].some((prefix) =>
					value.startsWith(prefix)
				)
			)

			setMantle([selectFields, attributeFields])
		}
	}, [project])

	const submit = async ({ isWarnSave }) => {
		setIsUploading(true)
		try {
			if (isWarnSave) {
				closeWarnModal()
			}

			await uploadCSVData(project, tableData, toast, setCsvIssues, isWarnSave)
			const payload = {
				projectId: project._id,
				n: tableData.length,
				isDeployed: project.isDeployed,
				stepCompleted: [true, true, true, true, false],
			}
			if (project.finalCIDR) {
				payload.existingFolderHash = project.finalCIDR
			}
			const res = await ApiService.post(`/project_metadata/generate`, payload)
			setProject({
				metadataTab: {
					standard: project?.metadataTab?.standard,
					csvUpload: true,
				},
				configurationTab: {},
				isUploadedToIPFS: true,
				NftOnIpfsUpload: tableData.length,
				finalCIDR: res.data.message,
				stepCompleted: [true, true, true],
			})
			setTableData([])
			setCsvIssues()
			setStep()
			toast.success(
				'Upload completed',
				'CID For Uploaded Files : ' + res.data.message
			)
		} catch (error) {
			console.error('Error during submit:', error)
			if (csvIssues.length < 0) {
				toast.error('An error occurred during upload. Please try again.')
			}
		} finally {
			setIsUploading(false)
		}
	}

	return (
		<>
			<div className='flex align-items-center justify-content-between'>
				<div>
					<h3>Template Properties & Attributes</h3>
				</div>

				<div className='flex'>
					<div
						className='panel-color theme-border-color border-1 px-2 text-center border-round-sm flex align-items-center gap-2 w-min mr-2'
						onClick={() => {
							if (csvIssues?.warnings?.length > 0) return openWarnModal()
						}}
					>
						<i
							className='pi pi-exclamation-triangle'
							style={{ color: 'orange' }}
						></i>
						<div className='text-md'>{csvIssues?.warnings?.length || 0}</div>
					</div>
					<div
						className='panel-color theme-border-color border-1 px-1 text-center border-round-sm flex align-items-center gap-1 w-min'
						onClick={() => {
							if (csvIssues?.errors?.length > 0) return openErrModal()
						}}
					>
						<i className='pi pi-times-circle' style={{ color: 'red' }}></i>
						<div className='text-md'>{csvIssues?.errors?.length || 0}</div>
					</div>
				</div>
			</div>

			{(Mantle[0].length > 0 || Mantle[1].length > 0) && (
				<ChipsComponent chips={Mantle} />
			)}

			<div className='mt-3'>
				<FileUploader
					onDataLoaded={setTableData}
					expectedHeaders={project?.metadataSchema}
					onFileChange={() => setCsvIssues([])}
					className='p-button-sm'
				/>
			</div>
			{tableData.length > 0 && <MyDataTable tableData={tableData} />}
			<div className='text-center'>
				<Button
					label={isUploading ? 'Uploading...' : 'Upload'}
					className='my-2 p-button-sm'
					icon='pi pi-save'
					iconPos='right'
					disabled={tableData?.length === 0 || isUploading}
					onClick={() => submit({ isWarnSave: false })}
				/>
			</div>

			<GenericDialog
				visible={isWarnModalOpen}
				onHide={closeWarnModal}
				header='CSV Validation Issues'
				title='Warnings'
				showSubmit={csvIssues?.errors?.length === 0}
				onSubmit={async () => {
					submit({ isWarnSave: true })
				}}
				saveButtonTitle='Ignore Warnings and save'
			>
				{csvIssues?.warnings?.map((issue, index) => (
					<div key={index}>
						<p>{`Row: ${issue.row}, Column: ${issue.column}`}</p>
						<p>{issue.message}</p>
					</div>
				))}
			</GenericDialog>
			<GenericDialog
				visible={isErrModalOpen}
				onHide={closeErrModal}
				header='CSV Validation Issues'
				title='Errors'
			>
				{csvIssues?.errors?.map((issue, index) => (
					<div key={index}>
						<p>{`Row: ${issue.row}, Column: ${issue.column}`}</p>
						<p>{issue.message}</p>
					</div>
				))}
			</GenericDialog>
		</>
	)
}

export default index

const ChipsComponent = ({ chips }) => {
	const com = (chip) => {
		return (
			<div className='flex align-items-center gap-2 py-1'>
				<div className='overflow-hidden'>{chip}</div>
			</div>
		)
	}
	return (
		<div className='p-d-flex p-flex-wrap border-1 theme-border-color overflow-auto border-round p-2'>
			{chips.map((arr) =>
				arr.map((chip) => (
					<Chip className='p-button-sm' key={chip} template={() => com(chip)} />
				))
			)}
		</div>
	)
}

const uploadCSVData = async (
	project,
	csvData,
	toast,
	setCsvIssues,
	bypassWarnings = false
) => {
	const finalData = csvData.map((row, index) => ({
		...row,
		projectId: project._id,
		serialNo: index + 1,
	}))
	const csvString = Papa.unparse(finalData)
	const blob = new Blob([csvString], { type: 'text/csv' })
	const file = new File([blob], 'data.csv')
	try {
		let response
		if (bypassWarnings) {
			response = await ApiService.uploadCSV(`/project_metadata/csv`, file, {
				bypassWarnings,
				schema: JSON.stringify(project?.metadataSchema),
			})
		} else {
			response = await ApiService.uploadCSV(`/project_metadata/csv`, file, {
				schema: JSON.stringify(project?.metadataSchema),
			})
			await ApiService.put(`/project/${project._id}`, {
				isUploadedToIPFS: false,
				NftOnIpfsUpload: 0,
				configurationTab: {},
				stepCompleted: [true, true, true, false, false],
			})
		}
		const { status, data } = response
		if (status === 201) {
			const { errors, warnings } = data
			setCsvIssues(data)
			if (errors.length > 0) {
				toast.error(`Errors in CSV: ${errors.length} errors`)
			}
			if (!bypassWarnings && warnings.length > 0) {
				toast.warn(`Warnings in CSV: ${warnings.length} warnings`)
			}
		}
		if (status === 200) {
			return
		} else {
			throw new Error('Failed to save CSV data to DB')
		}
	} catch (error) {
		console.error('Error while uploading CSV:', error)
		throw error
	}
}

function useDisclosure() {
	const [isOpen, setIsOpen] = useState(false)

	const onOpen = () => {
		setIsOpen(true)
	}

	const onClose = () => {
		setIsOpen(false)
	}

	return {
		isOpen,
		onOpen,
		onClose,
	}
}
