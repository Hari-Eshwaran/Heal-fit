import React, { useState, useEffect } from 'react';
import { FileText, Plus, History, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Symptom {
  date: string;
  description: string;
  severity: 'mild' | 'moderate' | 'severe';
}

const SymptomTracker: React.FC = () => {
  const [symptoms, setSymptoms] = useState<Symptom[]>(() => {
    const saved = localStorage.getItem('symptoms');
    return saved ? JSON.parse(saved) : [];
  });
  const [newSymptom, setNewSymptom] = useState('');
  const [severity, setSeverity] = useState<Symptom['severity']>('mild');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    localStorage.setItem('symptoms', JSON.stringify(symptoms));
  }, [symptoms]);

  const handleLogSymptom = () => {
    if (newSymptom.trim()) {
      const symptom: Symptom = {
        date: format(new Date(), 'yyyy-MM-dd HH:mm'),
        description: newSymptom.trim(),
        severity
      };
      setSymptoms(prev => [symptom, ...prev]);
      setNewSymptom('');
      setSeverity('mild');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleLogSymptom();
    }
  };

  const getSeverityColor = (severity: Symptom['severity']) => {
    switch (severity) {
      case 'mild':
        return 'bg-yellow-100 text-yellow-800';
      case 'moderate':
        return 'bg-orange-100 text-orange-800';
      case 'severe':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <FileText className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Symptom Tracker</h1>
        <p className="text-gray-600">Keep track of your symptoms and monitor your health</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Plus className="w-6 h-6 text-indigo-600 mr-2" />
          Log a New Symptom
        </h2>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <textarea
                value={newSymptom}
                onChange={(e) => setNewSymptom(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe any symptom you're experiencing..."
                className="w-full p-3 border rounded-lg resize-none"
                rows={2}
              />
            </div>
            <div className="flex flex-col justify-between">
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Symptom['severity'])}
                className="p-2 border rounded-lg"
              >
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
              <button
                onClick={handleLogSymptom}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
              >
                Log Symptom
              </button>
            </div>
          </div>

          {showSuccess && (
            <div className="flex items-center bg-green-50 text-green-700 p-4 rounded-lg animate-fade-in">
              <CheckCircle className="w-5 h-5 mr-2" />
              Symptom logged successfully!
            </div>
          )}

          {showWarning && (
            <div className="flex items-center bg-yellow-50 text-yellow-700 p-4 rounded-lg animate-fade-in">
              <AlertCircle className="w-5 h-5 mr-2" />
              Please describe the symptom before logging.
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <History className="w-6 h-6 text-indigo-600 mr-2" />
          Symptom History
        </h2>

        {symptoms.length > 0 ? (
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Symptom Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Severity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {symptoms.map((symptom, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {symptom.date}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {symptom.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(symptom.severity)}`}>
                        {symptom.severity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No symptoms logged yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;