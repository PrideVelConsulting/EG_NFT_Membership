const fs = require("fs").promises
const pinataSDK = require("@pinata/sdk")
require("dotenv").config()
const pinata = new pinataSDK(
  process.env.PINATA_API_KEY,
  process.env.PINATA_SECRET_API_KEY
) // Replace with your API key and secret key

const ipfsUploadMiddleware = async (req, res, next) => {
  const generatedFilesDirectory = req.generatedFilesDirectory
  const existingFolderHash = req.body.existingFolderHash
  const folderName = `Project_${req.body.projectId}`

  try {
    if (existingFolderHash) {
      await pinata.unpin(existingFolderHash)
    }

    const ipfsResponse = await pinata.pinFromFS(generatedFilesDirectory, {
      pinataMetadata: {
        name: folderName,
      },
    })

    req.ipfsResponse = ipfsResponse

    return next()
  } catch (error) {
    console.error("Error uploading files to IPFS:", error)
    try {
      await fs.rmdir(generatedFilesDirectory, { recursive: true })
    } catch (removeError) {
      console.error("Error removing directory:", removeError)
    }

    return res.status(500).json({ error: "Error uploading files to IPFS" })
  }
}

module.exports = ipfsUploadMiddleware
