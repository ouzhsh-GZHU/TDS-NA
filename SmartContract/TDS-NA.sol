// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract BCADS {
    uint256 constant kindDataStorageCertificate = 1;
    uint256 constant kindDataAccessCertificate = 2;

    string constant accessTypeRead = "READ";
    string constant accessTypeDel = "DEL";
    string constant accessTypeUpdate = "UPDATE";

    struct EffectiveTime {
        uint256 start;
        uint256 end;
    }

    struct Data {
        uint256 amount;
        uint256 dataSize;
    }

    struct DataStorageCertificate {
        uint256 serialNumber; 
        string algOfsign; 
        uint256 kindOfCertificate; 
        address[2] issuers; 
        uint256 signedTimestamp; 
        EffectiveTime et; 
        address requestor; 
        string dataStorageAddress; 
        string[2] signatures; 
        Data data; 
        string extension; 
    }
    DataStorageCertificate[] public DSCs;
    uint256 public DSCNum;

    struct DataAccessCertificate {
        uint256 serialNumber;
        string algOfsign;
        uint256 kindOfCertificate;
        uint256 issuerDSCserialNumber;
        uint256 signedTimestamp;
        EffectiveTime et;
        address requestor;
        string dataStorageAddress;
        string signature;
        string accessType;
        string encKey;
        Data data;
        string extension;
    }
    DataAccessCertificate[] public DACs;
    uint256 public DACnum;

    struct DataSharingRequest {
        uint256 serialNumber;
        address requestor; 
        uint256 _kindOfCertificate; 
        uint256 _dataSize; 
        uint256 amount; 
        string _extension; 
        bool Handled; 
    }
    DataSharingRequest[] public DataSharingRequests;
    uint256 public DataSharingRequestsNum;

    
    struct DataSharingHandledResp {
        uint256 rspSerialNumber;
        uint256 reqSerialNumber; 
        address requestor; 
        string alg; 
        string storageAddr; 
        string signData; 
        string signature; 
        bool Handled; 
    }
    DataSharingHandledResp[] public DataSharingHandledResps;
    uint256 public latestHandleIdx;
    uint256 public DataSharingHandledRespNum;

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

    struct User {
        address id;
        uint256[5] dataStorageCertificateID;
        uint256 dataStorageCertificateNum;
        uint256[10] dataAccessCertificatesID;
        uint256 dataAccessCertificateNum;
    }
    User[] public Users; 
    uint256 public UsersNum; 

    struct OnChainDSC {
        uint256 serialNumber;
        string hashVale; 
    }
    OnChainDSC[] public OnChainDSCs;
    uint256 public OnChainDSCNum;

    struct OnChainDAC {
        uint256 serialNumber;
        string hashVale;
    }
    OnChainDAC[] public OnChainDACs;
    uint256 public OnChainDACNum; 

    address[] public CAs;
    uint256 public CAsNum;

    address public SP;
    uint256 public SPNum;

    constructor(address[] memory _CAs, address _SP) {
        CAsNum = _CAs.length;
        CAs = _CAs;
        SP = _SP;
        SPNum = 1;
    }

    event dataSharingRequestEvt(
        address indexed requestor,
        uint256 _kindOfCertificate,
        uint256 _dataSize,
        uint256 amount,
        string _extension
    );

    function sendDataSharingRequest(
        uint256 _kindOfCertificate,
        uint256 _dataSize,
        string memory _extension
    ) public payable returns (bool) {
        require(
            _kindOfCertificate == kindDataStorageCertificate ||
                _kindOfCertificate == kindDataAccessCertificate,
            "invalid kind of Certificate"
        );
        require(_dataSize > 0, "invalid size of data");
        require(msg.value > 0, "invalid value");

        DataSharingRequests.push(
            DataSharingRequest(
                DataSharingRequestsNum,
                address(msg.sender),
                _kindOfCertificate,
                _dataSize,
                msg.value,
                _extension,
                false
            )
        );
        DataSharingRequestsNum++;

        emit dataSharingRequestEvt(
            address(msg.sender),
            _kindOfCertificate,
            _dataSize,
            msg.value,
            _extension
        );

        return true;
    }

    function getUnhandledRequests() public view returns (bool, uint256) {
        bool t = false;
        for (uint256 i = 0; i < CAsNum; i++) {
            if (CAs[i] == address(msg.sender)) {
                t = true;
                break;
            }
        }
        require(address(msg.sender) == SP || t, "invalid user");
        for (uint256 i = 0; i < DataSharingRequestsNum; i++) {
            if (DataSharingRequests[i].Handled == false) {
                return (true, DataSharingRequests[i].serialNumber);
            }
        }
        return (false, 0);
    }

    function checkCAorSPIdentity(address addr) private view returns (bool) {
        bool t = false;
        for (uint256 i = 0; i < CAsNum; i++) {
            if (CAs[i] == addr) {
                t = true;
                break;
            }
        }
        if (addr == SP) {
            t = true;
        }
        return t;
    }

    function getAndSaveCAorSPResp(
        uint256 _reqSerialNumber,
        string memory _alg,
        string memory _storageAddr,
        string memory _signData,
        string memory _signature
    ) public {
        bool checkRes = checkCAorSPIdentity(address(msg.sender));
        require(checkRes, "invalid user");

        address addr = address(msg.sender);
        DataSharingHandledResps.push(
            DataSharingHandledResp(
                DataSharingHandledRespNum,
                _reqSerialNumber,
                addr,
                _alg,
                _storageAddr,
                _signData,
                _signature,
                false
            )
        );
        DataSharingHandledRespNum++;
    }

    function getDataSharingHandledResp()
        public
        returns (DataSharingHandledResp memory)
    {
        return DataSharingHandledResps[latestHandleIdx++];
    }

    function handelRespAndGenDSC(uint256 _start, uint256 _end) public {
        require(
            address(msg.sender) == 0x36f8919fBaC57F562763f4731319cA859EE8cF89,
            "invalid caller"
        );

        DataSharingHandledResp
            storage spDataSharingHandledResps = DataSharingHandledResps[
                latestHandleIdx - 2
            ];

        DataSharingHandledResp
            storage caDataSharingHandledResps = DataSharingHandledResps[
                latestHandleIdx - 1
            ];

        address spDataSharingHandledRespsRequestor = spDataSharingHandledResps
            .requestor;
        address caDataSharingHandledRespsRequestor = caDataSharingHandledResps
            .requestor;
        spDataSharingHandledResps.Handled = true;
        caDataSharingHandledResps.Handled = true;
        DataSharingRequests[spDataSharingHandledResps.reqSerialNumber]
            .Handled = true;

        address[2] memory issuers;
        issuers[0] = spDataSharingHandledRespsRequestor;
        issuers[1] = caDataSharingHandledRespsRequestor;

        EffectiveTime memory et = EffectiveTime(_start, _end);

        address requestor = DataSharingRequests[
            spDataSharingHandledResps.reqSerialNumber
        ].requestor;

        string memory dataStorageAddress = spDataSharingHandledResps
            .storageAddr;

        string[2] memory signatures;
        signatures[0] = spDataSharingHandledResps.signature;
        signatures[1] = caDataSharingHandledResps.signature;

        Data memory data = Data(
            DataSharingRequests[spDataSharingHandledResps.reqSerialNumber]
                .amount,
            DataSharingRequests[spDataSharingHandledResps.reqSerialNumber]
                ._dataSize
        );

        string memory _extension = DataSharingRequests[
            spDataSharingHandledResps.reqSerialNumber
        ]._extension;

        DataStorageCertificate memory dsc = DataStorageCertificate(
            DSCNum,
            spDataSharingHandledResps.alg,
            kindDataStorageCertificate,
            issuers,
            _start,
            et,
            requestor,
            dataStorageAddress,
            signatures,
            data,
            _extension
        );

        DSCs.push(dsc);

        bool t = false;
        uint256 exitId = 0;
        for (uint256 i = 0; i < UsersNum; i++) {
           
            if (Users[i].id == requestor) {
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
                    requestor,
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
    }

    function putDSConChain(string memory hash) public {
        uint256 DSCserialNumber = DSCNum - 1;
        OnChainDSCs.push(OnChainDSC(DSCserialNumber, hash));
        OnChainDSCNum++;

        genCRL(DSCserialNumber);
    }

    function genCRL(uint256 DSCserialNumber) private {
        uint256[10] memory RevokeDACs;
        string[10] memory signatures;
        CRLs.push(
            CRL(DSCserialNumber, DSCserialNumber, RevokeDACs, 0, signatures, 0)
        );
        CRLsNum++;
    }

    function revokeDAC(
        uint256 _CRLserialNumber,
        uint256 _revokeDACserialNumber,
        string memory _signature
    ) public {
        address msgSender = address(msg.sender);
        require(_CRLserialNumber < CRLsNum, "invalid _CRLserialNumber");
        require(
            _revokeDACserialNumber < DACnum,
            "invalid _revokeDACserialNumber"
        );
        require(
            msgSender == DSCs[_CRLserialNumber].requestor,
            "invlid invoke user"
        );

        (CRLs[_CRLserialNumber].RevokeDACs)[
            CRLs[_CRLserialNumber].RevokeDACNum
        ] = _revokeDACserialNumber;
        (CRLs[_CRLserialNumber].signatures)[
            CRLs[_CRLserialNumber].signatureNum
        ] = _signature;

        CRLs[_CRLserialNumber].RevokeDACNum++;
        CRLs[_CRLserialNumber].signatureNum++;
    }

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

    function genDAS(
        uint256[] memory uint256s,
        address _requestor,
        string[] memory strings
    ) public payable {
        address msgSender = address(msg.sender);
        bool msgSenderHasCertificate = false;
        for (uint256 i = 0; i < OnChainDSCNum; i++) {
            if (OnChainDSCs[i].serialNumber == uint256s[0]) {
                msgSenderHasCertificate = true;
            }
        }
        require(
            msgSenderHasCertificate,
            "No corresponding data sharing certificate exists"
        );
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
                strings[3],
                data,
                strings[4]
            )
        );

        bool t = false; 
        uint256 exitId = 0; 
        for (uint256 i = 0; i < UsersNum; i++) {
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

    function putDAConChain(string memory hash) public {
        uint256 DACserialNumber = OnChainDACNum;
        OnChainDACs.push(OnChainDAC(DACserialNumber, hash));
        OnChainDACNum++;
    }
}
