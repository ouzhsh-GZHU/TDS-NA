let exrr = require('../universal/RequestRefContract')

var pk = '0x5d2BACa6d35890Bfc251EdD62b3520ad6F3Ff511'
var sk = '285de8d8e9b4dbc03715954a5fd38686ef920b6807f1aa993b2adaaa88215795'

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