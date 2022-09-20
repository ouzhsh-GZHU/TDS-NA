var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '

var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '

var encData = ' '
var serialNumber = ' '

function sendStorageReq(serialNumber) {
	myContract.methods.DSCs(serialNumber).call({
		from: pk,
		gas: 3000000,
	}).then(function (DSCres) {

		console.log('DSCres', DSCres)

		var myJSON = JSON.stringify(DSCres)
		console.log('myJSON', myJSON)

		var signature = web3.eth.accounts.sign(myJSON, sk).signature
		console.log('signature', signature)
	})

}

sendStorageReq(serialNumber)
