// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

// Abstract Block Management Contracts
contract TDSNA_DataRef {
    // structure of Write abstract block 
    struct DataSharingAbstractBlock {
        string dataStorageAddress;
        uint256 DSCserialNumber;
        uint256 version;
        string DSUsignature;
        string dataHash;
        address DAUAddr;
        uint256 DataAccessAbstractBlockNum;
    }

    // Number of summary blocks
    uint256 public DataLogsNum;
    // Write Abstract Block Storage Exp: 0 DSC 0 VERSION
    mapping(uint256 => mapping(uint256 => DataSharingAbstractBlock))
        public DataSharingAbstractBlocks;
    // The latest version of data
    mapping(uint256 => uint256) public DSCAbstractBlockVersion;

    // Read Abstract Block Structure
    struct DataAccessAbstractBlock {
        string dataStorageAddress; 
        uint256 DACserialNumber; 
        uint256 version;
        address DAUAddr;
        string DAUSignature;
        string SSPSignature;
    }
     // Read Abstract Block Storage Exp: 0 DAC 0 VERSION
    mapping(uint256 => mapping(uint256 => mapping(uint256 => DataAccessAbstractBlock)))
        public DataAccessAbstractBlocks;

    // Generate write abstract blocks
    function DataSharingAbstractBlock_Storage(
        string memory dataStorageAddress,
        uint256 DSCserialNumber,
        string memory DSUsignature,
        string memory dataHash
    ) public {
        DataSharingAbstractBlock memory dsab = DataSharingAbstractBlock(
            dataStorageAddress,
            DSCserialNumber,
            0,
            DSUsignature,
            dataHash,
            0x0000000000000000000000000000000000000000, // The originator of the modification data
            0
        );
        DataSharingAbstractBlocks[DSCserialNumber][0] = dsab;
        DataLogsNum++;
        DSCAbstractBlockVersion[DSCserialNumber] = 0;
    }

    // Write abstract blocks for update operation records
    function DataSharingAbstractBlock_NewVersion(
        uint256 DSCserialNumber,
        string memory DSUsignature,
        string memory dataHash,
        address DAUAddr
    ) public {
        string memory dataStorageAddress = DataSharingAbstractBlocks[
            DSCserialNumber
        ][0].dataStorageAddress;
        uint256 version = DSCAbstractBlockVersion[DSCserialNumber] + 1;
        DataSharingAbstractBlock memory dsab = DataSharingAbstractBlock(
            dataStorageAddress,
            DSCserialNumber,
            version,
            DSUsignature,
            dataHash,
            DAUAddr,
            0
        );
        DataSharingAbstractBlocks[DSCserialNumber][version] = dsab;
        DSCAbstractBlockVersion[DSCserialNumber]++;
    }

    // Generate read abstract blocks
    function DataAccessAbstractBlock_add(
        uint256 DSCserialNumber,
        string memory dataStorageAddress,
        uint256 DACserialNumber,
        address DAUAddr,
        string memory DAUsignature,
        string memory SSPsignature
    ) public {
        require(
            msg.sender == 0x0CA67fE81D999573E4161EcC7E1987949f4695a5,
            unicode"非法调用者"
        );
        uint256 version = DSCAbstractBlockVersion[DSCserialNumber];
        DataAccessAbstractBlock memory daab = DataAccessAbstractBlock(
            dataStorageAddress,
            DACserialNumber,
            version,
            DAUAddr,
            DAUsignature,
            SSPsignature
        );
        DataSharingAbstractBlock storage d = DataSharingAbstractBlocks[
            DSCserialNumber
        ][version];
        uint256 dataAccessAbstractBlockNum = d.DataAccessAbstractBlockNum;
        DataAccessAbstractBlocks[DSCserialNumber][version][
            dataAccessAbstractBlockNum
        ] = daab;
        d.DataAccessAbstractBlockNum++;
    }
}
