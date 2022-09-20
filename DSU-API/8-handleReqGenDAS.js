var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '
var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '

var algOfsign = ' '

var requestor = ' '

var accessType = ' '
var encKey = ' '
var amount = ' '
var dataSize = ' '
var extension = ' '

var issuerDSCserialNumber = ' '
var day = ' '

function handleReqGenDAS(algOfsign, requestor, accessType, encKey, amount, dataSize, extension) {
	var start = parseInt(new Date().getTime() / 1000)
	var end = start + (day * 24 * 3600)

	myContract.methods.DACnum().call({
		from: pk,
		gas: 3000000,
	}).then(function (serialNumber) {
		console.log('serialNumber', serialNumber)

		var signature = web3.eth.accounts.sign(serialNumber, sk).signature
		console.log('signature', signature)

		var uints = [issuerDSCserialNumber, start, end, dataSize]
		var strings = [algOfsign, signature, accessType, encKey, extension]
		console.log('uints', uints)
		console.log('strings', strings)

		myContract.methods.genDAS(uints, requestor, strings).send({
			from: pk,
			gas: 3000000,
			value: amount
		}, (err, result) => {
			console.log('genDAS', err, result)

			sleep(4000)
			myContract.methods.DACnum().call({
				from: pk,
				gas: 3000000,
			}).then(function (DACnum) {
				var DACidx = DACnum - 1

				myContract.methods.DACs(DACidx).call({
					from: pk,
					gas: 3000000,
				}).then(function (DACres) {
					console.log('DACres', DACres)

					var myJSON = JSON.stringify(DACres)
					console.log('myJSON', myJSON)

					var hashDAC = web3.eth.accounts.hashMessage(myJSON)

					console.log('hashDAC', hashDAC)

					myContract.methods.putDAConChain(hashDAC).send({
						from: pk,
						gas: 3000000,
					}, (err, result) => {

						console.log('certificate has putDAConChain', err, result)
					})

				})
			})

		})

	})


}
handleReqGenDAS(algOfsign, requestor, accessType, encKey, amount, dataSize, extension)
function sleep(delay) {
	var start = (new Date()).getTime();
	while ((new Date()).getTime() - start < delay) {
		continue;
	}
}
