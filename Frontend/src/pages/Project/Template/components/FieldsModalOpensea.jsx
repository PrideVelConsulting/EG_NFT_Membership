import React, { useState } from 'react'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import { useToast } from '../../../../components/ToastContext'

const designOptions = [
	{ label: 'String', value: 'string' },
	{ label: 'Boolean', value: 'boolean' },
	{ label: 'Number', value: 'number' },
	{ label: 'URI', value: 'uri' },
	{ label: 'Height', value: 'height' },
]

const designPrefixMap = {
	string: 'props_',
	number: 'propn_',
	boolean: 'propb_',
	uri: 'propu_',
	height: 'proph_',
}

function FieldsModalCustom({ displayBasic, setDisplayBasic, submit }) {
	const [displayAtt, setDisplayAtt] = useState('')
	const [values, setValues] = useState([])
	const [attributeValue, setAttributeValue] = useState('')
	const [properties, setAttributes] = useState({})
	const [selectedDesign, setSelectedDesign] = useState('')
	const toast = useToast()

	const onDesignAdd = () => {
		if (attributeValue && selectedDesign) {
			const key = designPrefixMap[selectedDesign] + attributeValue
			setAttributes((prev) => ({ ...prev, [key]: selectedDesign }))
			setAttributeValue('')
		}
	}
	const onDesignDel = (v) => {
		setAttributes((prev) => {
			const updatedAttributes = { ...prev }
			delete updatedAttributes[v]
			return updatedAttributes
		})
	}

	const save = () => {
		const des = onDesignAdd()
		submit((prev) => {
			const firstArray = prev[0] || {}
			const secondArray = prev[1] ? { ...prev[1], ...properties } : properties
			return [firstArray, secondArray]
		})
		setDisplayAtt('')
		setDisplayBasic((prev) => !prev)
		setSelectedDesign('')
		setValues([])
		setAttributes([])
	}

	return (
		<Dialog
			header='Properties'
			visible={displayBasic}
			onHide={() => {
				save()
			}}
		>
			<p>Apply properties to collection</p>
			<div className='flex align-items-center gap-3 mt-3 flex-column'>
				{properties &&
					Object.keys(properties).length > 0 &&
					Object.keys(properties).map((v) => (
						<div key={v} className='flex align-items-center gap-3'>
							<div>
								<InputText value={v} className='p-inputtext-custom' disabled />
							</div>
							<div>
								<i
									className='pi pi-trash'
									onClick={() => onDesignDel(v)}
									style={{ fontSize: '1.2em' }}
								></i>
							</div>
						</div>
					))}
				<div className='flex align-items-center gap-3'>
					<div>
						<InputText
							value={attributeValue}
							onChange={(e) => setAttributeValue(e.target.value)}
							placeholder='key'
							className='p-inputtext-custom'
						/>
					</div>
					<div>
						<Dropdown
							options={designOptions}
							value={selectedDesign}
							onChange={(e) => setSelectedDesign(e.value)}
							placeholder='Select Data type'
						/>
					</div>
					<div>
						<i
							className='pi pi-plus'
							onClick={onDesignAdd}
							style={{ fontSize: '1.2em' }}
						></i>
					</div>
				</div>
			</div>
		</Dialog>
	)
}

export default FieldsModalCustom
