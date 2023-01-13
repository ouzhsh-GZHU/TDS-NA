// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract TDSNA_CertificateRef {
    // Certificate type constants 1: Data storage certificate 2: Data access certificate
    uint256 constant kindDataStorageCertificate = 1;
    uint256 constant kindDataAccessCertificate = 2;

    // Data Access Type
    string constant accessTypeRead = "READ";
    string constant accessTypeDel = "DEL";
    string constant accessTypeUpdate = "UPDATE";
    // ---------------------- request processing module
    // System global threshold value Number of initialized NAs in contract constructor
    uint256 public Threshold;

    // Get the threshold value
    function getThreshold() public view returns (uint256) {
        return Threshold;
    }

    address payable[] public NAs; // Addresses of individual NA's in the blockchain
    string[] public NAsPK; // NA's public key for signature verification

    // The constructor initializes the address of the NAs and the threshold value
    constructor(
        address payable[] memory _NAs,
        string[] memory _NAsPK,
        address _SP,
        string memory _SPpubKey
    ) {
        Threshold = _NAs.length;
        NAs = _NAs;
        NAsPK = _NAsPK;
        SP = _SP;
        SPpubKey = _SPpubKey;
        SPNum = 1;
    }

    // Data Sharing Request Structures
    struct DataSharingRequest {
        uint256 serialNumber; // request serial number
        address requestor; // Requestor address
        uint256 _kindOfCertificate; // Request certificate type
        uint256 _dataSize; // Request storage data size
        uint256 amount; // Amount requested
        string _extension; // Request extended messages
    }
    DataSharingRequest[] public DataSharingRequests; // Request list globally visible
    uint256 public DataSharingRequestsNum; // Number of requests
    mapping(uint256 => bool) public DataSharingRequestsHandled; // Log whether the request was processed or not

    mapping(uint256 => string) public DataSharingRequestAggrSigns; // Request the corresponding aggregated signature

    // Partial signature of NA
    struct PatialSigAndParam {
        string R;
        string s;
    }
    // Return partial signature set of NA in the request
    mapping(uint256 => mapping(address => PatialSigAndParam))
        public PatialSigAndParams;

    // User shared data request events
    event dataSharingRequestEvt(
        address indexed requestor,
        uint256 _kindOfCertificate,
        uint256 _dataSize,
        uint256 amount,
        string _extension
    );

    // Store data sharing requests
    // 1.1 User data sharing request function - generates data sharing request (user sends request with inputs: certificate type, amount value, data size, extended message field)
    // The external call uses web3 to simulate the parameters entered by the user, and an algorithm in web3 to check if the data size and amount match
    function sendDataSharingRequest(
        uint256 _kindOfCertificate,
        uint256 _dataSize,
        string memory _extension
    ) public payable returns (bool, uint256) {
        // Input parameter verification
        require(
            _kindOfCertificate == kindDataStorageCertificate ||
                _kindOfCertificate == kindDataAccessCertificate,
            "invalid kind of Certificate"
        );
        require(_dataSize > 0, "invalid size of data");
        require(msg.value > 0, "invalid value");

        // Store data sharing requests
        DataSharingRequests.push(
            DataSharingRequest(
                DataSharingRequestsNum,
                address(msg.sender),
                _kindOfCertificate,
                _dataSize,
                msg.value,
                _extension
            )
        );
        DataSharingRequestsHandled[DataSharingRequestsNum] = false;
        DataSharingRequestsNum++;

        emit dataSharingRequestEvt(
            address(msg.sender),
            _kindOfCertificate,
            _dataSize,
            msg.value,
            _extension
        );
        return (true, DataSharingRequestsNum - 1);
    }

    // Public trust NA to get the latest unprocessed data sharing requests, return whether there are unprocessed requests, request sequence number
    function getUnhandledRequests() public view returns (bool, uint256) {
        bool t = false;
        for (uint256 i = 0; i < Threshold; i++) {
            if (NAs[i] == address(msg.sender)) {
                t = true;
                break;
            }
        }
        // Find unprocessed requests
        for (uint256 i = 0; i < DataSharingRequestsNum; i++) {
            if (DataSharingRequestsHandled[i] == false) {
                return (true, i);
            }
        }
        return (false, 0);
    }

    // Get the request content based on the request sequence number
    function getDataSharingRequest(uint256 serialNumber)
        public
        view
        returns (DataSharingRequest memory)
    {
        return DataSharingRequests[serialNumber];
    }

    // Mark the request as processed
    function setDataSharingRequestsHandled(uint256 serialNumber) public {
        require(
            address(msg.sender) == 0x36f8919fBaC57F562763f4731319cA859EE8cF89,
            "invalid caller"
        );
        DataSharingRequestsHandled[serialNumber] = true;
    }

    // NA finishes processing the request and generates a partial signature for the request
    function sendPatialSigAndParam(
        uint256 _serialNumber,
        string memory _R,
        string memory _s
    ) public {
        bool sender = false;
        // Check if the caller is the NA set for the contract initialization
        for (uint256 i = 0; i < Threshold; i++) {
            if (NAs[i] == msg.sender) {
                sender = true;
                break;
            }
        }
        require(sender, "invalid caller");
        PatialSigAndParams[_serialNumber][msg.sender] = PatialSigAndParam(
            _R,
            _s
        );
    }

    // Get the signature parameters of NA
    function getRequestSig(uint256 _serialNumber)
        public
        view
        returns (string memory R, string memory s)
    {
        R = PatialSigAndParams[_serialNumber][NAs[0]].R;
        for (uint256 i; i < Threshold; i++) {
            string memory sig = PatialSigAndParams[_serialNumber][NAs[i]].s;
            s = strConcat(s, sig);
            s = strConcat(s, ",");
        }
    }

    // String splicing
    function strConcat(string memory _a, string memory _b)
        internal
        pure
        returns (string memory)
    {
        bytes memory _ba = bytes(_a);
        bytes memory _bb = bytes(_b);
        string memory ret = new string(_ba.length + _bb.length);
        bytes memory bret = bytes(ret);
        uint256 k = 0;
        for (uint256 i = 0; i < _ba.length; i++) bret[k++] = _ba[i];
        for (uint256 i = 0; i < _bb.length; i++) bret[k++] = _bb[i];
        return string(ret);
    }

    // DSU sends the aggregated signature to the contract
    function sendAggregateSign(uint256 serialNum, string memory _aggregateSign)
        public
    {
        bool caller = false;
        // Check if the caller is the sender of the request
        if (DataSharingRequests[serialNum].requestor == msg.sender) {
            caller = true;
        }
        require(caller, "invalid caller");
        DataSharingRequestAggrSigns[serialNum] = _aggregateSign;
    }

    // View the aggregated signature of the request
    function getDataSharingRequestAggrSigns(uint256 _serialNum)
        public
        view
        returns (string memory)
    {
        return DataSharingRequestAggrSigns[_serialNum];
    }

    // ---------------------------- entity structure section ----------------------------------------
    // Valid time
    struct EffectiveTime {
        uint256 start; //生效时间
        uint256 end; //终止时间
    }

    // Data-related content
    struct Data {
        uint256 amount;
        uint256 dataSize;
    }

    // Data Storage Certificate structure
    struct DataSharingCertificate {
        uint256 serialNumber; //Certificate Serial Number
        string algOfsign;
        uint256 kindOfCertificate;
        address[5] issuers; // Simulation of 5 NA Subsequent modifications can be made to the multi-NA logic
        uint256 signedTimestamp;
        EffectiveTime et;
        address requestor;
        uint256 requestSerialNumber;
        string dataStorageAddress;
        string aggrSignature;
        Data data;
        string extension;
    }
    DataSharingCertificate[] public DSCs;
    uint256 public DSCNum; // Numbers of DSC

    // DAC structure
    struct DataAccessCertificate {
        uint256 serialNumber;
        string algOfsign;
        uint256 kindOfCertificate;
        uint256 issuerDSCserialNumber;
        uint256 signedTimestamp;
        EffectiveTime et;
        address requestor;
        string dataStorageAddress; // Storage address assigned by the storage server to the data share requestor /storage/userid
        string signature;
        string accessType;
        Data data;
        string extension;
    }
    DataAccessCertificate[] public DACs;
    uint256 public DACnum;

    // Certificate Revocation List Structure
    struct CRL {
        uint256 CRLserialNumber;
        uint256 DSCserialNumber;
        uint256[10] RevokeDACs;
        uint256 RevokeDACNum;
        string[10] signatures;
        uint256 signatureNum;
    }
    CRL[] public CRLs;
    uint256 public CRLsNum;

    // System Users
    struct User {
        address id;
        uint256[5] dataStorageCertificateID;
        uint256 dataStorageCertificateNum;
        uint256[10] dataAccessCertificatesID;
        uint256 dataAccessCertificateNum;
    }
    User[] public Users;
    uint256 public UsersNum;

    // DSC for on-chain storage
    struct OnChainDSC {
        uint256 serialNumber;
        string hashVale;
    }
    OnChainDSC[] public OnChainDSCs;
    uint256 public OnChainDSCNum;

    // DAC for on-chain storage
    struct OnChainDAC {
        uint256 serialNumber;
        string hashVale;
    }
    OnChainDAC[] public OnChainDACs;
    uint256 public OnChainDACNum;

    address public SP; // Global SSP
    string public SPpubKey; // Global SSP Public key
    uint256 public SPNum;

    // ---------------------------- function module function section ----------------------------------------

    // The internal decentralized contract function processes the returned results from the NA and storage server to generate data sharing certificates accordingly
    function GenDSC(uint256 _start, uint256 _end) public {
        require(
            address(msg.sender) == 0x36f8919fBaC57F562763f4731319cA859EE8cF89,
            "invalid caller"
        );

        bool res;
        uint256 _serialNumber;
        (res, _serialNumber) = getUnhandledRequests();
        EffectiveTime memory et = EffectiveTime(_start, _end);

        Data memory data = Data(
            DataSharingRequests[_serialNumber].amount,
            DataSharingRequests[_serialNumber]._dataSize
        );

        DataSharingCertificate memory dsc = DataSharingCertificate(
            DSCNum,
            "Schnorr_Keccak256",
            1,
            [
                0x779BAdf08Eb8219ed3998AA2578dA4b7625E90c2,
                0xa02ebD55400Ceda89ABc19cBbB4C6b6D9a3ea42a,
                0xB477b9f73b7DB1112068B586d783aF391e264f87,
                0xbeC7dFa918DEC8FeF78b6607108e655Eb6659b05,
                0x5d2BACa6d35890Bfc251EdD62b3520ad6F3Ff511
            ], // NA address, can be subsequently modified to variable length NA
            _start,
            et,
            DataSharingRequests[_serialNumber].requestor,
            _serialNumber,
            strConcat(
                "/storage/",
                toString(
                    abi.encodePacked(
                        DataSharingRequests[_serialNumber].requestor
                    )
                )
            ),
            DataSharingRequestAggrSigns[_serialNumber],
            data,
            DataSharingRequests[_serialNumber]._extension
        );

        DSCs.push(dsc);

        DataSharingRequestsHandled[_serialNumber] = true;

        bool t = false; 
        uint256 exitId = 0; 
        for (uint256 i = 0; i < UsersNum; i++) {
            if (Users[i].id == DataSharingRequests[_serialNumber].requestor) {
                t = true;
                exitId = i;
                break;
            }
        }
        if (t == false) {
            uint256[5] memory dataStorageCertificateID;
            dataStorageCertificateID[0] = DSCNum;

            uint256[10] memory dataAccessCertificatesID;
            Users.push(
                User(
                    DataSharingRequests[_serialNumber].requestor,
                    dataStorageCertificateID,
                    1,
                    dataAccessCertificatesID,
                    0
                )
            );
            UsersNum++;
        } else {
            Users[exitId].dataStorageCertificateNum++;
            Users[exitId].dataStorageCertificateID[
                Users[exitId].dataStorageCertificateNum - 1
            ] = DSCNum;
        }
        DSCNum++;
        uint256 tb = address(this).balance;
        for (uint256 i = 0; i < Threshold; i++) {
            NAs[i].transfer(tb / Threshold);
        }
    }

    // Get the balance of the contract
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    // Store DSC to the blockchain
    function putDSConChain(string memory hash) public {
        uint256 DSCserialNumber = DSCNum - 1;
        OnChainDSCs.push(OnChainDSC(DSCserialNumber, hash));
        OnChainDSCNum++;
        
        genCRL(DSCserialNumber);
    }

    // Generate CRL for DSU
    function genCRL(uint256 DSCserialNumber) private {
        uint256[10] memory RevokeDACs;
        string[10] memory signatures;
        CRLs.push(
            CRL(DSCserialNumber, DSCserialNumber, RevokeDACs, 0, signatures, 0)
        );
        CRLsNum++;
    }

    // Undo the DAC
    function revokeDAC(
        uint256 _CRLserialNumber,
        uint256 _revokeDACserialNumber,
        string memory _signature
    ) public {
        address msgSender = address(msg.sender);
        // Find the certificate number in the chain Find the corresponding owner Determine if the caller is the owner of the corresponding certificate
        require(_CRLserialNumber < CRLsNum, "invalid _CRLserialNumber");
        require(
            _revokeDACserialNumber < DACnum,
            "invalid _revokeDACserialNumber"
        );
        require(
            msgSender == DSCs[_CRLserialNumber].requestor,
            "invlid invoke user"
        );

        // Modify the undo content of CRL
        (CRLs[_CRLserialNumber].RevokeDACs)[
            CRLs[_CRLserialNumber].RevokeDACNum
        ] = _revokeDACserialNumber;
        (CRLs[_CRLserialNumber].signatures)[
            CRLs[_CRLserialNumber].signatureNum
        ] = _signature;

        CRLs[_CRLserialNumber].RevokeDACNum++;
        CRLs[_CRLserialNumber].signatureNum++;
    }

    // Check if the DAC has been revoked
    function checkRevokeInfo(uint256 _DACserialNumber)
        public
        view
        returns (bool)
    {
        uint256 DSCserialNumber = DACs[_DACserialNumber].issuerDSCserialNumber;
        for (uint256 i = 0; i < CRLs[DSCserialNumber].RevokeDACNum; i++) {
            if ((CRLs[DSCserialNumber].RevokeDACs)[i] == _DACserialNumber) {
                return true;
            }
        }
        return false;
    }

    // Data sharing users generate data access certificates for data access users
    function genDAS(
        uint256[] memory uint256s,
        address _requestor,
        string[] memory strings
    ) public payable {
        // Parameter Analysis
        address msgSender = address(msg.sender);
        // Check if the corresponding data store certificate is available

        // whether the caller has the certificate
        bool msgSenderHasCertificate = false;
        // Iterate through the certificate serial numbers stored in the chain and check if the same certificate serial number as _issuerDSCserialNumber is stored
        for (uint256 i = 0; i < OnChainDSCNum; i++) {
            if (OnChainDSCs[i].serialNumber == uint256s[0]) {
                msgSenderHasCertificate = true;
            }
        }
        require(
            msgSenderHasCertificate,
            "No corresponding data sharing certificate exists"
        );

        // Determine if the owner of the data storage certificate is the function caller
        require(
            DSCs[uint256s[0]].requestor == msgSender,
            "No certificate issuing qualification"
        );

        EffectiveTime memory et = EffectiveTime(uint256s[1], uint256s[2]);

        Data memory data = Data(msg.value, uint256s[3]);

        DACs.push(
            DataAccessCertificate(
                DACnum,
                strings[0],
                kindDataAccessCertificate,
                uint256s[0],
                uint256s[1],
                et,
                _requestor,
                DSCs[uint256s[0]].dataStorageAddress,
                strings[1],
                strings[2],
                data,
                strings[3]
            )
        );

        bool t = false;
        uint256 exitId = 0;
        for (uint256 i = 0; i < UsersNum; i++) {
            // 用户已经存在
            if (Users[i].id == _requestor) {
                t = true;
                exitId = i;
                break;
            }
        }
        if (t == false) {
            uint256[5] memory dataStorageCertificateID;

            uint256[10] memory dataAccessCertificatesID;
            dataAccessCertificatesID[0] = DACnum;

            User memory user = User(
                _requestor,
                dataStorageCertificateID,
                0,
                dataAccessCertificatesID,
                1
            );
            Users.push(user);
            UsersNum++;
        } else {
            Users[exitId].dataAccessCertificateNum++;
            Users[exitId].dataAccessCertificatesID[
                Users[exitId].dataAccessCertificateNum - 1
            ] = DACnum;
        }
        DACnum++;
    }

    // // Store data access certificates on the blockchain
    function putDAConChain(string memory hash) public {
        uint256 DACserialNumber = OnChainDACNum;
        OnChainDACs.push(OnChainDAC(DACserialNumber, hash));
        OnChainDACNum++;
    }

    // DAU transfer to DSU
    function DAUTransferToDSU(address payable _addr) public payable {
        _addr.transfer(msg.value);
    }

    // Address to string
    function toString(bytes memory data) internal pure returns (string memory) {
        bytes memory alphabet = "0123456789abcdef";

        bytes memory str = new bytes(2 + data.length * 2);
        str[0] = "0";
        str[1] = "x";
        for (uint256 i = 0; i < data.length; i++) {
            str[2 + i * 2] = alphabet[uint256(uint8(data[i] >> 4))];
            str[3 + i * 2] = alphabet[uint256(uint8(data[i] & 0x0f))];
        }
        return string(str);
    }
}
