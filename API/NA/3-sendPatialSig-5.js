let exrr = require('../universal/RequestRefContract')

var pk = '0x5d2BACa6d35890Bfc251EdD62b3520ad6F3Ff511'
var sk = '285de8d8e9b4dbc03715954a5fd38686ef920b6807f1aa993b2adaaa88215795'

// Sequence number of unprocessed requests
var serialNumber = '1'
// Partial signature
var R = '03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55'
var s = '110010423222276428828860105789348220641050748435463537722024863850913588304075'
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