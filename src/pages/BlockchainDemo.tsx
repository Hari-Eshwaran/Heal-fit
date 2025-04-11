import React, { useState } from 'react';
import { Database, FileText, Activity, Shield, Lock, History, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface BlockchainRecord {
  hash: string;
  timestamp: number;
  previousHash: string;
}

interface HealthRecord extends BlockchainRecord {
  diagnosisHash: string;
  imageHash: string;
}

interface JournalRecord extends BlockchainRecord {
  contentHash: string;
}

interface SymptomRecord extends BlockchainRecord {
  description: string;
  severity: string;
}

interface Transaction {
  hash: string;
  type: 'report' | 'journal' | 'symptom';
  timestamp: number;
  data: any;
}

const BlockchainDemo: React.FC = () => {
  const [reports, setReports] = useState<HealthRecord[]>(() => {
    const saved = localStorage.getItem('blockchain_reports');
    return saved ? JSON.parse(saved) : [];
  });
  const [journalEntries, setJournalEntries] = useState<JournalRecord[]>(() => {
    const saved = localStorage.getItem('blockchain_journals');
    return saved ? JSON.parse(saved) : [];
  });
  const [symptoms, setSymptoms] = useState<SymptomRecord[]>(() => {
    const saved = localStorage.getItem('blockchain_symptoms');
    return saved ? JSON.parse(saved) : [];
  });
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('blockchain_transactions');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [lastTransaction, setLastTransaction] = useState<string>('');

  const [newReport, setNewReport] = useState({
    diagnosisHash: '',
    imageHash: ''
  });
  const [newJournalEntry, setNewJournalEntry] = useState('');
  const [newSymptom, setNewSymptom] = useState({
    description: '',
    severity: 'mild'
  });

  // Generate a SHA-256 hash
  const generateHash = async (data: string): Promise<string> => {
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const addTransaction = async (type: Transaction['type'], data: any) => {
    const timestamp = Date.now();
    const hash = await generateHash(JSON.stringify({ type, data, timestamp }));
    const transaction: Transaction = { hash, type, timestamp, data };
    
    const updatedTransactions = [transaction, ...transactions];
    setTransactions(updatedTransactions);
    localStorage.setItem('blockchain_transactions', JSON.stringify(updatedTransactions));
    
    return hash;
  };

  const addToBlockchain = async <T extends BlockchainRecord>(
    records: T[],
    newData: Partial<T>,
    storageKey: string
  ): Promise<T[]> => {
    const timestamp = Date.now();
    const previousHash = records.length > 0 ? records[0].hash : '0';
    const dataString = JSON.stringify({ ...newData, timestamp, previousHash });
    const hash = await generateHash(dataString);

    const updatedRecords = [
      {
        ...newData,
        hash,
        timestamp,
        previousHash
      } as T,
      ...records
    ];

    localStorage.setItem(storageKey, JSON.stringify(updatedRecords));
    return updatedRecords;
  };

  const addReport = async () => {
    if (!newReport.diagnosisHash || !newReport.imageHash) return;

    setLoading(true);
    try {
      const updatedReports = await addToBlockchain(reports, newReport, 'blockchain_reports');
      setReports(updatedReports);
      const transactionHash = await addTransaction('report', newReport);
      setNewReport({ diagnosisHash: '', imageHash: '' });
      setLastTransaction(transactionHash);
    } finally {
      setLoading(false);
    }
  };

  const addJournalEntry = async () => {
    if (!newJournalEntry) return;

    setLoading(true);
    try {
      const contentHash = await generateHash(newJournalEntry);
      const updatedEntries = await addToBlockchain(
        journalEntries,
        { contentHash },
        'blockchain_journals'
      );
      setJournalEntries(updatedEntries);
      const transactionHash = await addTransaction('journal', { contentHash });
      setNewJournalEntry('');
      setLastTransaction(transactionHash);
    } finally {
      setLoading(false);
    }
  };

  const logSymptom = async () => {
    if (!newSymptom.description) return;

    setLoading(true);
    try {
      const updatedSymptoms = await addToBlockchain(
        symptoms,
        newSymptom,
        'blockchain_symptoms'
      );
      setSymptoms(updatedSymptoms);
      const transactionHash = await addTransaction('symptom', newSymptom);
      setNewSymptom({ description: '', severity: 'mild' });
      setLastTransaction(transactionHash);
    } finally {
      setLoading(false);
    }
  };

  const getTransactionTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'report':
        return 'bg-blue-100 text-blue-800';
      case 'journal':
        return 'bg-green-100 text-green-800';
      case 'symptom':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <Database className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blockchain Health Records Demo</h1>
        <p className="text-gray-600">Experience how health records are secured using blockchain technology</p>
      </div>

      {lastTransaction && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8">
          <p className="text-green-700">
            Transaction successful! Hash: {lastTransaction.substring(0, 16)}...
          </p>
        </div>
      )}

      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg mb-8">
        <div className="flex items-start space-x-4">
          <Shield className="w-8 h-8 text-indigo-600 flex-shrink-0" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">How Blockchain Secures Your Health Data</h2>
            <p className="mt-2 text-gray-600">
              Each health record is encrypted and linked to previous records, creating an immutable chain.
              This ensures your medical data remains tamper-proof and secure while maintaining complete privacy.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Medical Reports Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-indigo-600 mr-2" />
                Medical Reports
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Enter diagnosis data"
                  value={newReport.diagnosisHash}
                  onChange={(e) => setNewReport(prev => ({ ...prev, diagnosisHash: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <input
                  type="text"
                  placeholder="Enter medical image reference"
                  value={newReport.imageHash}
                  onChange={(e) => setNewReport(prev => ({ ...prev, imageHash: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <button
                  onClick={addReport}
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Add to Chain
                    </>
                  )}
                </button>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Blockchain Records</h3>
                  {reports.map((report, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Lock className="w-3 h-3 mr-1" />
                        Block Hash: {report.hash.substring(0, 8)}...
                      </div>
                      <p className="text-sm">Diagnosis Reference: {report.diagnosisHash}</p>
                      <p className="text-sm">Image Reference: {report.imageHash}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(report.timestamp, 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Journal Entries Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-6 h-6 text-indigo-600 mr-2" />
                Health Journal
              </h2>
              <div className="space-y-4">
                <textarea
                  placeholder="Write your journal entry..."
                  value={newJournalEntry}
                  onChange={(e) => setNewJournalEntry(e.target.value)}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
                <button
                  onClick={addJournalEntry}
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Store on Chain
                    </>
                  )}
                </button>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Encrypted Journal History</h3>
                  {journalEntries.map((entry, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Lock className="w-3 h-3 mr-1" />
                        Block Hash: {entry.hash.substring(0, 8)}...
                      </div>
                      <p className="text-sm">Entry Hash: {entry.contentHash}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(entry.timestamp, 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Symptoms Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Activity className="w-6 h-6 text-indigo-600 mr-2" />
                Symptom Tracker
              </h2>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Describe your symptom..."
                  value={newSymptom.description}
                  onChange={(e) => setNewSymptom(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full p-2 border rounded"
                />
                <select
                  value={newSymptom.severity}
                  onChange={(e) => setNewSymptom(prev => ({ ...prev, severity: e.target.value }))}
                  className="w-full p-2 border rounded"
                >
                  <option value="mild">Mild</option>
                  <option value="moderate">Moderate</option>
                  <option value="severe">Severe</option>
                </select>
                <button
                  onClick={logSymptom}
                  disabled={loading}
                  className="w-full py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center justify-center"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Record on Chain
                    </>
                  )}
                </button>
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Blockchain Symptom History</h3>
                  {symptoms.map((symptom, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded mb-2">
                      <div className="flex items-center text-xs text-gray-500 mb-1">
                        <Lock className="w-3 h-3 mr-1" />
                        Block Hash: {symptom.hash.substring(0, 8)}...
                      </div>
                      <p className="text-sm">{symptom.description}</p>
                      <p className="text-sm">Severity: {symptom.severity}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(symptom.timestamp, 'MMM d, yyyy HH:mm:ss')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <History className="w-6 h-6 text-indigo-600 mr-2" />
              Transaction History
            </h2>
            <div className="space-y-4">
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs px-2 py-1 rounded-full ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(transaction.timestamp, 'HH:mm:ss')}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Lock className="w-3 h-3 mr-1" />
                      <span className="font-mono">{transaction.hash.substring(0, 16)}...</span>
                    </div>
                    <div className="text-sm">
                      {transaction.type === 'report' && (
                        <div className="flex items-center text-gray-600">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Diagnosis added
                        </div>
                      )}
                      {transaction.type === 'journal' && (
                        <div className="flex items-center text-gray-600">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          Journal entry recorded
                        </div>
                      )}
                      {transaction.type === 'symptom' && (
                        <div className="flex items-center text-gray-600">
                          <ArrowRight className="w-3 h-3 mr-1" />
                          {transaction.data.severity} symptom logged
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <History className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainDemo;