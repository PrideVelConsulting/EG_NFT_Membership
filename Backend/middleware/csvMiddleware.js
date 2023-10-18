const multer = require("multer")
const csvParser = require("csv-parser")
const { Readable } = require("stream")

// Configure multer with memory storage
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

// Middleware function to handle CSV file upload and parsing
function uploadCSV(req, res, next) {
  // Upload the CSV file using multer
  upload.single("csvFile")(req, res, (error) => {
    if (error) {
      return res.status(400).json({ error: "Error uploading CSV file" })
    }

    if (!req.file) {
      return res.status(400).json({ error: "No CSV file uploaded" })
    }

    // Convert the file buffer to a UTF-8 encoded string
    const csvData = req.file.buffer.toString("utf8")

    const results = []
    const csvStream = csvParser({ skipEmptyLines: true })

    csvStream.on("data", (data) => {
      results.push(data)
    })

    csvStream.on("end", () => {
      req.csvData = results

      next() // Proceed to the next middleware or route handler
    })

    csvStream.on("error", (error) => {
      next(error) // Pass the error to Express's error handling middleware
    })

    // Convert the CSV data to a readable stream and pipe it to the csvStream
    const csvDataStream = Readable.from(csvData)
    csvDataStream.pipe(csvStream)
  })
}

module.exports = { uploadCSV }
