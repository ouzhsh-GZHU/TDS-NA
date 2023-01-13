let exrr = require('../universal/RequestRefContract')

var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

let requestSerialNum = 1
// (R,s)
let AggregateSign = '(03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55,' + '449064587815948356976135810527047658032736931053402628267138806709930531997906)'
// DSU send Aggregate Signature
let sendAggregateSign = async (requestSerialNum, AggregateSign) => {
    try {
        let result = await exrr.myContract.methods.sendAggregateSign(requestSerialNum, AggregateSign).send({
            from: pk, 
            gas: 3000000,
        })
        console.log('result', result)
    } catch (e) {
        console.log('error:', e)
    }
}

// 调用数据共享请求函数
sendAggregateSign(requestSerialNum, AggregateSign)

