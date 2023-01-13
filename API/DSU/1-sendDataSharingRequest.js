let exrr = require('../universal/RequestRefContract')

var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

// DSU send data sharing request
let sendDataSharingRequest = async (pk, _kindOfCertificate, _dataSize, _value, _extension) => {
	try {
		if (_kindOfCertificate < 1 || _kindOfCertificate > 2) {
			console.log('证书类型有误')
			return false
		}
		if (_dataSize < 0 || _value < 0) {
			console.log('数据内容或支付金额有误')
			return false
		}
		// Custom formula for the amount of payment corresponding to the data to be shared
		if (_dataSize * 10000 > _value || _dataSize * 10000 < _value) {
			console.log('数据内容或支付金额有误')
			return false
		}
		// contract call
		let result = await exrr.myContract.methods.sendDataSharingRequest(_kindOfCertificate, _dataSize, _extension).send({
			from: pk, 
			gas: 3000000,
			value: _dataSize * 10000
		})
		console.log('result', result)

	} catch (e) {
		console.log('error:', e)
	}
}

sendDataSharingRequest(pk, 1, 100, 1000000, 'eyJkYXRhIjoiIn0=')

