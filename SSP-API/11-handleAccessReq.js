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




function handleAccessReq(obtainedSerialNumber, obtainedEncData, obtainedSignature) {



	myContract.methods.DACs(obtainedSerialNumber).call({
		from: pk,
		gas: 3000000,
	}).then(function (DACres) {

		console.log('DACres', DACres)

		var issuerDSCserialNumber = DACres['issuerDSCserialNumber']


		var myJSON = JSON.stringify(DACres)
		console.log('myJSON', myJSON)


		var hashDAC = web3.eth.accounts.hashMessage(myJSON)
		console.log('hashDAC', hashDAC)


		var recoverRes = web3.eth.accounts.recover(myJSON, obtainedSignature)
		console.log('recoverRes', recoverRes)



		var requestor = DACres["requestor"]
		console.log("requestor", requestor)

		if (recoverRes == requestor) {
			console.log("数据访问用户身份验证通过")
		} else {
			console.log("数据访问用户身份验证失败")
			return
		}


		myContract.methods.OnChainDACs(obtainedSerialNumber).call({
			from: pk,
			gas: 3000000,
		}).then(function (OnChainDAC) {
			console.log('OnChainDAC', OnChainDAC)
			if (OnChainDAC['hashVale'] == hashDAC) {
				console.log('DAC hashVale check success', hashDAC)
			} else {
				console.log('DAC hashVale check failed')
				return "data handle failed"
			}



			myContract.methods.checkRevokeInfo(obtainedSerialNumber).call({
				from: pk,
				gas: 3000000,
			}).then(function (checkRevokeInfores) {
				console.log('checkRevokeInfores', checkRevokeInfores)
				if (checkRevokeInfores == false) {
					console.log("证书有效，数据处理成功")
				} else {
					console.log("证书已被撤销，数据处理失败")
				}



			})
		})
	})

}

handleAccessReq(obtainedSerialNumber, obtainedEncData, obtainedSignature)