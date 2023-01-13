let ex = require('../universal/contract')
let exdr = require('../universal/DataRefContract')
var pk = '0xEdf0AA152C14fBCf6C8c809e9573af7293cfd940'
var sk = 'fa7177df350bfce67646cd2c49021bbf459c48bed8ae633704afc67dddf5ca0f'

// The DSC serial number corresponding to the shared data
var serialNumber = 1
// Encrypted data obtained from SSP
var SSPReturnEncData = 'U2FsdGVkX1/bpwNMQBG6o8FSwtXsN9q2bTsYq3p7s2zMPWHxt+ac+dHNt/T4IwnqddBeGX6AhuZK4HbqQf/xmeO7CXfYbGtE5FCa4So5qXW1znC45ZmjhsKKeb6hDxilVJSthUh1a5A2FfE4+76c+6MeqtnZuX9QDkiN87VV6Yc6f6gKmI+lLY8WwQ/b/bK3KJrqUv/0CQzRzXcvxp/iCTDn4UDFFDifsHQtFp6i1kz2r7XkDr8wrzrOwh2b8miBptuOEZwuWbRBeNjCXbL0fzklOnETmci66k+H2PJBOo5ebHZJhoQxJbiP4vKUVLE+/JtMhnlBXoLbTDQcHlHDjT/OpjjT7cVo+S7kHWCBea5+OQk0gqA6B0q4mzJIXT9oVv2eNx0dmN+wcDSo1MjPbP/y1mu5HlOkHJKr6GULco0Up0MjfiUdrzNKz1d97yuZ0Ahjicl6/jouHhOLYe0+WPGxPb7yIiDjbWxi1lgc6QPCru80XY/EuWuK3WI2ju9z5PP9/X1ABeGfRkFa8ESQSHoxSPOSvrAtwagnov0N07DKy+a1lycKi19TkP0YbMDIr27C+UWr8zdhPFgVTjklqjJmjNPQBFlrQycT9eb0v9CLzqjHkZtwG60LgPNGw5lQVJKMnMoiWXdBiU4ZMuP5T5tBMhV7hO9N+h0cZgUktUTtu6Vc2Y8NXtXbwPODLPixge4aPVfwK3HyEpo4va33XlrsnSvaSPwmZUQep0IOnnF0sEWCTXxbaeetVL4oznZqaeQIVNvsrffwHbP7kXliReGcYz6HysprS0rWVZaoDBMUcOX8eHa/NN9z27TySazp1YX9ZwJuONwk1BOBoN6ymyJ3SfsL1dhKu/21yPXFkmLu7bKp/NTLU8EadFonirNnFSJsS8nKxS8H/ceq0kPfLCptSWpp9LNzV+Kdr8UjbXrqqxqxAv5+2zm5nT9t2kWUlBq8vJ4x2E8dOViARPuVUmJL1aMvtcBXQZtnP6OAGgHJ6Do9Ibt7QyUoaVg7HO9lNMA3syRVznuMljVHEA5RupBIzh0IDvGvPu544L7Dxd1JkwxX4lBi6jl2awtw5l/mUxvv4q4WK45/WTM34CfjTN8o81sRG1xo+6ng5+LaO0ucTtnqSuoB3V6NxUMr7xhqAMh9CKXN7PjW6yOiPg3wVhKLC49/YpGq/5rRXgunIk3jpfSiLxwXYGEfsrSBgxR+D7SxIte5UJnyXbTh1SEw9UcwqIuYGvcVNzS2kzgGqVkGPzOR+j1z1wvhvTTmCIykf4+L9qVUdy3JnXFilxRYgqX87E6ujS9O1VFTYK3wYZlDvETMTPmu0LMLNMFdqtKUaA6gmRlFBnKZ0oUj2PNhUTk7yH9l4swRtY3oTEFMVY4='
let VerifyDataIntegrity = async (serialNumber, SSPReturnEncData) => {
    try {
        // Get the data digest block corresponding to the current certificate
        let res = await exdr.myContract.methods.DataSharingAbstractBlocks(serialNumber.toString(), '0').call({
            from: pk,
            gas: 3000000,
        })
        console.log('res', res)

        let onchainDataHash = res['dataHash']
        console.log('onchainDataHash', onchainDataHash)

        let DSCres = await ex.myContract.methods.DSCs(serialNumber).call({
            from: pk,
            gas: 3000000,
        })

        // Using the content of DSC and the encrypted data returned by SSP, reconstruct the content to do authentication
        let EncDataHash = ex.web3.eth.accounts.hashMessage(JSON.stringify(DSCres) + ":" + SSPReturnEncData)
        console.log('EncDataHash', EncDataHash)
        if (onchainDataHash != EncDataHash) {
            console.log('SSP返回数据有误')
        } else {
            console.log('SSP返回的数据完整性校验通过')
        }
    } catch (e) {
        console.log('error:', e)
    }
}

VerifyDataIntegrity(serialNumber, SSPReturnEncData)