import React, { useRef, useState } from 'react'
import { FileUpload } from 'primereact/fileupload'
import Papa from 'papaparse'
import { ethers } from 'ethers'

function FileUploader({ onDataLoaded, onFileChange, setCsvIssues }) {
	const [addressArray, setAddressArray] = useState([])
	const fileUploadRef = useRef(null)

	const handleFileSelect = (event) => {
		const file = event.files[0]
		if (file) {
			if (file.type === 'text/csv' || file.type === 'text/xlsx')
				return parseCSV(file)
			console.log('Invalid File Type', 'Please upload a CSV file.')
			clearSelection()
		}
	}

	const handleUpload = () => {
		console.log('got the file')
	}

	const clearSelection = () => {
		if (fileUploadRef.current) {
			fileUploadRef.current.clear()
		}
	}

	const parseCSV = (file) => {
		const reader = new FileReader()
		reader.onload = (e) => {
			const content = e.target.result
			const parseResult = Papa.parse(content, { header: true })
			const parsedData = parseResult.data

			const filteredData = parsedData.filter((row) => {
				return Object.values(row).some((value) => value.trim() !== '')
			})

			const issues = filteredData
				.map((row, index) => {
					if (!ethers.isAddress(row.Addresses)) {
						return `Invalid address: ${row.Addresses} at ${index + 1}`
					}
				})
				.filter((issue) => issue !== undefined)

			onFileChange()
			setCsvIssues(issues)
			onDataLoaded(filteredData)
		}
		reader.readAsText(file)
		clearSelection()
	}

	return (
		<div>
			<FileUpload
				ref={fileUploadRef}
				className='p-button-sm'
				mode='basic'
				customUpload={true}
				onSelect={handleFileSelect}
				onUpload={handleUpload}
				auto
				chooseLabel='Choose Files'
				uploadLabel='Upload'
				cancelLabel='Cancel'
			/>
		</div>
	)
}

export default FileUploader
