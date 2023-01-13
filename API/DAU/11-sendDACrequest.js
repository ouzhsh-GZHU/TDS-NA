let ex = require('../universal/contract')

var pk = '0x7453e4517194dC1438E6FC29a02EB07fB84dadfb'
var sk = '133565c57d7566861a90a9b07c5e57cda5bded434bb1c31fc29e34a8ab87bfb3'

// DAC Request message sent by DAU to DSU

var accessType = 'READ'
var amount = 10000
var dataSize = 0
var extension = 'eyJkYXRhIjoiIn0='

var issuerDSCserialNumber = 1

let sendDACrequest = async () => {
    let DSCres = await ex.myContract.methods.DSCs(issuerDSCserialNumber).call({
        from: pk,
        gas: 3000000,
    })
    let DSUrequestor = DSCres['requestor']
    console.log('DSUrequestor', DSUrequestor)

    let DAUTransferToDSUres = await ex.myContract.methods.DAUTransferToDSU(DSUrequestor).send({
        from: pk,
        gas: 3000000,
        value: amount
    })
    console.log('DAUTransferToDSUres', DAUTransferToDSUres)
}
sendDACrequest()