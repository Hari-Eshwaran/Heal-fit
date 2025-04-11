import React, { useState, useEffect } from 'react';
import { Clock, PlusCircle, Pill, Calendar, AlertCircle, X, Check } from 'lucide-react';
import { format } from 'date-fns';

interface Medication {
  id: string;
  name: string;
  category: string;
  time: string;
  customCategory?: string;
}

const defaultCategories = [
  "Pain Relief",
  "Antibiotic",
  "Supplement",
  "Mental Health",
  "Heart Health",
  "Other"
];

const MedicationReminder: React.FC = () => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [newMedication, setNewMedication] = useState({
    name: '',
    category: defaultCategories[0],
    customCategory: '',
    time: format(new Date(), 'HH:mm')
  });
  
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  const handleAddMedication = () => {
    if (!newMedication.name.trim()) {
      setError('Please enter the medication name');
      return;
    }

    const medication: Medication = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMedication.name.trim(),
      category: newMedication.category === 'Other' ? newMedication.customCategory : newMedication.category,
      time: newMedication.time
    };

    setMedications(prev => [medication, ...prev]);
    setNewMedication({
      name: '',
      category: defaultCategories[0],
      customCategory: '',
      time: format(new Date(), 'HH:mm')
    });
    setError('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleRemoveMedication = (id: string) => {
    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Pain Relief': 'bg-red-100 text-red-800',
      'Antibiotic': 'bg-green-100 text-green-800',
      'Supplement': 'bg-blue-100 text-blue-800',
      'Mental Health': 'bg-purple-100 text-purple-800',
      'Heart Health': 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <Pill className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Medication Reminder</h1>
        <p className="text-gray-600">Keep track of your medications and never miss a dose</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <PlusCircle className="w-6 h-6 text-indigo-600 mr-2" />
          Add a Medication Reminder
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medication Name
            </label>
            <input
              type="text"
              value={newMedication.name}
              onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter medication name..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={newMedication.category}
              onChange={(e) => setNewMedication(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {defaultCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {newMedication.category === 'Other' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Category
              </label>
              <input
                type="text"
                value={newMedication.customCategory}
                onChange={(e) => setNewMedication(prev => ({ ...prev, customCategory: e.target.value }))}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter custom category..."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time to Take
            </label>
            <input
              type="time"
              value={newMedication.time}
              onChange={(e) => setNewMedication(prev => ({ ...prev, time: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={handleAddMedication}
            className="w-full md:w-auto px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Add Reminder
          </button>
        </div>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {showSuccess && (
          <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg flex items-center">
            <Check className="w-5 h-5 mr-2" />
            Medication reminder added successfully!
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
          <Clock className="w-6 h-6 text-indigo-600 mr-2" />
          Your Medication Reminders
        </h2>

        {medications.length > 0 ? (
          <div className="space-y-4">
            {medications.map(medication => (
              <div
                key={medication.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-4">
                  <Pill className="w-5 h-5 text-indigo-600" />
                  <div>
                    <h3 className="font-medium text-gray-900">{medication.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(medication.category)}`}>
                        {medication.category}
                      </span>
                      <span className="text-sm text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {medication.time}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMedication(medication.id)}
                  className="p-2 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50 transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No medication reminders yet. Add one above.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicationReminder;