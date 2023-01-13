#TDS-NA
TDS-NA: Blockchain-based Trusted Data Sharing Scheme with PKI Authentication
##Prerequisites
In this repository we implement a prototype of TDS-NA (The data content in the code is for demonstration examples).
In order to deploy TDS-NA's smart contract, we need to lay out a private Ethereum network and build mock nodes to join the network.
This demo only contains smart contract code and web3.js operation code for System entity.
It should be noted that for the convenience of demonstration, we simulated SSP in the local disk to complete the data storage, and did not introduce cloud storage services to perform SSP operations, which can be replaced by any user through the corresponding web.js code file. Please note that you need to fill in important elements such as the address of the smart contract you deployed, the path of the contract abi file, and the address of the blockchain account in the corresponding vacancies in the web3.js file.
