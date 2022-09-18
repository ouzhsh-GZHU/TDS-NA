var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '

var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '


var obtainedSerialNumber = ' '
var obtainedEncData = ' '
var obtainedSignature = ' '




function handleStorageReq(obtainedSerialNumber, obtainedEncData, obtainedSignature) {



	myContract.methods.DSCs(obtainedSerialNumber).call({
		from: pk,
		gas: 3000000,
	}).then(function (DSCres) {

		console.log('DSCres', DSCres)


		var myJSON = JSON.stringify(DSCres)
		console.log('myJSON', myJSON)


		var hashDSC = web3.eth.accounts.hashMessage(myJSON)

		var recoverRes = web3.eth.accounts.recover(myJSON, obtainedSignature)
		console.log('recoverRes', recoverRes)



		var requestor = DSCres["requestor"]
		console.log("requestor", requestor)

		if (recoverRes == requestor) {
			console.log("数据共享用户身份验证通过")
		} else {
			console.log("数据共享用户身份验证失败")
			return
		}


		myContract.methods.OnChainDSCs(obtainedSerialNumber).call({
			from: pk,
			gas: 3000000,
		}).then(function (OnChainDSC) {
			console.log('onChainCertificate', OnChainDSC)
			if (OnChainDSC['hashVale'] == hashDSC) {
				console.log('hashVale check success', hashDSC)
				return "data storage success"
			} else {
				console.log('hashVale check failed')
				return "data storage failed"
			}
		})
	})

}

handleStorageReq(obtainedSerialNumber, obtainedEncData, obtainedSignature)