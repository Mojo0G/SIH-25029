const { ethers } = require('ethers');
require('dotenv').config();

// Contract ABI (you'll need to copy this from artifacts after compilation)
const CONTRACT_ABI = [
  {
    "inputs": [
      {"internalType": "string", "name": "_studentName", "type": "string"},
      {"internalType": "string", "name": "_institutionName", "type": "string"},
      {"internalType": "string", "name": "_registrationNumber", "type": "string"},
      {"internalType": "string", "name": "_course", "type": "string"},
      {"internalType": "string", "name": "_cgpa", "type": "string"}
    ],
    "name": "addCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_studentName", "type": "string"},
      {"internalType": "string", "name": "_institutionName", "type": "string"},
      {"internalType": "string", "name": "_registrationNumber", "type": "string"},
      {"internalType": "string", "name": "_course", "type": "string"},
      {"internalType": "string", "name": "_cgpa", "type": "string"}
    ],
    "name": "verifyCertificate",
    "outputs": [
      {"internalType": "bool", "name": "exists", "type": "bool"},
      {"internalType": "uint256", "name": "issuedAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "_studentName", "type": "string"},
      {"internalType": "string", "name": "_institutionName", "type": "string"},
      {"internalType": "string", "name": "_registrationNumber", "type": "string"},
      {"internalType": "string", "name": "_course", "type": "string"},
      {"internalType": "string", "name": "_cgpa", "type": "string"}
    ],
    "name": "getCertificateDetails",
    "outputs": [
      {"internalType": "bool", "name": "exists", "type": "bool"},
      {"internalType": "string", "name": "studentName", "type": "string"},
      {"internalType": "string", "name": "institutionName", "type": "string"},
      {"internalType": "string", "name": "registrationNumber", "type": "string"},
      {"internalType": "string", "name": "course", "type": "string"},
      {"internalType": "string", "name": "cgpa", "type": "string"},
      {"internalType": "uint256", "name": "issuedAt", "type": "uint256"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      {"indexed": false, "internalType": "string", "name": "studentName", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "institutionName", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "registrationNumber", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "course", "type": "string"},
      {"indexed": false, "internalType": "string", "name": "cgpa", "type": "string"},
      {"indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256"}
    ],
    "name": "CertificateAdded",
    "type": "event"
  }
];

class BlockchainService {
  constructor() {
    this.provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_URL || 'http://localhost:8545');
    this.signer = new ethers.Wallet(process.env.PRIVATE_KEY || '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80', this.provider);
    this.contract = new ethers.Contract(process.env.CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
  }

  async addCertificate(certificateData) {
    const { studentName, institutionName, registrationNumber, course, cgpa } = certificateData;
    
    try {
      const tx = await this.contract.addCertificate(
        studentName,
        institutionName,
        registrationNumber,
        course,
        cgpa
      );
      
      const receipt = await tx.wait();
      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      throw new Error(error.reason || error.message);
    }
  }

  async verifyCertificate(certificateData) {
    const { studentName, institutionName, registrationNumber, course, cgpa } = certificateData;
    
    try {
      const [exists, timestamp] = await this.contract.verifyCertificate(
        studentName,
        institutionName,
        registrationNumber,
        course,
        cgpa
      );
      
      return {
        exists,
        issuedAt: exists ? new Date(Number(timestamp) * 1000).toISOString() : null
      };
    } catch (error) {
      throw new Error(error.reason || error.message);
    }
  }

  async getCertificateDetails(certificateData) {
    const { studentName, institutionName, registrationNumber, course, cgpa } = certificateData;
    
    try {
      const result = await this.contract.getCertificateDetails(
        studentName,
        institutionName,
        registrationNumber,
        course,
        cgpa
      );
      
      if (result[0]) {
        return {
          exists: true,
          studentName: result[1],
          institutionName: result[2],
          registrationNumber: result[3],
          course: result[4],
          cgpa: result[5],
          issuedAt: new Date(Number(result[6]) * 1000).toISOString()
        };
      } else {
        return { exists: false };
      }
    } catch (error) {
      throw new Error(error.reason || error.message);
    }
  }
}

module.exports = new BlockchainService();