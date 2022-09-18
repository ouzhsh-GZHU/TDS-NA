
var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider(' '))

var abi = ' '

var contractAddr = ' '
var myContract = new web3.eth.Contract(abi, contractAddr)

var pk = ' '
var sk = ' '


var DSCserialNumber = ' '	


function checkDSCvalid(DSCserialNumber){
    
    myContract.methods.DSCs(DSCserialNumber).call({
        from: pk,
        gas: 3000000,   
    }).then(function (DSCres) {
        
        console.log('DSCres', DSCres)

        
        var myJSON = JSON.stringify(DSCres)
        console.log('myJSON', myJSON)

        
        var hashDSC = web3.eth.accounts.hashMessage(myJSON)


        
        myContract.methods.OnChainDSCs(DSCserialNumber).call({
            from: pk,
            gas: 3000000,   
        }).then(function (OnChainDSC) {
            console.log('OnChainDSC', OnChainDSC)
            if (OnChainDSC['hashVale'] == hashDSC) {
                console.log('hashVale check success,valid certificate', hashDSC)
                return "data storage success"
            } else {
                console.log('hashVale check failed,,invalid certificate')
                return "data storage failed"
            }
        })
    })
}
checkDSCvalid(DSCserialNumber)