var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '

var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '

var DACserialNumber = 

function checkDACvalid(DACserialNumber) {	
	myContract.methods.DACs(DACserialNumber).call({
		from: pk,
		gas: 3000000,   
	}).then(function (DACres) {	
		console.log('DACres', DACres)
		
		var issuerDSCserialNumber = DACres['issuerDSCserialNumber']
		console.log('issuerDSCserialNumber', issuerDSCserialNumber)
		
		var checkSignres = web3.eth.accounts.recover(DACres['serialNumber'], DACres['signature'])
		console.log('checkSignres', checkSignres)

		myContract.methods.DSCs(issuerDSCserialNumber).call({
			from: pk,
			gas: 3000000,   
		}).then(function (DSCres) {
			if (checkSignres == DSCres['requestor']) {
				console.log('数据访问证书的签名校验通过')
			} else {
				console.log('数据访问证书的签名校验失败')
				return '数据访问证书的签名校验失败'
			}
	
			var myJSON = JSON.stringify(DACres)
			console.log('myJSON', myJSON)

			var hashDAC = web3.eth.accounts.hashMessage(myJSON)

			myContract.methods.OnChainDACs(DACserialNumber).call({
				from: pk,
				gas: 3000000,   
			}).then(function (OnChainDAC) {
				console.log('OnChainDAC', OnChainDAC)
				if (OnChainDAC['hashVale'] == hashDAC) {
					console.log('hashVale check success,valid certificate', hashDAC)
					return "data storage success"
				} else {
					console.log('hashVale check failed,,invalid certificate')
					return "data storage failed"
				}
			})
		})

	})

}
checkDACvalid(DACserialNumber)
