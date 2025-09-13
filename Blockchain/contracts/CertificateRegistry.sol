// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {
    struct Certificate {
        string studentName;
        string institutionName;
        string registrationNumber;
        string course;
        string cgpa;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => Certificate) private certificates;

    event CertificateAdded(
        string studentName,
        string institutionName,
        string registrationNumber,
        string course,
        string cgpa,
        uint256 timestamp
    );

    function _generateCertificateHash(
        string memory _studentName,
        string memory _institutionName,
        string memory _registrationNumber,
        string memory _course,
        string memory _cgpa
    ) private pure returns (bytes32) {
        return keccak256(
            abi.encodePacked(
                _studentName,
                _institutionName,
                _registrationNumber,
                _course,
                _cgpa
            )
        );
    }

    function addCertificate(
        string memory _studentName,
        string memory _institutionName,
        string memory _registrationNumber,
        string memory _course,
        string memory _cgpa
    ) public {
        bytes32 certificateHash = _generateCertificateHash(
            _studentName,
            _institutionName,
            _registrationNumber,
            _course,
            _cgpa
        );

        require(!certificates[certificateHash].exists, "Certificate already exists");

        // Store the certificate
        certificates[certificateHash] = Certificate({
            studentName: _studentName,
            institutionName: _institutionName,
            registrationNumber: _registrationNumber,
            course: _course,
            cgpa: _cgpa,
            timestamp: block.timestamp,
            exists: true
        });

        emit CertificateAdded(
            _studentName,
            _institutionName,
            _registrationNumber,
            _course,
            _cgpa,
            block.timestamp
        );
    }

    function verifyCertificate(
        string memory _studentName,
        string memory _institutionName,
        string memory _registrationNumber,
        string memory _course,
        string memory _cgpa
    ) public view returns (bool exists, uint256 issuedAt) {
        bytes32 certificateHash = _generateCertificateHash(
            _studentName,
            _institutionName,
            _registrationNumber,
            _course,
            _cgpa
        );

        Certificate memory cert = certificates[certificateHash];
        
        return (cert.exists, cert.timestamp);
    }

    function getCertificateDetails(
        string memory _studentName,
        string memory _institutionName,
        string memory _registrationNumber,
        string memory _course,
        string memory _cgpa
    ) public view returns (
        bool exists,
        string memory studentName,
        string memory institutionName,
        string memory registrationNumber,
        string memory course,
        string memory cgpa,
        uint256 issuedAt
    ) {
        bytes32 certificateHash = _generateCertificateHash(
            _studentName,
            _institutionName,
            _registrationNumber,
            _course,
            _cgpa
        );

        Certificate memory cert = certificates[certificateHash];
        
        if (cert.exists) {
            return (
                true,
                cert.studentName,
                cert.institutionName,
                cert.registrationNumber,
                cert.course,
                cert.cgpa,
                cert.timestamp
            );
        } else {
            return (false, "", "", "", "", "", 0);
        }
    }
}