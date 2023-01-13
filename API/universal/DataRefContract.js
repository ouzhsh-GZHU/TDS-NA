var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8551'))

var abi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "DSCserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "dataStorageAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "DACserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "DAUAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "DAUsignature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "SSPsignature",
				"type": "string"
			}
		],
		"name": "DataAccessAbstractBlock_add",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "DSCserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "DSUsignature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataHash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "DAUAddr",
				"type": "address"
			}
		],
		"name": "DataSharingAbstractBlock_NewVersion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "dataStorageAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "DSCserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "DSUsignature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataHash",
				"type": "string"
			}
		],
		"name": "DataSharingAbstractBlock_Storage",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "DataAccessAbstractBlocks",
		"outputs": [
			{
				"internalType": "string",
				"name": "dataStorageAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "DACserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "version",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "DAUAddr",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "DAUSignature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "SSPSignature",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DataLogsNum",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "DataSharingAbstractBlocks",
		"outputs": [
			{
				"internalType": "string",
				"name": "dataStorageAddress",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "DSCserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "version",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "DSUsignature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataHash",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "DAUAddr",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "DataAccessAbstractBlockNum",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "DSCAbstractBlockVersion",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
var contractAddr = '0xD6728c03813b6b6E4847B90F8C027d41CC710012'
var myContract = new web3.eth.Contract(abi, contractAddr)

module.exports = exdr = {
    web3,
    myContract
}