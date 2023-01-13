// 检查颁发的数据存储证书的有效性
let ex = require('../universal/contract')

var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

// DSU checks DSC
var DSCJSON = '{"0":"4","1":"Schnorr_Keccak256","2":"1","3":"1670868463","4":["1670868463","1673460463"],"5":"0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940","6":"4","7":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","8":"(03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55,449064587815948356976135810527047658032736931053402628267138806709930531997906)","9":["1000000","100"],"10":"eyJkYXRhIjoiIn0=","serialNumber":"4","algOfsign":"Schnorr_Keccak256","kindOfCertificate":"1","signedTimestamp":"1670868463","et":["1670868463","1673460463"],"requestor":"0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940","requestSerialNumber":"4","dataStorageAddress":"/storage/0xedf0aa152c14fbcf6c8c809e9573af7293cfd940","aggrSignature":"(03f1e789cdbec1583fb73e713439f301994f058d890422f260b9f199c72fb70c55,449064587815948356976135810527047658032736931053402628267138806709930531997906)","data":["1000000","100"],"extension":"eyJkYXRhIjoiIn0="}'	//复制智能合约生成的DSC json字符串！！！！！！！！

let checkDSCvalid = async (DSCJSON) => {
    var hashDSC = ex.web3.eth.accounts.hashMessage(DSCJSON)
    
    var DSCserialNumber = JSON.parse(DSCJSON).serialNumber
    
    let OnChainDSC = await ex.myContract.methods.OnChainDSCs(DSCserialNumber).call({
        from: pk,
        gas: 3000000,
    })
    console.log('OnChainDSC', OnChainDSC)
    if (OnChainDSC['hashVale'] == hashDSC) {
        console.log('hashVale check success,valid certificate', hashDSC)

    } else {
        console.log('hashVale check failed,,invalid certificate')
    }
}
checkDSCvalid(DSCJSON)