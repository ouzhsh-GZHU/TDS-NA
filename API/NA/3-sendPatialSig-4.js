let exrr = require('../universal/RequestRefContract')

var pk = '0xbeC7dFa918DEC8FeF78b6607108e655Eb6659b05'
var sk = 'ff53b0c25db95fb0490866a9af861f629adf692a0989ca3f522dee4718581c56'


// Sequence number of unprocessed requests
var serialNumber = '1'
// Partial signature
var R = '03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55'
var s = '97798174031159862322641478279782207833718313515123827203677714788383867448698'
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