let ex = require('../universal/contract')
let exdr = require('../universal/DataRefContract')
var pk = '0x0CA67fE81D999573E4161EcC7E1987949f4695a5'
var sk = 'c02b7fa40b2e51c0a78d5ef5d6c16104b3918546b783b36deae0ef9d8ac9c873'

let serialNumber = 0
// SSP uses PKtoAddr in tool to get the recovered address
let PK = '043d3f6c4e5d0122ba73c0df13a6b629567b84dfbea662d0bd254907ca946133f32ee9fb88d8def2c954d018631c2e08884f55ad953b8431d3240417f67bd12e72'
let recoverAddr = '0x7453e4517194dC1438E6FC29a02EB07fB84dadfb'
let kind = 'DAC'
let checkDSUP_PK = async (kind, serialNumber, recoverAddr) => {
    if (kind == 'DSC') {
        let dsc = await ex.myContract.methods.DSCs(serialNumber).call({
            from: pk,
            gas: 3000000,   //汽油费上限
        })
        console.log('DSC', dsc)

        let dsc_requestor = dsc['requestor']

        if (recoverAddr == dsc_requestor) {
            console.log('DSU public key check success!')
        } else {
            console.log('DSU public key check failed!')
        }
    }
    if (kind == 'DAC') {
        let dac = await ex.myContract.methods.DACs(serialNumber).call({
            from: pk,
            gas: 3000000,
        })
        console.log('dac', dac)

        let dac_requestor = dac['requestor']

        if (recoverAddr == dac_requestor) {
            console.log('DAU public key check success!')
        } else {
            console.log('DAU public key check failed!')
        }
    }
}

checkDSUP_PK(kind, serialNumber, recoverAddr)