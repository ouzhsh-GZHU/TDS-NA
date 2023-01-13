let ex = require('../universal/contract')

var pk = '0x7453e4517194dC1438E6FC29a02EB07fB84dadfb'
var sk = '133565c57d7566861a90a9b07c5e57cda5bded434bb1c31fc29e34a8ab87bfb3'

// Simulating DAU access to data at SSP
var encData = ''
// DAU's public key
var publicKey = '0x043d1a02c07e5f06e1a3521554c26caa2f0bf89e295c0829fdc7b931033a553986af347ff3f1a02a3725ba296998fb6402dd7a055e81daddc562d56c6a6c06c648'
var DACJSON = '{"0":"4","1":"ECDSA","2":"2","3":"4","4":"1670868697","5":["1670868697","1673460697"],"6":"0x7453e4517194dC1438E6FC29a02EB07fB84dadfb","7":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","8":"0x6c185176f11679d2557618dbbce223b93865c3d70859ed4821f637caa54f856358b7c7890bf7a69ce6081e196ceef952b741879f7debfa734f0993017eebdfc51c","9":"READ","10":["10000","0"],"11":"eyJkYXRhIjoiIn0=","serialNumber":"4","algOfsign":"ECDSA","kindOfCertificate":"2","issuerDSCserialNumber":"4","signedTimestamp":"1670868697","et":["1670868697","1673460697"],"requestor":"0x7453e4517194dC1438E6FC29a02EB07fB84dadfb","dataStorageAddress":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","signature":"0x6c185176f11679d2557618dbbce223b93865c3d70859ed4821f637caa54f856358b7c7890bf7a69ce6081e196ceef952b741879f7debfa734f0993017eebdfc51c","accessType":"READ","data":["10000","0"],"extension":"eyJkYXRhIjoiIn0="}' //DAC收到DSU颁发的DAC内容!!!!!!!!!!!!!!!!!!!!!!!!

// 存储服务器将会收到数据共享用户发来的加密数据、签名、证书（用证书序列号指定）
let sendAccessReq = async (myJSON) => {
	// Signature confirmation of data access requests by DAU
	var hashContent = ex.web3.eth.accounts.hashMessage(myJSON)
	var signature = ex.web3.eth.accounts.sign(hashContent, sk).signature
	console.log('signature', signature)
}
sendAccessReq(DACJSON)