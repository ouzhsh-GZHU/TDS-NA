let ex = require('../universal/contract')

var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

var CRLserialNumber = 1;	// CRL Serial Number
var revokeDACserialNumber = 1;	// DAC Serial Number

// DSU uses CRL to revoke DACs it issues
let revokeDAC = async (CRLserialNumber, revokeDACserialNumber) => {
	var signature = ex.web3.eth.accounts.sign(revokeDACserialNumber, sk).signature
	console.log('signature', signature)

	let res = await ex.myContract.methods.revokeDAC(CRLserialNumber, revokeDACserialNumber, signature).send(
		{
			from: pk,
			gas: 3000000,
		}
	)
	console.log('res', res)
	console.log('%d访问证书撤销成功', revokeDACserialNumber)
}
revokeDAC(CRLserialNumber, revokeDACserialNumber)