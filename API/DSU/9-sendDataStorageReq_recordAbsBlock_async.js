let ex = require('../universal/contract')
let exdr = require('../universal/DataRefContract')
var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

// DSU sends data storage requests and records write summary blocks
// Ciphertext to be uploaded to SSP
var encData = 'U2FsdGVkX1/bpwNMQBG6o8FSwtXsN9q2bTsYq3p7s2zMPWHxt+ac+dHNt/T4IwnqddBeGX6AhuZK4HbqQf/xmeO7CXfYbGtE5FCa4So5qXW1znC45ZmjhsKKeb6hDxilVJSthUh1a5A2FfE4+76c+6MeqtnZuX9QDkiN87VV6Yc6f6gKmI+lLY8WwQ/b/bK3KJrqUv/0CQzRzXcvxp/iCTDn4UDFFDifsHQtFp6i1kz2r7XkDr8wrzrOwh2b8miBptuOEZwuWbRBeNjCXbL0fzklOnETmci66k+H2PJBOo5ebHZJhoQxJbiP4vKUVLE+/JtMhnlBXoLbTDQcHlHDjT/OpjjT7cVo+S7kHWCBea5+OQk0gqA6B0q4mzJIXT9oVv2eNx0dmN+wcDSo1MjPbP/y1mu5HlOkHJKr6GULco0Up0MjfiUdrzNKz1d97yuZ0Ahjicl6/jouHhOLYe0+WPGxPb7yIiDjbWxi1lgc6QPCru80XY/EuWuK3WI2ju9z5PP9/X1ABeGfRkFa8ESQSHoxSPOSvrAtwagnov0N07DKy+a1lycKi19TkP0YbMDIr27C+UWr8zdhPFgVTjklqjJmjNPQBFlrQycT9eb0v9CLzqjHkZtwG60LgPNGw5lQVJKMnMoiWXdBiU4ZMuP5T5tBMhV7hO9N+h0cZgUktUTtu6Vc2Y8NXtXbwPODLPixge4aPVfwK3HyEpo4va33XlrsnSvaSPwmZUQep0IOnnF0sEWCTXxbaeetVL4oznZqaeQIVNvsrffwHbP7kXliReGcYz6HysprS0rWVZaoDBMUcOX8eHa/NN9z27TySazp1YX9ZwJuONwk1BOBoN6ymyJ3SfsL1dhKu/21yPXFkmLu7bKp/NTLU8EadFonirNnFSJsS8nKxS8H/ceq0kPfLCptSWpp9LNzV+Kdr8UjbXrqqxqxAv5+2zm5nT9t2kWUlBq8vJ4x2E8dOViARPuVUmJL1aMvtcBXQZtnP6OAGgHJ6Do9Ibt7QyUoaVg7HO9lNMA3syRVznuMljVHEA5RupBIzh0IDvGvPu544L7Dxd1JkwxX4lBi6jl2awtw5l/mUxvv4q4WK45/WTM34CfjTN8o81sRG1xo+6ng5+LaO0ucTtnqSuoB3V6NxUMr7xhqAMh9CKXN7PjW6yOiPg3wVhKLC49/YpGq/5rRXgunIk3jpfSiLxwXYGEfsrSBgxR+D7SxIte5UJnyXbTh1SEw9UcwqIuYGvcVNzS2kzgGqVkGPzOR+j1z1wvhvTTmCIykf4+L9qVUdy3JnXFilxRYgqX87E6ujS9O1VFTYK3wYZlDvETMTPmu0LMLNMFdqtKUaA6gmRlFBnKZ0oUj2PNhUTk7yH9l4swRtY3oTEFMVY4='
// DSU's DSC
var DSCJSON = '{"0":"4","1":"Schnorr_Keccak256","2":"1","3":"1670868463","4":["1670868463","1673460463"],"5":"0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940","6":"4","7":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","8":"(03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55,449064587815948356976135810527047658032736931053402628267138806709930531997906)","9":["1000000","100"],"10":"eyJkYXRhIjoiIn0=","serialNumber":"4","algOfsign":"Schnorr_Keccak256","kindOfCertificate":"1","signedTimestamp":"1670868463","et":["1670868463","1673460463"],"requestor":"0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940","requestSerialNumber":"4","dataStorageAddress":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","aggrSignature":"(03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55,449064587815948356976135810527047658032736931053402628267138806709930531997906)","data":["1000000","100"],"extension":"eyJkYXRhIjoiIn0="}'
let sendStorageReq = async (DSCJSON, encData) => {
	try {
		let content = DSCJSON + ':' + encData

		let hashContent = ex.web3.eth.accounts.hashMessage(content)

		var signature = ex.web3.eth.accounts.sign(hashContent, sk).signature

		console.log('发送给SSP的存储请求签名的signature', signature)

		let dataStorageAddress = JSON.parse(DSCJSON).dataStorageAddress

		let DataSharingAbstractBlock_Storage_res = await exdr.myContract.methods.DataSharingAbstractBlock_Storage(dataStorageAddress,
			serialNumber,
			signature,
			hashContent).send({
				from: pk,
				gas: 3000000,
			})

		console.log('DataSharingAbstractBlock_Storage_res', DataSharingAbstractBlock_Storage_res)
	} catch (e) {
		console.log('error:', e)
	}
}

sendStorageReq(DSCJSON, encData)

