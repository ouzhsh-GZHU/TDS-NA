let ex = require('../universal/contract')

var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

// Simulation of data access user request information received by the DSU
var algOfsign = 'ECDSA'

// DAU's address
var requestor = '0x7453e4517194dC1438E6FC29a02EB07fB84dadfb' 

var accessType = 'READ'
var contentKey = 'privatekey'
var amount = 10000 
var dataSize = 0 
var extension = 'eyJkYXRhIjoiIn0=' 

var issuerDSCserialNumber = 1
var day = 30

let handleReqGenDAS = async (algOfsign, requestor, accessType, amount, dataSize, extension) => {
	var start = parseInt(new Date().getTime() / 1000)
	var end = start + (day * 24 * 3600)

	let serialNumber = await ex.myContract.methods.DACnum().call({
		from: pk,
		gas: 3000000,   //汽油费上限
	})
	console.log('serialNumber', serialNumber)

	var signature = ex.web3.eth.accounts.sign(serialNumber, sk).signature
	console.log('signature', signature)

	var uints = [issuerDSCserialNumber, start, end, dataSize]

	var strings = [algOfsign, signature, accessType, extension]

	let genDASRes = await ex.myContract.methods.genDAS(uints, requestor, strings).send({
		from: pk,
		gas: 3000000,
		value: amount
	})
	console.log('gegenDASResnDAS', genDASRes)

	let DACnum = await ex.myContract.methods.DACnum().call({
		from: pk,
		gas: 3000000,
	})
	// 当前证书编号
	var DACidx = DACnum - 1

	let DACres = await ex.myContract.methods.DACs(DACidx).call({
		from: pk,
		gas: 3000000,
	})

	var myJSON = JSON.stringify(DACres)
	console.log('myJSON', myJSON)

	var hashDAC = ex.web3.eth.accounts.hashMessage(myJSON)

	console.log('hashDAC', hashDAC)

	let putDAConChainRes = await ex.myContract.methods.putDAConChain(hashDAC).send({
		from: pk,
		gas: 3000000,
	})
	console.log('certificate has putDAConChain', putDAConChainRes)
}
handleReqGenDAS(algOfsign, requestor, accessType, amount, dataSize, extension)
