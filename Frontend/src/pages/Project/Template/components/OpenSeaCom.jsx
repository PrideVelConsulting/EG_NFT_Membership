import React, { useEffect, useState } from 'react'
import ApiService from '../../../../services/Api'
import { Chip } from 'primereact/chip' // Import Chip
import { Button } from 'primereact/button'
import { useToast } from '../../../../components/ToastContext'
import FieldsModalOpenSea from './FieldsModalOpensea'
import { Checkbox } from 'primereact/checkbox'

function OpenSeaCom({ setStep, setProject, project }) {
	const toast = useToast()

	const [dataOpensea, setDataOpensea] = useState([{}, {}]) // [[FIELDs],[Attributes]]
	const [displayBasic, setDisplayBasic] = useState(false)

	const handleCheckboxChange = (field, isChecked) => {
		setDataOpensea((prev) => {
			const [fields, attributes] = prev // Destructuring

			// Define data types for specific fields
			const fieldDataTypes = {
				name: 'string',
				image: 'uri',
				description: 'string',
			}

			// Initialize a variable to store the selected data type
			let selectedFieldType = ''

			if (isChecked) {
				selectedFieldType = fieldDataTypes[field]
			}

			const updatedFields = { ...fields }
			if (isChecked) {
				updatedFields[field] = field // Store the name, not the data type
			} else {
				delete updatedFields[field]
			}

			return [updatedFields, attributes]
		})
	}

	return (
		<>
			<div>
				<h3>Choose Properties</h3>
				<div className='flex flex-wrap gap-3'>
					{options.map((option) => {
						const displayName = Object.keys(option)[0]
						const value = option[displayName]

						return (
							<div className='flex align-items-center' key={value}>
								<Checkbox
									onChange={(e) => handleCheckboxChange(value, e.checked)}
									checked={dataOpensea[0].hasOwnProperty(value)} //
								/>
								<label htmlFor={`checkbox-${value}`} className='ml-2'>
									{displayName}
								</label>
							</div>
						)
					})}
				</div>
			</div>
			<div className='flex gap-2 mt-4'>
				<Button
					label='Custom Properties'
					className='my-2 p-button-sm '
					icon='pi pi-plus'
					iconPos='right'
					onClick={() => setDisplayBasic((prev) => !prev)}
				/>
			</div>

			<div className='flex align-items-center justify-content-between'>
				<div>
					<h3>Selected Properties</h3>
				</div>
			</div>

			{(Object.keys(dataOpensea[0]).length > 0 ||
				Object.keys(dataOpensea[1]).length > 0) && (
				<ChipsComponent
					chips={dataOpensea}
					onRemove={(word) => removeColumns(word, dataOpensea, setDataOpensea)}
				/>
			)}

			<div className='flex gap-2 mt-4'>
				<div>
					<Button
						label='Save and Download Template'
						icon='pi pi-download'
						iconPos='right'
						className='p-button-sm'
						onClick={async () => {
							console.log(toast)
							const data = await handleDownloadOpenSeaComTemplate(
								project,
								dataOpensea,
								toast,
								project.metadataSchema
							)
							if (data) {
								setProject(data)
								setStep()
							}
						}}
					/>
				</div>
			</div>
			<FieldsModalOpenSea
				displayBasic={displayBasic}
				setDisplayBasic={setDisplayBasic}
				submit={setDataOpensea}
			/>
		</>
	)
}

export default OpenSeaCom

const options = [
	{ Name: 'name' },
	{ Image: 'image' },
	{ Description: 'description' },
]
const ChipsComponent = ({ chips, onRemove }) => {
	const com = (chip) => {
		return (
			<div className='flex align-items-center gap-2 py-2'>
				<div className='overflow-hidden'>
					{chip.charAt(0).toUpperCase() + chip.slice(1)}
				</div>
				<i className='pi pi-trash' onClick={() => onRemove(chip)}></i>
			</div>
		)
	}
	return (
		<div className='p-d-flex p-flex-wrap border-1 theme-border-color overflow-auto border-round p-2 '>
			{chips.map(
				(obj, index) =>
					Object.keys(obj).length > 0 &&
					Object.keys(obj).map(
						(
							key // Map over object keys
						) => (
							<Chip
								className='p-button-sm mr-1'
								key={index + key}
								template={() => com(key)}
							/> // Use index + key as the unique key
						)
					)
			)}
		</div>
	)
}

const handleDownloadOpenSeaComTemplate = async (
	project,
	dataOpensea,
	toast,
	expectedHeaders
) => {
	try {
		const selectedProperties = Object.keys(dataOpensea[0])

		const allProperties = [...selectedProperties]

		if (allProperties.length === 0) {
			toast.info('No headers selected')
			return false
		}

		const csvHeaders = allProperties.join(',')
		let metadataSchema = {}

		for (let i = 0; i < allProperties.length; i++) {
			const property = allProperties[i]
			if (property === 'name' || property === 'description') {
				metadataSchema[property] = 'string'
			} else if (property === 'image') {
				metadataSchema[property] = 'uri'
			}
		}

		metadataSchema = { ...metadataSchema, ...dataOpensea[1] }

		const test =
			expectedHeaders &&
			JSON.stringify(Object.keys(metadataSchema).sort()) ===
				JSON.stringify(Object.keys(expectedHeaders).sort())

		const data = {
			NftOnIpfsUpload: test ? project?.NftOnIpfsUpload : 0,
			isUploadedToIPFS: test ? project?.isUploadedToIPFS : false,
			configurationTab: test ? project?.configurationTab : {},
			stepCompleted: test ? project?.stepCompleted : [true, true, false],
			metadataSchema,
		}

		const response = await ApiService.put(`/project/${project._id}`, {
			...data,
		})

		// Check the response status to confirm that the update was successful
		if (response.status === 200) {
			toast.success('Metadata schema updated successfully')
		} else {
			toast.error('Failed to update metadata schema')
			return
		}

		// Create a Blob with the CSV content
		const blob = new Blob([Object.keys(metadataSchema).join(',')], {
			type: 'text/csv;charset=utf-8;',
		})

		// Create a download link and trigger the download
		const link = document.createElement('a')
		link.href = URL.createObjectURL(blob)
		link.target = '_blank'
		link.download = 'custom-template.csv'
		link.click()

		setTimeout(() => {
			URL.revokeObjectURL(link.href)
		}, 100)
		return data
	} catch (error) {
		toast.error('An error occurred:', error)
	}
}

const removeColumns = (word, dataOpensea, setDataOpensea) => {
	const updatedDataOpenSeaCom = dataOpensea.map((array) => {
		return Object.keys(array).includes(word)
			? Object.keys(array).reduce((result, key) => {
					if (key !== word) {
						result[key] = array[key]
					}
					return result
			  }, {})
			: array
	})

	// Update the dataOpensea state with the filtered data
	setDataOpensea(updatedDataOpenSeaCom)
}
