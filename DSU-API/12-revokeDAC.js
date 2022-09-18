var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '
var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '

var CRLserialNumber = ' ';
var revokeDACserialNumber = ' ';	

function revokeDAC(CRLserialNumber, revokeDACserialNumber) {
	var signature = web3.eth.accounts.sign(revokeDACserialNumber, sk).signature
	console.log('signature', signature)

	myContract.methods.revokeDAC(CRLserialNumber, revokeDACserialNumber, signature).send(
		{
			from: pk, 
			gas: 3000000,   
		}, (err, result) => {
			console.log('%d访问证书撤销成功', revokeDACserialNumber)
			console.log(err, result)
		}
	)

}
revokeDAC(CRLserialNumber, revokeDACserialNumber)