let exrr = require('../universal/RequestRefContract')

var pk = '0x779BAdf08Eb8219ed3998AA2578dA4b7625E90c2'
var sk = 'f2fa39e48f7e43c511393b5cb1f94e5ecd5a4733a5dbdbcd9468c9964cb598b0'

// Sequence number of unprocessed requests
var serialNumber = '1'
// Partial signature
var R = '03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55'
var s = '52156200411291720977316556958863746658396216216487137363199686262926748169522'
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
}// 1.数据共享用户功能部分