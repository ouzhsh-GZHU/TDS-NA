var Web3 = require('web3')
var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8551'))

var abi = [
	{
		"inputs": [
			{
				"internalType": "address payable[]",
				"name": "_NAs",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "_NAsPK",
				"type": "string[]"
			},
			{
				"internalType": "address",
				"name": "_SP",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_SPpubKey",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "requestor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_kindOfCertificate",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_dataSize",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "_extension",
				"type": "string"
			}
		],
		"name": "dataSharingRequestEvt",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "CRLs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "CRLserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "DSCserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "RevokeDACNum",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "signatureNum",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CRLsNum",
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
		"inputs": [],
		"name": "DACnum",
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
			}
		],
		"name": "DACs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "serialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "algOfsign",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "kindOfCertificate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "issuerDSCserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "signedTimestamp",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "start",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "end",
						"type": "uint256"
					}
				],
				"internalType": "struct TDSNA_CertificateRef.EffectiveTime",
				"name": "et",
				"type": "tuple"
			},
			{
				"internalType": "address",
				"name": "requestor",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "dataStorageAddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "signature",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "accessType",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dataSize",
						"type": "uint256"
					}
				],
				"internalType": "struct TDSNA_CertificateRef.Data",
				"name": "data",
				"type": "tuple"
			},
			{
				"internalType": "string",
				"name": "extension",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address payable",
				"name": "_addr",
				"type": "address"
			}
		],
		"name": "DAUTransferToDSU",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DSCNum",
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
			}
		],
		"name": "DSCs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "serialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "algOfsign",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "kindOfCertificate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "signedTimestamp",
				"type": "uint256"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "start",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "end",
						"type": "uint256"
					}
				],
				"internalType": "struct TDSNA_CertificateRef.EffectiveTime",
				"name": "et",
				"type": "tuple"
			},
			{
				"internalType": "address",
				"name": "requestor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "requestSerialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "dataStorageAddress",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "aggrSignature",
				"type": "string"
			},
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "dataSize",
						"type": "uint256"
					}
				],
				"internalType": "struct TDSNA_CertificateRef.Data",
				"name": "data",
				"type": "tuple"
			},
			{
				"internalType": "string",
				"name": "extension",
				"type": "string"
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
		"name": "DataSharingRequestAggrSigns",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
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
		"name": "DataSharingRequests",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "serialNumber",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "requestor",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_kindOfCertificate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_dataSize",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_extension",
				"type": "string"
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
		"name": "DataSharingRequestsHandled",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "DataSharingRequestsNum",
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
				"name": "_start",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_end",
				"type": "uint256"
			}
		],
		"name": "GenDSC",
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
			}
		],
		"name": "NAs",
		"outputs": [
			{
				"internalType": "address payable",
				"name": "",
				"type": "address"
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
		"name": "NAsPK",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "OnChainDACNum",
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
			}
		],
		"name": "OnChainDACs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "serialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "hashVale",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "OnChainDSCNum",
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
			}
		],
		"name": "OnChainDSCs",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "serialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "hashVale",
				"type": "string"
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
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "PatialSigAndParams",
		"outputs": [
			{
				"internalType": "string",
				"name": "R",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "s",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SP",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "SPNum",
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
		"inputs": [],
		"name": "SPpubKey",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "Threshold",
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
			}
		],
		"name": "Users",
		"outputs": [
			{
				"internalType": "address",
				"name": "id",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "dataStorageCertificateNum",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "dataAccessCertificateNum",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "UsersNum",
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
				"name": "_DACserialNumber",
				"type": "uint256"
			}
		],
		"name": "checkRevokeInfo",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256[]",
				"name": "uint256s",
				"type": "uint256[]"
			},
			{
				"internalType": "address",
				"name": "_requestor",
				"type": "address"
			},
			{
				"internalType": "string[]",
				"name": "strings",
				"type": "string[]"
			}
		],
		"name": "genDAS",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getBalance",
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
				"name": "serialNumber",
				"type": "uint256"
			}
		],
		"name": "getDataSharingRequest",
		"outputs": [
			{
				"components": [
					{
						"internalType": "uint256",
						"name": "serialNumber",
						"type": "uint256"
					},
					{
						"internalType": "address",
						"name": "requestor",
						"type": "address"
					},
					{
						"internalType": "uint256",
						"name": "_kindOfCertificate",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "_dataSize",
						"type": "uint256"
					},
					{
						"internalType": "uint256",
						"name": "amount",
						"type": "uint256"
					},
					{
						"internalType": "string",
						"name": "_extension",
						"type": "string"
					}
				],
				"internalType": "struct TDSNA_CertificateRef.DataSharingRequest",
				"name": "",
				"type": "tuple"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_serialNum",
				"type": "uint256"
			}
		],
		"name": "getDataSharingRequestAggrSigns",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_serialNumber",
				"type": "uint256"
			}
		],
		"name": "getRequestSig",
		"outputs": [
			{
				"internalType": "string",
				"name": "R",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "s",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getThreshold",
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
		"inputs": [],
		"name": "getUnhandledRequests",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
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
				"internalType": "string",
				"name": "hash",
				"type": "string"
			}
		],
		"name": "putDAConChain",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "hash",
				"type": "string"
			}
		],
		"name": "putDSConChain",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_CRLserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_revokeDACserialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_signature",
				"type": "string"
			}
		],
		"name": "revokeDAC",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "serialNum",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_aggregateSign",
				"type": "string"
			}
		],
		"name": "sendAggregateSign",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_kindOfCertificate",
				"type": "uint256"
			},
			{
				"internalType": "uint256",
				"name": "_dataSize",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_extension",
				"type": "string"
			}
		],
		"name": "sendDataSharingRequest",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_serialNumber",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "_R",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_s",
				"type": "string"
			}
		],
		"name": "sendPatialSigAndParam",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "serialNumber",
				"type": "uint256"
			}
		],
		"name": "setDataSharingRequestsHandled",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]
var contractAddr = '0x7a42bA8ef9cea2ebB028AE0F9bF69DeF8e9715e6'
var myContract = new web3.eth.Contract(abi, contractAddr)

module.exports = ex = {
    web3,
    myContract
}