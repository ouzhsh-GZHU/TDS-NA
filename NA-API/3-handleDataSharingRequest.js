var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '
var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '



function handleRequest() {

	myContract.methods.getUnhandledRequests().call({
		from: pk,
		gas: 3000000,
	}).then(function (res) {

		var unhandledRequest;
		var serialNumber;
		var unhandled;

		unhandledRequest = res
		unhandled = res[0]
		serialNumber = res[1]



		if (!unhandled) {
			return false
		}

		console.log(unhandledRequest)
		console.log('unhandled', unhandled)
		console.log('serialNumber', serialNumber)




		var dataSharingRequest
		myContract.methods.DataSharingRequests(serialNumber).call({
			from: pk,
			gas: 3000000,
		}).then(function (result) {
			dataSharingRequest = result
			console.log('dataSharingRequest', dataSharingRequest)


			var _kindOfCertificate = Number(dataSharingRequest["_kindOfCertificate"])
			var _dataSize = Number(dataSharingRequest['_dataSize'])
			var _value = Number(dataSharingRequest['amount'])
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

			console.log('check dataSharingRequest success...')



			var serialNumber = dataSharingRequest['serialNumber']


			var storageAddr = ''


			var alg = 'SHA256'

			var sign = web3.eth.accounts.sign(serialNumber, sk).signature




			myContract.methods.getAndSaveNAorSSPResp(serialNumber, alg, storageAddr, serialNumber, sign).send({
				from: pk,
				gas: 3000000,
			}, (err, result) => {
				console.log(err, result)
				console.log('getAndSaveNAorSSPResp success')
			})

		})

	})


}

handleRequest()



const sleep = () => {
	setTimeout(() => { console.log('sleep 2s ...') }, 2000);
};
