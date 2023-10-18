const fs = require('fs')

const check = async () => {
	let data = `module.exports = [
     'Testing1',
    'Test1',
    'https://bafybeib2v3jdyoldb5ub2afo36sul5ecrcc3hw6y6lypqeugpoxqlfehh4.ipfs.nftstorage.link/',
    '0x911783781755C7A8cE91898C6E19ee057ba94dB6',
    '10000',]
    `

	fs.writeFileSync('argument1.jsx', data, 'UTF-8', { flags: 'w+' }, (err) => {
		if (err) throw err
		console.log('File Updated!')
	})
}

check()
