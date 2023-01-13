//根据公钥生成地址实例详细流程
const sha3 = require("js-sha3");
const { utils } = require("ethers")

// public key
// Example
let public_key = '0x041100d8a309739474f5e96b4630946b29c20eef41a91401dc56aa4dba1936dcd9292f2e90fbc2997af152a7dc6603f83de2fbfbe2ca32015295fe26dffbc832c5'
function checkPK(public_key) {
    let new_key = "0x" + public_key.substring(4)

    let new_bytes = utils.arrayify(new_key)

    new_key = sha3.keccak_256(new_bytes)

    let result = "0x" + new_key.substring(24)

    result = utils.getAddress(result)

    console.log("recoverAddr:")
    console.log(result)
}
checkPK(public_key)

