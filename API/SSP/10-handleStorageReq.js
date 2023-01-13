let ex = require('../universal/contract')
var fs = require("fs");
var pk = '0x0CA67fE81D999573E4161EcC7E1987949f4695a5'
var sk = 'c02b7fa40b2e51c0a78d5ef5d6c16104b3918546b783b36deae0ef9d8ac9c873'

// Simulation of the server getting the content of a data storage request from a data sharer
// Ciphertext of DSU
var obtainedEncData = 'U2FsdGVkX1/bpwNMQBG6o8FSwtXsN9q2bTsYq3p7s2zMPWHxt+ac+dHNt/T4IwnqddBeGX6AhuZK4HbqQf/xmeO7CXfYbGtE5FCa4So5qXW1znC45ZmjhsKKeb6hDxilVJSthUh1a5A2FfE4+76c+6MeqtnZuX9QDkiN87VV6Yc6f6gKmI+lLY8WwQ/b/bK3KJrqUv/0CQzRzXcvxp/iCTDn4UDFFDifsHQtFp6i1kz2r7XkDr8wrzrOwh2b8miBptuOEZwuWbRBeNjCXbL0fzklOnETmci66k+H2PJBOo5ebHZJhoQxJbiP4vKUVLE+/JtMhnlBXoLbTDQcHlHDjT/OpjjT7cVo+S7kHWCBea5+OQk0gqA6B0q4mzJIXT9oVv2eNx0dmN+wcDSo1MjPbP/y1mu5HlOkHJKr6GULco0Up0MjfiUdrzNKz1d97yuZ0Ahjicl6/jouHhOLYe0+WPGxPb7yIiDjbWxi1lgc6QPCru80XY/EuWuK3WI2ju9z5PP9/X1ABeGfRkFa8ESQSHoxSPOSvrAtwagnov0N07DKy+a1lycKi19TkP0YbMDIr27C+UWr8zdhPFgVTjklqjJmjNPQBFlrQycT9eb0v9CLzqjHkZtwG60LgPNGw5lQVJKMnMoiWXdBiU4ZMuP5T5tBMhV7hO9N+h0cZgUktUTtu6Vc2Y8NXtXbwPODLPixge4aPVfwK3HyEpo4va33XlrsnSvaSPwmZUQep0IOnnF0sEWCTXxbaeetVL4oznZqaeQIVNvsrffwHbP7kXliReGcYz6HysprS0rWVZaoDBMUcOX8eHa/NN9z27TySazp1YX9ZwJuONwk1BOBoN6ymyJ3SfsL1dhKu/21yPXFkmLu7bKp/NTLU8EadFonirNnFSJsS8nKxS8H/ceq0kPfLCptSWpp9LNzV+Kdr8UjbXrqqxqxAv5+2zm5nT9t2kWUlBq8vJ4x2E8dOViARPuVUmJL1aMvtcBXQZtnP6OAGgHJ6Do9Ibt7QyUoaVg7HO9lNMA3syRVznuMljVHEA5RupBIzh0IDvGvPu544L7Dxd1JkwxX4lBi6jl2awtw5l/mUxvv4q4WK45/WTM34CfjTN8o81sRG1xo+6ng5+LaO0ucTtnqSuoB3V6NxUMr7xhqAMh9CKXN7PjW6yOiPg3wVhKLC49/YpGq/5rRXgunIk3jpfSiLxwXYGEfsrSBgxR+D7SxIte5UJnyXbTh1SEw9UcwqIuYGvcVNzS2kzgGqVkGPzOR+j1z1wvhvTTmCIykf4+L9qVUdy3JnXFilxRYgqX87E6ujS9O1VFTYK3wYZlDvETMTPmu0LMLNMFdqtKUaA6gmRlFBnKZ0oUj2PNhUTk7yH9l4swRtY3oTEFMVY4='
// DSC
var obtainedDSC = '{"0":"4","1":"Schnorr_Keccak256","2":"1","3":"1670868463","4":["1670868463","1673460463"],"5":"0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940","6":"4","7":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","8":"(03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55,449064587815948356976135810527047658032736931053402628267138806709930531997906)","9":["1000000","100"],"10":"eyJkYXRhIjoiIn0=","serialNumber":"4","algOfsign":"Schnorr_Keccak256","kindOfCertificate":"1","signedTimestamp":"1670868463","et":["1670868463","1673460463"],"requestor":"0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940","requestSerialNumber":"4","dataStorageAddress":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","aggrSignature":"(03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55,449064587815948356976135810527047658032736931053402628267138806709930531997906)","data":["1000000","100"],"extension":"eyJkYXRhIjoiIn0="}'
// Construct DSC and cipher text as content
var content = obtainedDSC + ':' + obtainedEncData
// DSU's signature on data storage requests
var obtainedSignature = '0xd0e6cdcd4b5c997b5f77c0b9c5ae3b9cbae8ff814edb86ce2a4ea94eca491d0f667533d39bb7c5707f2b7badc99de04cd7202ce2d1182d91a17c7cd61934c4351b'

let handleStorageReq = async (obtainedEncData, obtainedDSC, content, obtainedSignature) => {
    var DSC = JSON.parse(obtainedDSC)

    let DSC_serialNumber = DSC.serialNumber
    console.log('DSC_serialNumber', DSC_serialNumber)

    let DSC_requestor = DSC.requestor
    console.log('DSC_requestor', DSC_requestor)

    var hashContent = ex.web3.eth.accounts.hashMessage(content)
    var recoverRes = ex.web3.eth.accounts.recover(hashContent, obtainedSignature)
    console.log('recoverRes', recoverRes)

    if (recoverRes == DSC_requestor) {
        console.log('签名验证通过,证书和数据内容完整!')
    } else {
        console.log('签名验证失败,证书和数据内容完整。')
    }

    var hashDSC = ex.web3.eth.accounts.hashMessage(obtainedDSC)

    let OnChainDSC = await ex.myContract.methods.OnChainDSCs(DSC_serialNumber).call({
        from: pk,
        gas: 3000000,
    })

    console.log('onChainCertificate', OnChainDSC)

    if (OnChainDSC['hashVale'] == hashDSC) {
        console.log('DSC hashVale check success, data storage success', hashDSC)
        // SSP emulates storage of DSU's encrypted data on local disk
        fs.writeFile("./storage/" + DSC_requestor.toLowerCase() + ".txt", obtainedEncData, { flag: "w" }, function (err) {
            if (!err) {
                console.log("DSU 的数据存储成功！")
            }
        })
    } else {
        console.log('DSC hashVale check failed')
    }
}

handleStorageReq(obtainedEncData, obtainedDSC, content, obtainedSignature)