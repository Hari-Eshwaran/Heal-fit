import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Save, User } from 'lucide-react';

const Profile: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState(user?.profile || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <User className="w-6 h-6 text-indigo-600 mr-2" />
          <h2 className="text-2xl font-bold text-gray-900">Health Profile</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Gender</label>
            <select
              name="gender"
              value={formData.gender || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.weight || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height || ''}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Medical History</label>
          <textarea
            name="medicalHistory"
            value={Array.isArray(formData.medicalHistory) ? formData.medicalHistory.join(', ') : formData.medicalHistory || ''}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'medicalHistory',
                value: e.target.value.split(',').map(item => item.trim())
              }
            })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List any significant medical conditions, separated by commas..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Health Goals</label>
          <textarea
            name="healthGoals"
            value={Array.isArray(formData.healthGoals) ? formData.healthGoals.join(', ') : formData.healthGoals || ''}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'healthGoals',
                value: e.target.value.split(',').map(item => item.trim())
              }
            })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="What are your health goals? Separate multiple goals with commas..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Allergies</label>
          <textarea
            name="allergies"
            value={Array.isArray(formData.allergies) ? formData.allergies.join(', ') : formData.allergies || ''}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'allergies',
                value: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List any allergies, separated by commas..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Current Medications</label>
          <textarea
            name="medications"
            value={Array.isArray(formData.medications) ? formData.medications.join(', ') : formData.medications || ''}
            onChange={(e) => handleChange({
              ...e,
              target: {
                ...e.target,
                name: 'medications',
                value: e.target.value.split(',').map(item => item.trim())
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="List current medications, separated by commas..."
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Profile
              </>
            )}
          </button>
        </div>

        {saveSuccess && (
          <div className="absolute bottom-4 right-4 bg-green-50 text-green-800 px-4 py-2 rounded-md shadow-sm">
            Profile saved successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;