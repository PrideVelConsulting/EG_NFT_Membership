import React, { useRef, useState } from "react"
import { FileUpload } from "primereact/fileupload"
import Papa from "papaparse"

function FileUploader() {
  const [addressArray, setAddressArray] = useState([])
  const fileUploadRef = useRef(null)

  const handleFileSelect = event => {
    const file = event.files[0]
    if (file) {
      if (file.type === "text/csv") return parseCSV(file)
      console.log("Invalid File Type", "Please upload a CSV file.")
      clearSelection()
    }
  }

  const handleUpload = () => {
    console.log("got the file")
  }

  const clearSelection = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.clear()
    }
  }

  const parseCSV = file => {
    console.log(file)
    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target.result

      const parsedData = Papa.parse(file, {
        header: false,
        dynamicTyping: true,
        complete: function (results) {
          const idColumnIndex = 0

          const extractedIds = results.data.map(row => row[idColumnIndex])

          //   if (extractedIds.length === 0) {
          //     console.log("file is empty")
          //     return
          //   }
          console.log(extractedIds, extractedIds.length)

          setAddressArray(extractedIds)
        },
      })
    }
    reader.readAsText(file)
    clearSelection()
  }

  const isValidateHeaders = parsedData => {
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
        className="p-button-sm"
        mode="basic"
        customUpload={true}
        onSelect={handleFileSelect}
        onUpload={handleUpload}
        auto
        chooseLabel="Choose Files"
        uploadLabel="Upload"
        cancelLabel="Cancel"
      />
    </div>
  )
}

export default FileUploader
