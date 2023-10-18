const fs = require('fs')
const path = require('path')
const Papa = require('papaparse')

const jsonGeneratorMiddleware = async (req, res, next) => {
	const numberOfNFTs = req.body.n

	if (numberOfNFTs <= 0) {
		return res.status(400).json({ error: 'Invalid number of NFTs' })
	}

	const generatedDataArray = req.sortedMetadata
	const mantlePrefixes = {
		props_: 'string',
		propn_: 'number',
		propb_: 'bool',
		propu_: 'uri',
		proph_: 'height',
	}

	const generatedData = generatedDataArray.map((obj) => {
		const result = {}
		for (const [key, value] of Object.entries(obj)) {
			if (
				['_id', 'projectId', '__v', 'serialNo'].includes(key) ||
				key.startsWith('$')
			) {
				continue
			}
			let matchingPrefix = null

			for (const prefix in mantlePrefixes) {
				if (key.startsWith(prefix)) {
					matchingPrefix = prefix
					break
				}
			}

			if (matchingPrefix) {
				const matchingValueType = mantlePrefixes[matchingPrefix]
				const attributeName = key.replace(matchingPrefix, '')
				result.properties = result.properties || []
				result.properties.push({
					name: attributeName.trim(),
					type: matchingValueType,
					value: value ? value.trim() : '',
				})
			} else if (key.startsWith('prop')) {
				result.properties = result.properties || []
				const [display, trait] = key.trim().split('_')
				result.properties.push({
					display_type: mantlePrefixes[display],
					trait_type: trait,
					value: value
						? typeof value === 'string'
							? value.trim()
							: value
						: '',
				})
			} else {
				result[key.trim()] = typeof value === 'string' ? value.trim() : value
			}
		}
		return result
	})

	const folderName = `Project_${req.body.projectId}`
	const generatedFilesDirectory = path.join(
		__dirname,
		`../generated_files/${folderName}`
	)
	const exists = await fs.promises
		.access(generatedFilesDirectory)
		.then(() => true)
		.catch(() => false)

	try {
		if (exists) {
			await fs.promises.rmdir(generatedFilesDirectory, { recursive: true })
		}

		await fs.promises.mkdir(generatedFilesDirectory, { recursive: true })

		for (let index = 0; index < generatedData.length; index++) {
			console.log(index)
			const data = generatedData[index]
			const fileName = `${index + 1}.json`
			const filePath = path.join(generatedFilesDirectory, fileName)

			const jsonData = createJSONWithoutEscape(data)
			await fs.promises.writeFile(filePath, jsonData, 'utf8')

			console.log(`JSON file ${fileName} generated successfully`)
		}
		req.generatedFilesDirectory = generatedFilesDirectory
		req.nftCount = generatedData.length
		return next() // Move to the next middleware/route handler
	} catch (err) {
		console.error('Error generating JSON files:', err)

		// Attempt to remove the directory and its contents if an error occurs
		try {
			await fs.rmdir(generatedFilesDirectory, { recursive: true })
			console.log(`Directory ${generatedFilesDirectory} removed due to error.`)
		} catch (removeError) {
			console.error('Error removing directory:', removeError)
		}
		res.status(500).json({ error: 'Error generating JSON files' })
	}
}

module.exports = jsonGeneratorMiddleware

function createJSONWithoutEscape(obj) {
	const jsonString = JSON.stringify(
		obj,
		(key, value) => {
			if (typeof value === 'string') {
				return value.replace(/"/g, '"')
			}
			return value
		},
		2
	)

	// Parse the JSON string through PapaParse to handle CSV-related escape characters
	const parsedJSON = Papa.parse(jsonString, {
		header: false,
		dynamicTyping: true,
		skipEmptyLines: true,
	})

	// Join the parsed rows to a single string
	const cleanedJsonString = parsedJSON.data
		.map((row) => row.join(', '))
		.join('\n')

	return cleanedJsonString
}
