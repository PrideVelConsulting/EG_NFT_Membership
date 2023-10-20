import React, { useRef } from "react"
import { FileUpload } from "primereact/fileupload"
import Papa from "papaparse"
import { useToast } from "../../../../components/ToastContext"

function FileUploader({ onDataLoaded, expectedHeaders, onFileChange }) {
  const toast = useToast()
  const fileUploadRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.files[0]
    if (file) {
      onFileChange()
      if (file.type === "text/csv") return parseCSV(file)
      toast.error("Invalid File Type", "Please upload a CSV file.")
      clearSelection()
    }
  }

  const clearSelection = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.clear()
    }
  };
  // const parseCSV = (file) => {
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const content = e.target.result;

  //     const parseResult = Papa.parse(content, { header: true });
  //     const parsedData = parseResult.data;
  //     2;
  //     if (parsedData.length === 0)
  //       return toast.error("Empty File", "File has no data.");
  //     if (Object.hasOwn(parsedData[0], "__parsed_extra"))
  //       return toast.error("Extra column", "Extra Column data has been passed");

  //     if (!isValidateHeaders(parsedData))
  //       return toast.error(
  //         "Invalid Headers",
  //         "CSV headers do not match expected headers."
  //       );

  //     onDataLoaded(parsedData);
  //   };
  //   reader.readAsText(file);
  //   clearSelection();
  // };
  const parseCSV = (file) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target.result;
  
      const parseResult = Papa.parse(content, { header: true });
      const parsedData = parseResult.data;
  
      if (parsedData.length === 0) {
        return toast.error("Empty File", "File has no data.");
      }
  
      if (Object.hasOwn(parsedData[0], "__parsed_extra")) {
        return toast.error("Extra column", "Extra Column data has been passed");
      }
  
      const filteredData = parsedData.filter((row) => {
        // Filter out the extra blank row
        return Object.values(row).some((value) => value.trim() !== '');
      });
  
      if (!isValidateHeaders(filteredData)) {
        return toast.error(
          "Invalid Headers",
          "CSV headers do not match expected headers."
        );
      }
  
      onDataLoaded(filteredData);
    };
    reader.readAsText(file);
    clearSelection();
  };
  
  const isValidateHeaders = (parsedData) => {
    console.log(expectedHeaders)
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
        chooseLabel="Choose Files"
        uploadLabel="Upload"
        cancelLabel="Cancel"
      />
    </div>
  )
}

export default FileUploader
