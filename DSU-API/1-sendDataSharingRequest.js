var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '
var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '

function sendDataSharingRequest(_userAddr, _kindOfCertificate, _dataSize, _value, _extension) {
	if (_kindOfCertificate < 1 || _kindOfCertificate > 2) {
		console.log('证书类型有误')
		return false
	}
	if (_dataSize < 0 || _value < 0) {
		console.log('数据内容或支付金额有误')
		return false
	}
	
	if (_dataSize * 10000 > _value || _dataSize * 10000 < _value) {
		console.log('数据内容或支付金额有误')
		return false
	}
	
	myContract.methods.sendDataSharingRequest(_kindOfCertificate, _dataSize, _extension).send({
		from: _userAddr, 
		
		gas: 3000000,   
		value: _dataSize * 10000    
	}, (err, result) => {
		console.log(err, result)
	})
	return true
}

console.log(sendDataSharingRequest(pk, 1, 100, 1000000, 'eyJkYXRhIjoiIn0='))
