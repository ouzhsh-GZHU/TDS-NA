// 检查颁发的数据访问证书的有效性
let ex = require('../universal/contract')


var pk = '0x7453e4517194dC1438E6FC29a02EB07fB84dadfb'
var sk = '133565c57d7566861a90a9b07c5e57cda5bded434bb1c31fc29e34a8ab87bfb3'

// DAC received by the DAU
var DACJSON = '{"0":"4","1":"ECDSA","2":"2","3":"4","4":"1670868697","5":["1670868697","1673460697"],"6":"0x7453e4517194dC1438E6FC29a02EB07fB84dadfb","7":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","8":"0x6c185176f11679d2557618dbbce223b93865c3d70859ed4821f637caa54f856358b7c7890bf7a69ce6081e196ceef952b741879f7debfa734f0993017eebdfc51c","9":"READ","10":["10000","0"],"11":"eyJkYXRhIjoiIn0=","serialNumber":"4","algOfsign":"ECDSA","kindOfCertificate":"2","issuerDSCserialNumber":"4","signedTimestamp":"1670868697","et":["1670868697","1673460697"],"requestor":"0x7453e4517194dC1438E6FC29a02EB07fB84dadfb","dataStorageAddress":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","signature":"0x6c185176f11679d2557618dbbce223b93865c3d70859ed4821f637caa54f856358b7c7890bf7a69ce6081e196ceef952b741879f7debfa734f0993017eebdfc51c","accessType":"READ","data":["10000","0"],"extension":"eyJkYXRhIjoiIn0="}' //DAC收到DSU颁发的DAC内容!!!!!!!!!!!!!!!!!!!!!!!!

// DAU check DAC
let checkDACvalid = async (DACJSON) => {
    let obtainedDAC = JSON.parse(DACJSON)

    let DACserialNumber = obtainedDAC.serialNumber

    var issuerDSCserialNumber = obtainedDAC.issuerDSCserialNumber
    console.log('issuerDSCserialNumber', issuerDSCserialNumber)

    var checkSignres = ex.web3.eth.accounts.recover(obtainedDAC.serialNumber, obtainedDAC.signature)
    console.log('checkSignres', checkSignres)

    let DSCres = await ex.myContract.methods.DSCs(issuerDSCserialNumber).call({
        from: pk,
        gas: 3000000,
    })
    if (checkSignres == DSCres['requestor']) {
        console.log('数据访问证书的签名校验通过')

    } else {
        console.log('数据访问证书的签名校验失败')

        return '数据访问证书的签名校验失败'
    }
    var hashDAC = ex.web3.eth.accounts.hashMessage(DACJSON)

    let OnChainDAC = await ex.myContract.methods.OnChainDACs(DACserialNumber).call({
        from: pk,
        gas: 3000000,
    })
    console.log('OnChainDAC', OnChainDAC)
    if (OnChainDAC['hashVale'] == hashDAC) {
        console.log('hashVale check success,valid certificate', hashDAC)
    } else {
        console.log('hashVale check failed,,invalid certificate')
    }
}
checkDACvalid(DACJSON)