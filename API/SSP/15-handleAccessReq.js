let ex = require('../universal/contract')
let exdr = require('../universal/DataRefContract')
var pk = '0x0CA67fE81D999573E4161EcC7E1987949f4695a5'
var sk = 'c02b7fa40b2e51c0a78d5ef5d6c16104b3918546b783b36deae0ef9d8ac9c873'
var fs = require("fs");
// Simulation of SSP to get the content of data access request to DAU
var obtainDAC = '{"0":"4","1":"ECDSA","2":"2","3":"4","4":"1670868697","5":["1670868697","1673460697"],"6":"0x7453e4517194dC1438E6FC29a02EB07fB84dadfb","7":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","8":"0x6c185176f11679d2557618dbbce223b93865c3d70859ed4821f637caa54f856358b7c7890bf7a69ce6081e196ceef952b741879f7debfa734f0993017eebdfc51c","9":"READ","10":["10000","0"],"11":"eyJkYXRhIjoiIn0=","serialNumber":"4","algOfsign":"ECDSA","kindOfCertificate":"2","issuerDSCserialNumber":"4","signedTimestamp":"1670868697","et":["1670868697","1673460697"],"requestor":"0x7453e4517194dC1438E6FC29a02EB07fB84dadfb","dataStorageAddress":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","signature":"0x6c185176f11679d2557618dbbce223b93865c3d70859ed4821f637caa54f856358b7c7890bf7a69ce6081e196ceef952b741879f7debfa734f0993017eebdfc51c","accessType":"READ","data":["10000","0"],"extension":"eyJkYXRhIjoiIn0="}'
var obtainDAUPK = '0x043d1a02c07e5f06e1a3521554c26caa2f0bf89e295c0829fdc7b931033a553986af347ff3f1a02a3725ba296998fb6402dd7a055e81daddc562d56c6a6c06c648'
var obtainedSignature = '0x4eb693a36e38e1269e2bf179e8db5397f7cd8e660ff0eb4eb017a2f4ab547c1e44118b863669df3d38d9505804d94be3b7380faee6a4ee3fb6023e0d7dfeb5fa1b'

// SSP will receive signatures, certificates from DAU
let handleAccessReq = async (obtainDAC, obtainedSignature) => {
    let DAC = JSON.parse(obtainDAC)

    let DAC_serialNumber = DAC.serialNumber
    console.log('DAC_serialNumber', DAC_serialNumber)

    let DAC_requestor = DAC.requestor
    console.log('DAC_requestor', DAC_requestor)

    let hashContent = ex.web3.eth.accounts.hashMessage(obtainDAC)
    let recoverRes = ex.web3.eth.accounts.recover(hashContent, obtainedSignature)
    console.log('recoverRes', recoverRes)
    if (recoverRes == DAC_requestor) {
        console.log('签名验证通过,证书内容完整!')
    } else {
        console.log('签名验证失败,证书内容完整。')
    }

    // Determine whether the certificate is revoked
    let checkRevokeInfores = await ex.myContract.methods.checkRevokeInfo(DAC_serialNumber).call({
        from: pk,
        gas: 3000000,
    })
    console.log('checkRevokeInfores', checkRevokeInfores)
    if (checkRevokeInfores == false) {
        let hashDAC = ex.web3.eth.accounts.hashMessage(obtainDAC)

        // Verify that the hash of the on-chain certificate and the obtained certificate are the same
        let OnChainDAC = await ex.myContract.methods.OnChainDACs(DAC_serialNumber).call({
            from: pk,
            gas: 3000000,
        })
        console.log('onChainCertificate', OnChainDAC)
        if (OnChainDAC['hashVale'] == hashDAC) {
            console.log('DAC hashVale check success, data access success', hashDAC)
            // Read the file data stored in SSP
            fs.readFile('./' + DAC.dataStorageAddress + '.txt', function (err, data) {
                if (!err) {
                    console.log('SSP reuturn data:', data + "");
                } else {
                    console.log(err);
                }

            });

            // SSP generates data access record summary blocks
            let SSPSign = ex.web3.eth.accounts.sign(obtainedSignature, sk).signature;
            console.log('SSPSign', SSPSign)
            let DataAccessAbstractBlock_addRES = await exdr.myContract.methods.DataAccessAbstractBlock_add(DAC.issuerDSCserialNumber,
                DAC.dataStorageAddress,
                DAC_serialNumber,
                DAC_requestor,
                obtainedSignature,
                SSPSign
            ).send({
                from: pk,
                gas: 3000000,
            })
            console.log('DataAccessAbstractBlock_addRES', DataAccessAbstractBlock_addRES)
        } else {
            console.log('DAC hashVale check failed')
            return "data access failed"
        }
    } else {
        console.log("证书已被撤销，数据处理失败")
        return
    }

}
handleAccessReq(obtainDAC, obtainedSignature)