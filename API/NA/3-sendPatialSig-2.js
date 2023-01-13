let exrr = require('../universal/RequestRefContract')

var pk = '0xa02ebD55400Ceda89ABc19cBbB4C6b6D9a3ea42a'
var sk = 'f4cae57530edd827c6dbe431cbbeb3f956772ee14aafc5152f0658f85326f4f1'
// Sequence number of unprocessed requests
var serialNumber = '1'
// Partial signature
var R = '03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55'
var s = '97491913523203515727481906046000881702256194578464976133851197855444326996602'
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