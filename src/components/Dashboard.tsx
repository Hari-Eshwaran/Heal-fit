import React, { useState, useEffect } from 'react';
import { Activity, Brain, Heart, TrendingUp, Calendar, AlertCircle, Clock, PlusCircle, MessageCircle, Pill, FileText, Target, Siren, Stethoscope, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { healthMetrics } from '../data/mockData';
import { format } from 'date-fns';
import { GoogleGenerativeAI } from '@google/generative-ai';
import ReportAnalyzer from './ReportAnalyzer';
import HealthPlanner from './HealthPlanner';
import EmergencyHelp from './EmergencyHelp';
import GoalTracker from './GoalTracker';
import SymptomTracker from './SymptomTracker';
import MedicationReminder from './MedicationReminder';

const genAI = new GoogleGenerativeAI("AIzaSyBTuhevuFKGRA4ZFZiHTJJz0kunCnC72Es");

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('health-summary');
  const [journalEntry, setJournalEntry] = useState('');
  const [journalEntries, setJournalEntries] = useState<Array<{timestamp: string, entry: string}>>([]);
  const [mood, setMood] = useState<string>('');
  const [moodNote, setMoodNote] = useState('');
  const [medicalQuestion, setMedicalQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const defaultMetrics = healthMetrics.aggregated;
  const userMetrics = (user?.email && healthMetrics.byUser[user.email]) || defaultMetrics;

  const moods = ['😊 Great', '🙂 Okay', '😐 Meh', '😟 Stressed', '😢 Sad'];

  const bmi = user?.profile?.weight && user?.profile?.height 
    ? (user.profile.weight / Math.pow(user.profile.height / 100, 2)).toFixed(1)
    : 'N/A';

  const formatAIResponse = (response: string) => {
    return response
      .replace(/\*+/g, '')
      .replace(/\[https?:\/\/[^\]]+\]/g, '')
      .split('\n')
      .map(line => line.trim())
      .filter(line => line)
      .join('\n');
  };

  const askAI = async (prompt: string) => {
    setIsLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setAiResponse(formatAIResponse(response.text()));
    } catch (error) {
      console.error('Error querying AI:', error);
      setAiResponse('Sorry, there was an error processing your request.');
    }
    setIsLoading(false);
  };

  const handleJournalSubmit = () => {
    if (journalEntry.trim()) {
      const newEntry = {
        timestamp: format(new Date(), 'yyyy-MM-dd HH:mm'),
        entry: journalEntry
      };
      setJournalEntries([newEntry, ...journalEntries]);
      setJournalEntry('');
    }
  };

  const handleMoodSubmit = async () => {
    if (mood) {
      const prompt = `I'm feeling ${mood}. Additional context: ${moodNote}. 
        Suggest mindfulness activities, coping strategies, and a daily affirmation. 
        Be empathetic and supportive. Keep the response concise.`;
      await askAI(prompt);
    }
  };

  const handleMedicalQuestion = async () => {
    if (medicalQuestion.trim()) {
      const prompt = `Answer this medical question using verified sources and simple language: ${medicalQuestion}
        Keep the response concise and easy to understand.`;
      await askAI(prompt);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'health-summary':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Heart Rate</p>
                <p className="text-2xl font-bold text-blue-800">{userMetrics.heartRate}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">Blood Pressure</p>
                <p className="text-2xl font-bold text-green-800">{userMetrics.bloodPressure}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-600 font-medium">Sleep</p>
                <p className="text-2xl font-bold text-purple-800">{userMetrics.sleepHours}</p>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <p className="text-sm text-orange-600 font-medium">Steps</p>
                <p className="text-2xl font-bold text-orange-800">{userMetrics.stepsToday}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Progress Tracker</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">BMI Status</span>
                    <span className="text-sm font-medium text-gray-700">{bmi}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">Fitness Goal</span>
                    <span className="text-sm font-medium text-gray-700">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'health-journal':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Health Journal</h3>
              <div className="space-y-4">
                <textarea
                  value={journalEntry}
                  onChange={(e) => setJournalEntry(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Write today's health log..."
                  rows={4}
                />
                <button
                  onClick={handleJournalSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Entry
                </button>
              </div>
              <div className="mt-6 space-y-4">
                {journalEntries.map((entry, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">{entry.timestamp}</p>
                    <p className="mt-2">{entry.entry}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'mental-health':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Mental Health Check-In</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How are you feeling today?
                  </label>
                  <div className="flex space-x-4">
                    {moods.map((m) => (
                      <button
                        key={m}
                        onClick={() => setMood(m)}
                        className={`p-2 rounded-lg ${
                          mood === m ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-100'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <textarea
                    value={moodNote}
                    onChange={(e) => setMoodNote(e.target.value)}
                    className="w-full p-3 border rounded-lg"
                    placeholder="Would you like to share more?"
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleMoodSubmit}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={!mood || isLoading}
                >
                  Get Support
                </button>
                {isLoading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                )}
                {aiResponse && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">AI Support Response:</h4>
                    <div className="prose prose-sm max-w-none">
                      {aiResponse.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'medical-qa':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Medical Q&A</h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={medicalQuestion}
                  onChange={(e) => setMedicalQuestion(e.target.value)}
                  className="w-full p-3 border rounded-lg"
                  placeholder="Ask a medical question..."
                />
                <button
                  onClick={handleMedicalQuestion}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                  disabled={!medicalQuestion.trim() || isLoading}
                >
                  Ask AI
                </button>
                {isLoading && (
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  </div>
                )}
                {aiResponse && (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">Answer:</h4>
                    <div className="prose prose-sm max-w-none">
                      {aiResponse.split('\n').map((paragraph, index) => (
                        <p key={index} className="text-gray-700 leading-relaxed mb-2">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'report-analyzer':
        return <ReportAnalyzer />;

      case 'health-planner':
        return <HealthPlanner />;

      case 'emergency-help':
        return <EmergencyHelp />;

      case 'goal-tracker':
        return <GoalTracker />;

      case 'symptom-tracker':
        return <SymptomTracker />;

      case 'medication-reminder':
        return <MedicationReminder />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <nav className="flex flex-wrap gap-4">
            {[
              { id: 'health-summary', label: 'Health Summary', icon: Heart },
              { id: 'health-journal', label: 'Health Journal', icon: PlusCircle },
              { id: 'mental-health', label: 'Mental Health', icon: Brain },
              { id: 'health-planner', label: 'Health Planner', icon: Target },
              { id: 'medical-qa', label: 'Medical Q&A', icon: MessageCircle },
              { id: 'report-analyzer', label: 'Report Analyzer', icon: FileText },
              { id: 'emergency-help', label: 'Emergency Help', icon: Siren },
              { id: 'goal-tracker', label: 'Goal Tracker', icon: Target },
              { id: 'symptom-tracker', label: 'Symptom Tracker', icon: Stethoscope },
              { id: 'medication-reminder', label: 'Medication Reminder', icon: Pill }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        {renderContent()}

        <div className="mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between">
            <div className="text-white mb-4 sm:mb-0">
              <h3 className="text-2xl font-bold mb-2">Connect with Expert Doctors</h3>
              <p className="text-blue-100 max-w-xl">
                Get personalized medical advice from experienced healthcare professionals. Our verified doctors are ready to help you with your health concerns.
              </p>
            </div>
            <a
              href="https://hexpertify.com/services/doctors/66d842e4210a8bd3caa83c5e"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-indigo-600 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-colors duration-200"
            >
              <span>Find a Doctor</span>
              <ExternalLink className="ml-2 h-5 w-5" />
            </a>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-2">
            <p className="text-blue-100 text-sm text-center">
              ✨ Expert consultation available 24/7 • Secure and confidential • Verified medical professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;