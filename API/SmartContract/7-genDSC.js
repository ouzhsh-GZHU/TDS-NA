let ex = require('../universal/contract')
let exrr = require('../universal/RequestRefContract')

var pk = '0x36f8919fBaC57F562763f4731319cA859EE8cF89'
var sk = '8f807bbd3f40091832c9fb6510db70f96edea240ff87262dc8716c981bef5c88'

// Smart Contract Generation DSC
let genDSC = async () => {
    try {
        // Certificate expiration date
        var start = parseInt(new Date().getTime() / 1000)
        var day = 30
        var end = start + (day * 24 * 3600)

        let GenDSCRes = await ex.myContract.methods.GenDSC(start, end).send({
            from: pk,
            gas: 3000000,
        })
        console.log('GenDSCRes', GenDSCRes)
        
        let DSCNum = await ex.myContract.methods.DSCNum().call({
            from: pk,
            gas: 3000000,
        })

        console.log("DSCNum", DSCNum)
        var DSCidx = DSCNum - 1
        console.log("DSCidx", DSCidx)

        let DSCres = await ex.myContract.methods.DSCs(DSCidx).call({
            from: pk,
            gas: 3000000,
        })

        console.log('DSCres', DSCres)

        var myJSON = JSON.stringify(DSCres)
        console.log('myJSON', myJSON)
        var hashDSC = ex.web3.eth.accounts.hashMessage(myJSON)

        console.log('hashDSC', hashDSC)

        // Certificate Abstract Upload Blockchain
        let result3 = await ex.myContract.methods.putDSConChain(hashDSC).send({
            from: pk,
            gas: 3000000,
        })
        console.log('certificate has putDSConChain', result3)
    } catch (e) {
        console.log('error:', e)
    }
}

genDSC()