var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '
var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '

function checkNAorSSSPRespData() {
	myContract.methods.latestHandleIdx().call({
		from: pk,
		gas: 3000000,
	}).then(function (res) {
		myContract.methods.DataSharingHandledResps(res).call({
			from: pk,
			gas: 3000000,
		}).then(function (resultSSP) {
			console.log('resultSSP', resultSSP)

			var spRspSerialNumber = resultSSP["rspSerialNumber"]
			var spReqSerialNumber = resultSSP["reqSerialNumber"]
			var spRequestor = resultSSP["requestor"]
			var spStorageAddr = resultSSP["storageAddr"]
			var spSignData = resultSSP["signData"]
			var spSignature = resultSSP["signature"]

			myContract.methods.DataSharingRequests(spReqSerialNumber).call({
				from: pk,
				gas: 3000000,
			}).then(function (resDataSharingRequest) {
				if (resDataSharingRequest["serialNumber"] == spReqSerialNumber && resDataSharingRequest["Handled"] == false) {
					console.log('验证数据共享请求reqSerialNumber存在并且未处理,成功')

					var checkSignRes = web3.eth.accounts.recover(spSignData, spSignature)
					if (checkSignRes == spRequestor) {
						console.log('SSP signature has checked success')

						myContract.methods.getDataSharingHandledResp().send({
							from: pk,
							gas: 3000000,
						}, (err, result) => {
							console.log('SSP resp has handled success', err, result)

							myContract.methods.latestHandleIdx().call({
								from: pk,
								gas: 3000000,
							}).then(function (res) {
								myContract.methods.DataSharingHandledResps(res).call({
									from: pk,
									gas: 3000000,
								}).then(function (resultNA) {
									console.log('resultNA', resultNA)

									var caRspSerialNumber = resultNA["rspSerialNumber"]
									var caReqSerialNumber = resultNA["reqSerialNumber"]
									var caRequestor = resultNA["requestor"]
									var caSignData = resultNA["signData"]
									var caSignature = resultNA["signature"]

									myContract.methods.DataSharingRequests(caReqSerialNumber).call({
										from: pk,
										gas: 3000000,
									}).then(function (resDataSharingRequest) {
										if (resDataSharingRequest["serialNumber"] == caReqSerialNumber && resDataSharingRequest["Handled"] == false) {
											console.log('验证数据共享请求reqSerialNumber存在并且未处理,成功')

											var checkSignRes = web3.eth.accounts.recover(caSignData, caSignature)
											if (checkSignRes == caRequestor) {
												console.log('NA signature has checked success')

												myContract.methods.getDataSharingHandledResp().send({
													from: pk,
													gas: 3000000,
												}, (err, result) => {
													console.log('NA resp has handled success', err, result)

													var start = parseInt(new Date().getTime() / 1000)
													var day = 30
													var end = start + (day * 24 * 3600)

													myContract.methods.handelRespAndGenDSC(start, end).send({
														from: pk,
														gas: 3000000,
													}, (err, result) => {
														console.log('certificate has handled success', err, result)

														sleep(4000)

														myContract.methods.DSCNum().call({
															from: pk,
															gas: 3000000,
														}).then(function (DSCNum) {
															console.log("DSCNum", DSCNum)

															var DSCidx = DSCNum - 1
															console.log("DSCidx", DSCidx)

															myContract.methods.DSCs(DSCidx).call({
																from: pk,
																gas: 3000000,
															}).then(function (DSCres) {
																console.log('DSCres', DSCres)

																var myJSON = JSON.stringify(DSCres)
																console.log('myJSON', myJSON)

																var hashDSC = web3.eth.accounts.hashMessage(myJSON)

																console.log('hashDSC', hashDSC)

																myContract.methods.putDSConChain(hashDSC).send({
																	from: pk,
																	gas: 3000000,
																}, (err, result) => {
																	console.log('certificate has putDSConChain', err, result)
																})

															})
														})
													})

												})
											} else {
												console.log("checkNASign failed...")
												return false
											}
										} else {
											console.log("resultNA check failed...")
											return false
										}
									})

								})
							})
						})
					} else {
						console.log("checkSSPSign failed...")
						return false
					}
					console.log(checkSignRes)

				} else {
					console.log("resultSSP check failed...")
					return false
				}
			})
		})
	})

}
checkNAorSSPRespData()
function sleep(delay) {
	var start = (new Date()).getTime();
	while ((new Date()).getTime() - start < delay) {
		continue;
	}
}
