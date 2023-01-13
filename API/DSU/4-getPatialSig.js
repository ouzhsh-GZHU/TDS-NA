let exrr = require('../universal/RequestRefContract')

var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

let serialNumber = 1

// DSU obtains partial signatures of all NA
let getPatialSigAndAggr = async (serialNumber) => {
    try {
        let result = await exrr.myContract.methods.getRequestSig(serialNumber).call({
            from: pk,
            gas: 3000000,
        })
        console.log('R', result['R'])
        console.log('s', result['s'])
    } catch (e) {
        console.log('error:', e)
    }
}

getPatialSigAndAggr(serialNumber)

