let ex = require('../universal/contract')
let exrr = require('../universal/RequestRefContract')

var pk = '0x36f8919fBaC57F562763f4731319cA859EE8cF89'
var sk = '8f807bbd3f40091832c9fb6510db70f96edea240ff87262dc8716c981bef5c88'

// Smart contract tools check request processing information
let checkCAorSPRespData = async () => {
    try {
        // 1.Get the latest pending request serial number
        let UnhandledRequest = await exrr.myContract.methods.getUnhandledRequests().call({
            from: pk,
            gas: 3000000,
        })
        var serialNumber
        var unhandled

        unhandled = UnhandledRequest[0]
        serialNumber = UnhandledRequest[1]

        if (!unhandled) {
            return false
        }

        console.log('UnhandledRequest', UnhandledRequest)
        console.log('unhandled', unhandled)

        console.log('serialNumber', serialNumber)

        let dataSharingRequest = await exrr.myContract.methods.DataSharingRequests(serialNumber).call({
            from: pk,
            gas: 3000000,   //汽油费上限
        })

        // 2.Validate data and format of data sharing requests
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

        var myJSON = JSON.stringify(dataSharingRequest)

        let message = exrr.web3.utils.keccak256(myJSON)

        console.log('message', message)

        // Get Aggregate Signature
        let AggrSign = await exrr.myContract.methods.getDataSharingRequestAggrSigns(serialNumber).call({
            from: pk,
            gas: 3000000,
        })
        console.log('AggrSign', AggrSign)
    } catch (e) {
        console.log('error:', e)
    }
}

checkCAorSPRespData()