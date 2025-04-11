// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HealthRecords {
    struct Report {
        string diagnosisHash;
        string imageHash;
        uint256 timestamp;
        address patient;
    }

    struct JournalEntry {
        string contentHash;
        uint256 timestamp;
        address patient;
    }

    struct Symptom {
        string description;
        string severity;
        uint256 timestamp;
        address patient;
    }

    mapping(address => Report[]) private reports;
    mapping(address => JournalEntry[]) private journalEntries;
    mapping(address => Symptom[]) private symptoms;

    event ReportAdded(address indexed patient, string diagnosisHash, string imageHash);
    event JournalEntryAdded(address indexed patient, string contentHash);
    event SymptomLogged(address indexed patient, string description, string severity);

    function addReport(string memory _diagnosisHash, string memory _imageHash) public {
        reports[msg.sender].push(Report({
            diagnosisHash: _diagnosisHash,
            imageHash: _imageHash,
            timestamp: block.timestamp,
            patient: msg.sender
        }));
        
        emit ReportAdded(msg.sender, _diagnosisHash, _imageHash);
    }

    function addJournalEntry(string memory _contentHash) public {
        journalEntries[msg.sender].push(JournalEntry({
            contentHash: _contentHash,
            timestamp: block.timestamp,
            patient: msg.sender
        }));
        
        emit JournalEntryAdded(msg.sender, _contentHash);
    }

    function logSymptom(string memory _description, string memory _severity) public {
        symptoms[msg.sender].push(Symptom({
            description: _description,
            severity: _severity,
            timestamp: block.timestamp,
            patient: msg.sender
        }));
        
        emit SymptomLogged(msg.sender, _description, _severity);
    }

    function getReports() public view returns (Report[] memory) {
        return reports[msg.sender];
    }

    function getJournalEntries() public view returns (JournalEntry[] memory) {
        return journalEntries[msg.sender];
    }

    function getSymptoms() public view returns (Symptom[] memory) {
        return symptoms[msg.sender];
    }
}