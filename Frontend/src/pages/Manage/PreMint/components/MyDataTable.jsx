import React, { useState } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { InputText } from 'primereact/inputtext'
import { Button } from 'primereact/button'

function MyDataTable({ tableData }) {
	const header = Object.keys(tableData[0])
	return (
		<>
			<DataTable
				paginator
				rows={5}
				rowsPerPageOptions={[5, 10, 25, 50]}
				className='mt-4'
				showGridlines
				size='small'
				value={tableData}
				paginatorTemplate='RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink'
				currentPageReportTemplate='{first} to {last} of {totalRecords}'
				emptyMessage={() => <center>Data will come here.</center>}
			>
				{header.map((v, index) => (
					<Column field={v} header={v} key={index + '-' + v}></Column>
				))}
			</DataTable>
		</>
	)
}

export default MyDataTable
