// ABI for the HealthRecords smart contract
const HealthRecordsABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "diagnosisHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "imageHash",
        "type": "string"
      }
    ],
    "name": "addReport",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      }
    ],
    "name": "addJournalEntry",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "description",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "severity",
        "type": "string"
      }
    ],
    "name": "logSymptom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getReports",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "diagnosisHash",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "imageHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct HealthRecords.Report[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getJournalEntries",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "contentHash",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct HealthRecords.JournalEntry[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getSymptoms",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "description",
            "type": "string"
          },
          {
            "internalType": "string",
            "name": "severity",
            "type": "string"
          },
          {
            "internalType": "uint256",
            "name": "timestamp",
            "type": "uint256"
          }
        ],
        "internalType": "struct HealthRecords.Symptom[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export default HealthRecordsABI;