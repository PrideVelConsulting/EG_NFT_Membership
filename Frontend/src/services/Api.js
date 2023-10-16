import axios from 'axios'

class ApiService {
	_endpoints = {
		BASE_URL:
			import.meta.env.NODE_ENV === 'production'
				? import.meta.env.VITE_BASE_URL
				: import.meta.env.VITE_DEV_URL,
	}

	constructor() {
		const service = axios.create({
			baseURL: this._endpoints.BASE_URL,
			withCredentials: true,
		})

		service.interceptors.response.use(this.handleSuccess, this.handleError)

		this.service = service
	}

	handleSuccess(response) {
		return response
	}

	handleError(error) {
		return Promise.reject(error)
	}

	async get(path, options = {}) {
		try {
			const response = await this.service.get(path, options)
			return response
		} catch (error) {
			console.error('Error:', error)
			throw error
		}
	}

	get(path, options = {}) {
		return this.service.request({
			method: 'GET',
			url: path,
			...options,
		})
	}

	patch(path, payload) {
		return this.service.request({
			method: 'PATCH',
			url: path,
			responseType: 'json',
			data: payload,
		})
	}

	post(path, payload) {
		return this.service.request({
			method: 'POST',
			url: path,
			responseType: 'json',
			data: payload,
		})
	}

	put(path, payload) {
		return this.service.request({
			method: 'PUT',
			url: path,
			responseType: 'json',
			data: payload,
		})
	}

	delete(path, payload) {
		return this.service.request({
			method: 'DELETE',
			url: path,
			responseType: 'json',
			data: payload,
		})
	}
	uploadCSV(path, file, formDataOptions = {}) {
		const formData = new FormData()
		formData.append('csvFile', file)

		// Append any additional key-value pairs to the formData
		Object.entries(formDataOptions).forEach(([key, value]) => {
			formData.append(key, value)
		})

		return this.service.request({
			method: 'POST',
			url: path,
			responseType: 'json',
			data: formData,
			headers: {
				'Content-Type': 'multipart/form-data', // Important for file uploads
			},
		})
	}
}

export default new ApiService()

// DB
// {
//   key :datatype
//   attr_key :datatype
// }

// JSON
// {
// key :value
// attribute : [
//   {
//     "trait_type": "key",
//     "value": "value"
// },
// ]
// }
