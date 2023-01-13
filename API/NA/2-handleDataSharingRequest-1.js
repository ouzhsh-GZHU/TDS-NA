let exrr = require('../universal/RequestRefContract')

var pk = '0x779BAdf08Eb8219ed3998AA2578dA4b7625E90c2'
var sk = 'f2fa39e48f7e43c511393b5cb1f94e5ecd5a4733a5dbdbcd9468c9964cb598b0'


// NA handle DSC request
let handleRequest = async () => {
	try {
		// Get unprocessed DSC requests
		let res = await exrr.myContract.methods.getUnhandledRequests().call({
			from: pk,
			gas: 3000000,
		})
		var unhandledRequest;
		var serialNumber;
		var unhandled;

		unhandledRequest = res
		unhandled = res[0]
		serialNumber = res[1]

		if (!unhandled) {
			return false
		}

		console.log(unhandledRequest)
		console.log('unhandled', unhandled)
		console.log('serialNumber', serialNumber)

		let result = await exrr.myContract.methods.DataSharingRequests(serialNumber).call({
			from: pk,
			gas: 3000000,
		})

		let dataSharingRequest = result
		console.log('dataSharingRequest', dataSharingRequest)

		var _kindOfCertificate = Number(dataSharingRequest["_kindOfCertificate"])

		var _dataSize = Number(dataSharingRequest['_dataSize'])

		var _value = Number(dataSharingRequest['amount'])
		if (_kindOfCertificate < 1 || _kindOfCertificate > 2) {
			console.log('证书类型有误')
			return false
		}
		if (_dataSize < 0 || _value < 0) {
			console.log('数据内容或支付金额有误')
			return false
		}
		// 数据大小与支付费用公式（后面可优化） _value = _dataSize*10000
		if (_dataSize * 10000 > _value || _dataSize * 10000 < _value) {
			console.log('数据内容或支付金额有误')
			return false
		}
		console.log('check dataSharingRequest success...')

		var myJSON = JSON.stringify(dataSharingRequest)

		let message = exrr.web3.utils.keccak256(myJSON)

		// Request messages to be signed
		console.log('message', message)
	} catch (e) {
		console.log('error:', e)
	}
}

handleRequest()