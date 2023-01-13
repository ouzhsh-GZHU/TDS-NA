let exrr = require('../universal/RequestRefContract')

var pk = '0xB477b9f73b7DB1112068B586d783aF391e264f87'
var sk = '9995bf82132cd811db214ae0b039de28dcbc12d526a99dc3bb0f983d90be0eee'

// Sequence number of unprocessed requests
var serialNumber = '1'
// Partial signature
var R = '03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55'
var s = '91607876628016829119835763453052601197315458307863149844385343952262001079009'
// NA sends partial signatures via contract calls
let sendPatialSigAndParam = async (serialNumber, R, s) => {
	try {
		let res = await exrr.myContract.methods.sendPatialSigAndParam(serialNumber, R, s).send({
			from: pk,
			gas: 3000000,
		})
		console.log('res', res)

	} catch (e) {
		console.log('error:', e)
	}
}

sendPatialSigAndParam(serialNumber, R, s)