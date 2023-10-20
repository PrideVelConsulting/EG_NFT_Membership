import React, { useRef, useState } from 'react'
import { FileUpload } from 'primereact/fileupload'
import Papa from 'papaparse'
import Api from '../../services/Api'

function FileUploader() {
	const [addressArray, setAddressArray] = useState([])
	const fileUploadRef = useRef(null)

	const handleFileSelect = (event) => {
		const file = event.files[0]

		if (file) {
			if (file.type === 'text/csv') {
				parseCSV(file)
			} else {
				console.log('Invalid File Type. Please upload a CSV file.')
				clearSelection()
			}
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
		console.log(file)
		const reader = new FileReader()
		reader.onload = (e) => {
			const content = e.target.result

			// const parseResult = Papa.parse(content, { header: true })
			// const parsedData = parseResult.data

			// console.log(parsedData)

			Papa.parse(file, {
				header: false,
				dynamicTyping: true,
				skipEmptyLines: true, // Add this line to skip empty lines
				complete: async function (results) {
					console.log(results.data, 'result')
					if (results.data.length === 0) {
						return console.log('Empty File', 'File has no data.')
					}

					const idColumnIndex = 0

					const extractedIds = results.data.map((row) => row[idColumnIndex])
					console.log(extractedIds, extractedIds.length)

					const postData = await Api.post('/user/pre_mint', {
						csvData: extractedIds,
					})
					console.log(postData)
				},
			})
		}
		reader.readAsText(file)
		clearSelection()
	}

	const isValidateHeaders = (parsedData) => {
		if (expectedHeaders) {
			const uploadedHeaders = Object.keys(parsedData[0]).sort()
			const expectedHeader = Object.keys(expectedHeaders).sort()

			return JSON.stringify(uploadedHeaders) === JSON.stringify(expectedHeader)
		}
		return false
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
