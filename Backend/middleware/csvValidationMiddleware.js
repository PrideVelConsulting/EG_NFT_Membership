function csvValidationMiddleware(req, res, next) {
	const bypassWarnings = !!req.body.bypassWarnings
	const validationResult = validateCSV(req.csvData)

	if (bypassWarnings && validationResult.errors.length === 0) {
		return next()
	}

	if (
		validationResult.errors.length > 0 ||
		validationResult.warnings.length > 0
	) {
		return res.status(201).json(validationResult)
	}

	next()
}

module.exports = csvValidationMiddleware

function validateCSV(dataArray) {
	const mantlePrefixes = ['propn_', 'proph_']

	const newWarnings = []
	const newErrors = []

	dataArray.forEach((row, rowIndex) => {
		Object.keys(row).forEach((column) => {
			const field = row[column]

			if (!field) {
				newWarnings.push({
					row: rowIndex + 1,
					column,
					message: 'Warning: Missing value',
				})
			}
			if (mantlePrefixes.some((prefix) => column.startsWith(prefix))) {
				// Check if the field is a valid number (integer or float)
				if (!/^[0-9]+(\.[0-9]+)?$/.test(field)) {
					newErrors.push({
						row: rowIndex + 1,
						column,
						message:
							'Error: Invalid type for mantle field (should be a number or height)',
					})
				}
			}

			if (column.startsWith('propb_')) {
				// Check if the field is a valid boolean
				if (field !== 'true' && field !== 'false') {
					newErrors.push({
						row: rowIndex + 1,
						column,
						message:
							'Error: Invalid type for mantle field (should be a boolean)',
					})
				}
			}
		})
	})

	return {
		warnings: newWarnings,
		errors: newErrors,
	}
}
